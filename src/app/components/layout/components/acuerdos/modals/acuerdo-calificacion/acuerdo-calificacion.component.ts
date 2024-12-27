import { Component, Inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GoalGetI } from '../../../mantenimiento/mantenimiento-options/metas/interface/metas.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { agreementService } from '../../services/acuerdo.service';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { LoginClassGuard } from '../../../../../../guards/login-class.guard';

@Component({
  selector: 'app-acuerdo-calificacion',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './acuerdo-calificacion.component.html',
  styleUrl: './acuerdo-calificacion.component.css'
})
export class AcuerdoCalificacionComponent implements OnInit{

  goal!:any;
  nameCollaborator:string = '';
  selectedFile: File | null = null;
  selectedFileName: string | undefined;
  califiacionForm!:FormGroup;
  safeUrl: SafeResourceUrl | null = null;
  valorMeta: number = 0;

  constructor(
    private fb:FormBuilder,
    private agreementService:agreementService,
    private SnackBar:SnackBars,
    private appHelpers: HerlperService,
    public dialogRef: MatDialogRef<AcuerdoCalificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{meta:GoalGetI, nombre:string})

    {
    this.goal = data.meta;
    this.valorMeta = this.goal.valor;
    this.nameCollaborator=data.nombre;
    this.califiacionForm = fb.group({
      calificacion: new FormControl<number>(0,[Validators.required]),
      observacion: new FormControl<string>('',[this.Validator()]),
    })
  }
  ngOnInit(): void {
    this.setCalificacionForm()
  }

//metodo para seleccionar el documento
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }
//cargar la
  setCalificacionForm(){
    this.selectedFileName = this.goal.nombreDoc
    this.safeUrl = this.goal.enlaceDoc
    this.califiacionForm.patchValue({
      calificacion: this.goal.calificacion,
      observacion: this.goal.observacion
    })
  }

//metodo para ahcer el post de la calificacion
  postCalificacion(formdata:any){
    this.agreementService.postGoalCalificacion(formdata).subscribe((resp)=>{
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.cerrar(),this.califiacionForm);
    })
  }
//abre el documento en una pagina en blanco
  openLinkInNewTab(): void {
    if (this.safeUrl) {
      const url = this.safeUrl as string;
      window.open(url, '_blank');
    }
  }

  //cierra el modal
  cerrar(): void {
    this.dialogRef.close();
  }
  Validator() {
    return (control: any) => {
      const value = control.value || '';
      const errors: any = {};
      // Validar que sea específica (mínimo 10 caracteres como ejemplo)
      if (value.length > 20) {
        errors['muyCorta'] =
          'La observacion de la meta debe ser mas corta.';
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  enviarDatos() {
  //la calificacion no puede ser mas alta que el valor de la meta
    if (this.califiacionForm.get('calificacion')!.value > this.valorMeta)
    {
      this.SnackBar.snackbarError('La calificación debe ser menor o igual al valor de la meta')
      return;
    }
    //debe seleccionar un archivo para guardar
    if (this.selectedFileName == null) {
      this.SnackBar.snackbarError('Debe selecionar un documento para guardar')
      return;
    }
    // Crear el FormData y agregar el archivo y la otra propiedad
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }
    formData.append('calificacion', this.califiacionForm.get('calificacion')!.value);
    formData.append('Observaciones', this.califiacionForm.get('observacion')!.value);
    formData.append('idDetalleMeta', this.goal.idAcuerdoDetalle);

    if(this.califiacionForm.invalid){
    this.SnackBar.snackbarError('El formulario es inválido')
    return;
     }else{
       this.postCalificacion(formData)
     }
    }
  }


