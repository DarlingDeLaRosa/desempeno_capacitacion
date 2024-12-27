import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { ColaboradoresCursoComponent } from '../../../../../../helpers/components/modalView/colaboradores-curso/colaboradores-curso.component';
import { PlanMejoraService } from '../../services/plan-mejora.service';
import { RecomendacionesPlanMejoraI } from '../../interfaces/plan-mejora.interface';
import { ResultadoRecomendacionComponent } from '../../modals/resultado-recomendacion/resultado-recomendacion.component';

@Component({
  selector: 'app-plan-mejora-resultado',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [PlanMejoraService],
  templateUrl: './plan-mejora-resultado.component.html',
  styleUrl: './plan-mejora-resultado.component.css'
})
export class PlanMejoraResultadoComponent implements OnInit {

  ResultadoPlanMejoraList!: RecomendacionesPlanMejoraI [];

  constructor(
    public dialog: MatDialog,
    private planmejoraService: PlanMejoraService
  ) { }


  ngOnInit(): void {
    this.getResultadoPlanMejore();
  }

  getResultadoPlanMejore() {
    this.planmejoraService.getResultadoPlanMejora().subscribe((resp: any) => {
      this.ResultadoPlanMejoraList = resp.data;
    })
  }

  openModal(colaboradores:any, nombrecurso:string): void {
    const dialogRef = this.dialog.open(ResultadoRecomendacionComponent, {
      width: '900px',
      data: { colaboradores: colaboradores, nombreCurso:nombrecurso }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
