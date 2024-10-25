import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { ColaboradoresCursoComponent } from '../../../../../../helpers/components/modalView/colaboradores-curso/colaboradores-curso.component';

@Component({
  selector: 'app-plan-mejora-resultado',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './plan-mejora-resultado.component.html',
  styleUrl: './plan-mejora-resultado.component.css'
})
export class PlanMejoraResultadoComponent {

  colaboradores = [
    { nombre: 'Darling De La Rosa Vanderhorst', cargo: 'Administrador de Base de Datos', genero: 'M', nivel: 'IV' },
    { nombre: 'Roberto Mayi', cargo: 'Encargado de División de Desarrollo', genero: 'M', nivel: 'V' },
    { nombre: 'Juan Perez', cargo: 'Administrador de Base de Datos', genero: 'M', nivel: 'IV' },
    { nombre: 'Juana Peralta', cargo: 'Auxiliar de Contable', genero: 'F', nivel: 'III' },
    { nombre: 'Jonas Diaz', cargo: 'Programador', genero: 'M', nivel: 'IV' },
    { nombre: 'Yomaira Sarante', cargo: 'Secretaria', genero: 'F', nivel: 'II' }
  ];

  constructor(public dialog: MatDialog) {}

  openModal(): void {
    const dialogRef = this.dialog.open(ColaboradoresCursoComponent, {
      width: '900px',
      height: '600px',
      data: {  colaboradores: this.colaboradores }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal fue cerrado');
    });
  }

}
