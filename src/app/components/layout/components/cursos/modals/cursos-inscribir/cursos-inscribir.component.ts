import { SnackbarError } from './../../../../../../helpers/components/snackBarError/snackbarError.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { CoursesServices } from '../../../mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { SnackBars } from '../../../../services/snackBars.service';
import { CourseGetI } from '../../../mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';

@Component({
  selector: 'app-cursos-inscribir',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [CoursesServices, systemInformationService],
  templateUrl: './cursos-inscribir.component.html',
  styleUrl: './cursos-inscribir.component.css'
})
export class CursosInscribirComponent implements OnInit {

  inscripcionForm: FormGroup
  usuarioActual!: loggedUserI
  curso!: CourseGetI


  constructor(
    public cursoService: CoursesServices,
    public dialogRef: MatDialogRef<CursosInscribirComponent>,
    public fb: FormBuilder,
    private appHelpers: HerlperService,
    private snackbar: SnackBars,
    private InformationService: systemInformationService,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.curso = data.course;
    this.usuarioActual = InformationService.localUser;
    console.log(data);
    this.inscripcionForm = fb.group({
      objetivoPrincipal: new FormControl('', Validators.required),
      resultadoEsperado: new FormControl('', Validators.required),
      experienciaPrevia: new FormControl('', Validators.required),
      idColaborador: this.usuarioActual.idPersona,
      idCurso: this.curso.idCurso
    })
  }
  ngOnInit(): void {
    console.log(this.data);
  }

  postInscripcion() {
    this.cursoService.postIncripcion(this.inscripcionForm.value)
      .subscribe((res: any) => {
        console.log(res);
        this.appHelpers.handleResponse(res, () => this.cerrar(), this.inscripcionForm)
      })
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.inscripcionForm.invalid) {
      this.snackbar.snackbarError('Debes completar el formulario para guardar');
      return;
    }else{
      this.snackbar.snackbarLouder(true);
      this.postInscripcion();
    }
  }

}
