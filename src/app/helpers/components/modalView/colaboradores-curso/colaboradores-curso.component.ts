import { Component,Inject } from '@angular/core';
import { MaterialComponents } from '../../../material.components';
import { ClassImports } from '../../../class.components';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { CourseGetI } from '../../../../components/layout/components/mantenimiento/mantenimiento-options/cursos/interfaces/cursos.interface';
import { CoursesServices } from '../../../../components/layout/components/mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { HerlperService } from '../../../../components/layout/services/appHelpers.service';
import { SnackBars } from '../../../../components/layout/services/snackBars.service';

@Component({
  selector: 'app-colaboradores-curso',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './colaboradores-curso.component.html',
  styleUrls: ['./colaboradores-curso.component.css']  // Aquí está corregido
})
export class ColaboradoresCursoComponent {


  constructor(
    private courseService:CoursesServices,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    public dialogRef: MatDialogRef<ColaboradoresCursoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    console.log(data);
  }

  removeItem(index: number) {
    this.data.curso.inscripcionesObj.splice(index, 1); // Elimina el elemento en el índice especificado
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  async deleteInscripcion(id: number, index:number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()
    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.courseService.deleteInscripcion(id)
        .subscribe((res: any) =>
        {
           this.appHelpers.handleResponse(res, () =>  this.removeItem(index))
         })
    }
  }

}
