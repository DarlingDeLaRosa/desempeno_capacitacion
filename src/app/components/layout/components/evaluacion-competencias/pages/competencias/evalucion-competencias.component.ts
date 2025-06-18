import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { EvaluacionModalviewComponent } from '../../modals/evaluacion-modalview/evaluacion-modalview.component';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { EvaluationBehaviorsI, EvaluationCompetencyGetI } from '../../interface/evaluacion-competencias.interface';
import { HerlperService } from '../../../../services/appHelpers.service';

@Component({
  selector: 'app-evalucion-competencias',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './evalucion-competencias.component.html',
  styleUrl: './evalucion-competencias.component.css'
})
export class EvalucionCompetenciasComponent implements OnInit {

  userLogged!: loggedUserI
  selectGroup: boolean = false
  supervisorWithSubordinates!: CollaboratorsGetI[]
  evaluationsCompetencies!: EvaluationCompetencyGetI[]

  constructor(
    public dialog: MatDialog,
    public appHelper: HerlperService,
    public systemInformation:systemInformationService,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {
    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.getSupervisorWithSubordinates()
  }

  openModalviewEvaluation(colaborador: CollaboratorsGetI, evaluacionCompetenciasDetalles: EvaluationBehaviorsI[]) {
    let dialogRef = this.dialog.open(EvaluacionModalviewComponent, { data: { colaborador, evaluacionCompetenciasDetalles } })
    dialogRef.afterClosed().subscribe(() => { })
  }

  getSupervisorWithSubordinates() {
    this.evaluationCompetencyService.getEvaluationCompetencies(this.selectGroup).subscribe((res: any) => {
      this.supervisorWithSubordinates = res.data.colaboradores;
      this.evaluationsCompetencies = res.data.evaluacionesCompetencias;
    })
  }
}
