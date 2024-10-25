import { Component,Inject } from '@angular/core';
import { MaterialComponents } from '../../../material.components';
import { ClassImports } from '../../../class.components';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { CourseGetI } from '../../../../components/layout/components/mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';

@Component({
  selector: 'app-colaboradores-curso',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './colaboradores-curso.component.html',
  styleUrls: ['./colaboradores-curso.component.css']  // Aquí está corregido
})
export class ColaboradoresCursoComponent {


  constructor(
    public dialogRef: MatDialogRef<ColaboradoresCursoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
