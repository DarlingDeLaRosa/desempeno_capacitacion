import { Component } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { EvaluationCompetencyByIdI } from '../../interface/evaluacion-competencias.interface';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { LoaderComponent } from '../../../../../../helpers/components/loader/loader.component';

@Component({
  selector: 'app-view-supervisado-evaluacion',
  standalone: true,
  imports: [ClassImports, MaterialComponents, LoaderComponent],
  templateUrl: './view-supervisado-evaluacion.component.html',
  styleUrl: './view-supervisado-evaluacion.component.css'
})
export class ViewSupervisadoEvaluacionComponent {

  public evaluationData!: EvaluationCompetencyByIdI[]
  userLogged!: loggedUserI
  
  constructor(
    public systemInformation: systemInformationService,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) { 
    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.findCollaboratorEvaluation()
  }

  findCollaboratorEvaluation() {
    this.evaluationCompetencyService.getEvaluationCompetenciesByIdPerson(Number(this.userLogged.idPersona)).subscribe((res: any) => {
      this.evaluationData = res.data.evaluacionCompetencia
    })
  }

  competency: number = 0

  changeCompetency(competency: number): void {
    this.competency = competency;
  }
}
