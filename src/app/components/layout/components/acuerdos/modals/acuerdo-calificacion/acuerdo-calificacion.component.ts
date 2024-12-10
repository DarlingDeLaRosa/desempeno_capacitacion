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
    })
  }
  ngOnInit(): void {
    this.setCalificacionForm()
  }


  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  setCalificacionForm(){
    this.selectedFileName = this.goal.nombreDoc
    this.safeUrl = this.goal.enlaceDoc
    this.califiacionForm.patchValue({
      calificacion: this.goal.calificacion,
    })
  }

//metodo para ahcer el post de la calificacion
  postCalificacion(formdata:any){
    this.agreementService.postGoalCalificacion(formdata).subscribe((resp)=>{
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.cerrar(),this.califiacionForm);
      console.log(resp);
    })
  }

  openLinkInNewTab(): void {
    if (this.safeUrl) {
      const url = this.safeUrl as string;
      window.open(url, '_blank');
    }
  }
  cerrar(): void {
    this.dialogRef.close();
  }

  enviarDatos() {
    if (this.califiacionForm.get('calificacion')!.value > this.valorMeta)
    {
    this.SnackBar.snackbarError('La calificación debe ser menor o igual al valor de la meta')
      return;
    }
    // Crear el FormData y agregar el archivo y la otra propiedad
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }
    formData.append('calificacion', this.califiacionForm.get('calificacion')!.value);
    formData.append('idDetalleMeta', this.goal.idAcuerdoDetalle);
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    if(this.califiacionForm.invalid){
    this.SnackBar.snackbarError('Debes poner una califiación para guardar')
    return;
     }else{
       this.postCalificacion(formData)
     }
    }
  }


