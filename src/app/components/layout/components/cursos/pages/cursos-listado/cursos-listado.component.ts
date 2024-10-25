import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { ColaboradoresCursoComponent } from '../../../../../../helpers/components/modalView/colaboradores-curso/colaboradores-curso.component';
import { CoursesServices } from '../../../mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { ResponseI } from '../../../../../interfaces/generalInteerfaces';
import { CourseGetI, CourseI } from '../../../mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';

@Component({
  selector: 'app-cursos-listado',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  providers: [CoursesServices],
  templateUrl: './cursos-listado.component.html',
  styleUrl: './cursos-listado.component.css'
})
export class CursosListadoComponent implements OnInit{
  cursoList: Array<CourseGetI> = [];

  colaboradores = [
    // { nombre: 'Darling De La Rosa Vanderhorst', cargo: 'Administrador de Base de Datos', genero: 'M', nivel: 'IV' },
    // { nombre: 'Roberto Mayi', cargo: 'Encargado de División de Desarrollo', genero: 'M', nivel: 'V' },
    // { nombre: 'Juan Perez', cargo: 'Administrador de Base de Datos', genero: 'M', nivel: 'IV' },
    // { nombre: 'Juana Peralta', cargo: 'Auxiliar de Contable', genero: 'F', nivel: 'III' },
    // { nombre: 'Jonas Diaz', cargo: 'Programador', genero: 'M', nivel: 'IV' },
    // { nombre: 'Yomaira Sarante', cargo: 'Secretaria', genero: 'F', nivel: 'II' },
    // { nombre: 'Darling De La Rosa Vanderhorst', cargo: 'Administrador de Base de Datos', genero: 'M', nivel: 'IV' },
    // { nombre: 'Roberto Mayi', cargo: 'Encargado de División de Desarrollo', genero: 'M', nivel: 'V' },
    // { nombre: 'Juan Perez', cargo: 'Administrador de Base de Datos', genero: 'M', nivel: 'IV' },
    // { nombre: 'Juana Peralta', cargo: 'Auxiliar de Contable', genero: 'F', nivel: 'III' },
    // { nombre: 'Jonas Diaz', cargo: 'Programador', genero: 'M', nivel: 'IV' },
    // { nombre: 'Yomaira Sarante', cargo: 'Secretaria', genero: 'F', nivel: 'II' }
  ];

  constructor(
    public dialog: MatDialog,
    public cursosService:CoursesServices
    ) {}

  ngOnInit(): void {
   this.getCursos();
  }

  getCursos(){
    this.cursosService.getCourses().subscribe((resp:ResponseI)=>{
      this.cursoList = resp.data;
      console.log(this.cursoList);
    })
  }

  openModal(curso: CourseGetI): void {
    const dialogRef = this.dialog.open(ColaboradoresCursoComponent, {
      width: '900px',
      height: '620px',
      data: { curso }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('El modal fue cerrado');
    });
  }
}
