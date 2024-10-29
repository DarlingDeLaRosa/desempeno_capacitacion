import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { CoursesServices } from '../../../mantenimiento/mantenimiento-options/cursos/services/cursos.service';
import { ResponseI } from '../../../../../interfaces/generalInteerfaces';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { SnackBars } from '../../../../services/snackBars.service';

@Component({
  selector: 'app-cursos-miembros',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  providers:[CoursesServices],
  templateUrl: './cursos-miembros.component.html',
  styleUrl: './cursos-miembros.component.css'
})
export class CursosMiembrosComponent implements OnInit{

  hijosList!: any[] ;

  constructor
  (
    private cursosService: CoursesServices,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
  ) {}

  ngOnInit(): void {
    this.getHijosColaborador();
  }

  getHijosColaborador(){
    this.cursosService.getHijosColaborador().subscribe((resp:any)=>{
      this.hijosList = resp.data.hijos;
      console.log(this.hijosList);
    })
  }

async deleteInscripcion(id: number) {
  let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()
  if (removeDecision) {
    this.snackBar.snackbarLouder(true)
    this.cursosService.deleteInscripcion(id)
      .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getHijosColaborador()) })
  }
}



}
