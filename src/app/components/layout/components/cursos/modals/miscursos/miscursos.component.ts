import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MatDialogRef } from '@angular/material/dialog';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { CoursesServices } from '../../../mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { CourseGetI } from '../../../mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';

@Component({
  selector: 'app-miscursos',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  providers: [CoursesServices, IntranetServices],
  templateUrl: './miscursos.component.html',
  styleUrl: './miscursos.component.css'
})
export class MiscursosComponent implements OnInit{

  cursosList: Array<CourseGetI> = [];
  cursosCompletado: Array<CourseGetI> = [];      // Lista de cursos con estado 1
  cursosPendiente: Array<CourseGetI> = [];

  constructor(
    private coursesService: CoursesServices,
    private intranetService: IntranetServices,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    public dialogRef: MatDialogRef<MiscursosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


ngOnInit(): void {
  console.log();

  this.getIncripcionesColaborador()
}

getIncripcionesColaborador(){
  this.coursesService.getInscripcionesColaborador()
  .subscribe((res: any) => {
    this.cursosList = res.data;

    this.cursosCompletado = this.cursosList.filter(curso => curso.idEstado === 1);
    this.cursosPendiente = this.cursosList.filter(curso => curso.idEstado === 2);
    console.log(this.cursosPendiente);
  })
}

async deleteInscripcion(id: number) {
  let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()
  if (removeDecision) {
    this.snackBar.snackbarLouder(true)
    this.coursesService.deleteInscripcion(id)
      .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getIncripcionesColaborador()) })
  }
}

cerrar(): void {
    this.dialogRef.close();
  }
}
