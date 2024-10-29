import { MiscursosComponent } from './../../modals/miscursos/miscursos.component';
import { MaterialComponents } from './../../../../../../helpers/material.components';
import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { CursosInscribirComponent } from '../../modals/cursos-inscribir/cursos-inscribir.component';
import { CoursesServices } from '../../../mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { ResponseI } from '../../../../../interfaces/generalInteerfaces';
import { CourseGetI, CourseI } from '../../../mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';
import { LoaderComponent } from '../../../../../../helpers/components/loader/loader.component';
import { LoaderService } from '../../../../../../helpers/service/loader.service';
import { finalize } from 'rxjs';



@Component({
  selector: 'app-cursos-tablero',
  standalone: true,
  imports: [MaterialComponents, ClassImports, LoaderComponent],
  providers: [CoursesServices, LoaderService],
  templateUrl: './cursos-tablero.component.html',
  styleUrl: './cursos-tablero.component.css'
})
export default class CursosTableroComponent implements  OnInit{

  cursoTableroList: Array<CourseGetI> = [];
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private courseService:CoursesServices,
    private loaderService: LoaderService
    ){}
  ngOnInit(): void {
    // this.courseService.getUsuarioLocal(); //esto se exploto cuando envie la funcion para el systemInformation
    this.getCursosTablero();
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });

  }
  getCursosTablero() {
    this.loaderService.show();
    this.courseService.getCoursesDashboard()
      .pipe(finalize(() => this.loaderService.hide())) // Se asegura de ocultar el loader al finalizar
      .subscribe({ next: (resp) => {
          this.cursoTableroList = resp.data;
          console.log(this.cursoTableroList);
        }
      });
  }
  openModal(): void {
    const dialogRef = this.dialog.open(MiscursosComponent, {
      width: '900px',
      height: '800px',

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCursosTablero();
    });
  }
  openModalCursosIncribir(course:CourseGetI): void {
    if (!course.interno) {
      window.open(course.link, '_blank');
    }else{
      const dialogRef = this.dialog.open(CursosInscribirComponent, {
        width: '900px',
        data: { course }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.getCursosTablero();
      });
    }
  }


}

