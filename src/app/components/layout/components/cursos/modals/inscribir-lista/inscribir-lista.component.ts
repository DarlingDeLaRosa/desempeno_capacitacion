import { MaterialComponents } from './../../../../../../helpers/material.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { CoursesServices } from '../../../mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { CourseGetI } from '../../../mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';
import { Observable, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { SnackBars } from '../../../../services/snackBars.service';

@Component({
  selector: 'app-inscribir-lista',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './inscribir-lista.component.html',
  styleUrl: './inscribir-lista.component.css'
})
export class InscribirListaComponent implements OnInit {

  collaboratortControl = new FormControl();
  inscripcionForm: FormGroup
  findForm: FormGroup
  usuarioActual!: loggedUserI
  curso!: CourseGetI
  filteredCollaborator!: CollaboratorsGetI[]
  selectedCollaborator: CollaboratorsGetI | null = null; // Holds the selected product

  constructor(
    public fb: FormBuilder,
    private InformationService: systemInformationService,
    private intranetService: IntranetServices,
    private courseService: CoursesServices,
    private appHelpers: HerlperService,
    private snackbar: SnackBars,
    public dialogRef: MatDialogRef<InscribirListaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.curso = data.curso;
    this.usuarioActual = InformationService.localUser;

    //Formulario para la inscripcion
    this.inscripcionForm = fb.group({
      objetivoPrincipal: new FormControl('', Validators.required),
      resultadoEsperado: new FormControl('', Validators.required),
      experienciaPrevia: new FormControl('', Validators.required),
      idColaborador: 0,
      idCurso: this.curso.idCurso
    }),
      //Formulario para los datos del buscarColaborador
      this.findForm = fb.group({
        findCollaborator: new FormControl(''),
        cargo: new FormControl(''),
        departamento: new FormControl(''),
      })
  }

  ngOnInit(): void {

  }


  //Metodo para obtener los colaboradores mediante el autocomplete
  getCollaboratorByLetras() {
    const autoCompleteValue = this.findForm.value.findCollaborator;
    if (autoCompleteValue && autoCompleteValue.length > 3) {
      this.intranetService.findPeopleByUser(autoCompleteValue)
        .subscribe((res: any) => {
          this.filteredCollaborator = res.data.filter((users: CollaboratorsGetI)=>{ return users.estadoObj.idEstado == 1 })
        })
    } else {
      this.filteredCollaborator = []
    }
  }

  //se ejecuta cuando seleciono un colaborador en el search
  onCollaboratorSelected(collaorator: CollaboratorsGetI) {
    this.selectedCollaborator = collaorator;

    //setear valores a los formularios
    this.findForm.patchValue({
      cargo: collaorator.cargo.nombre,
      departamento: collaorator.departamento.nombre
    });

    this.inscripcionForm.patchValue({
      idColaborador: collaorator.idPersona,
    });
  }

  //metodo para hacer una inscripcion
  postInscripcion() {
    this.courseService.postIncripcion(this.inscripcionForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.cerrar(), this.inscripcionForm)
      })
  }

  //esto es para en el input del autocmplete se muestre el usuario del colaborador cuando lo seleccione
  displayCollaboratorUser(collaborator?: CollaboratorsGetI): string {
    return collaborator ? collaborator.usuario : '';
  }



  //metodo para cerrar el modal
  cerrar(): void {
    this.dialogRef.close();
  }


  save() {
    if (this.inscripcionForm.invalid || (this.inscripcionForm.get('idColaborador')?.value === 0)) {
      this.snackbar.snackbarError('Debes completar el formulario para gurardar');
      return;
    } else {
      this.postInscripcion();
    }

  }
}




