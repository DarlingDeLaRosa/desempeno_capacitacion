import { Component } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { EvaluationCompetencyByIdI } from '../../interface/evaluacion-competencias.interface';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { LoaderComponent } from '../../../../../../helpers/components/loader/loader.component';
import { AcuerdoI } from '../../../acuerdos/interfaces/acuerdo.interface';
import { agreementService } from '../../../acuerdos/services/acuerdo.service';
import { HerlperService } from '../../../../services/appHelpers.service';

@Component({
  selector: 'app-view-supervisado-evaluacion',
  standalone: true,
  imports: [ClassImports, MaterialComponents, LoaderComponent],
  templateUrl: './view-supervisado-evaluacion.component.html',
  styleUrls: ['./view-supervisado-evaluacion.component.css', '../../../acuerdos/modals/ver-acuerdo/ver-acuerdo.component.css' ]
})
export class ViewSupervisadoEvaluacionComponent {

  public evaluationData!: EvaluationCompetencyByIdI[]
  totalCalificacion: number = 0
  selectType: Boolean = true
  noDataAgreement: Boolean = false
  userLogged!: loggedUserI
  totalValor: number = 0
  agreement!: AcuerdoI
  competency: number = 0
  
  constructor(
    public appHelper: HerlperService,
    private agreementservice: agreementService,
    public systemInformation: systemInformationService,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) { 
    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.findCollaboratorEvaluation()
    this.getAgreementByIdCollaborator()
  }

  getAgreementByIdCollaborator() {
    this.agreementservice.getAgreementByIdCollaborator(Number(this.userLogged.idPersona)).subscribe({
      next: (resp: any) => { 
        this.agreement = resp.data 
        this.calculadora()
      },
      error: (error) => { 
        setTimeout(() => { this.noDataAgreement = true}, 500); 
      }
    })

    // this.agreementService.getAgreementByIdCollaborator(this.usuario.idPersona).subscribe({
    //   next: (resp: any) => { this.agreement = resp.data },
    //   error: (error) => { 
    //     this.snackBar.snackbarError('El acuerdo de desempeño no fue encontrado', 4000)
    //     error.status == 404 ? this.navigate() : ''
    //   }
    // });
  }

  findCollaboratorEvaluation() {
    this.evaluationCompetencyService.getEvaluationCompetenciesByIdPerson(Number(this.userLogged.idPersona)).subscribe((res: any) => {
      this.evaluationData = res.data.evaluacionCompetencia
    })
  }

  changeCompetency(competency: number): void {
    this.competency = competency;
  }

  calculadora() {
    this.totalCalificacion = this.agreement.detalles.reduce((acc, item) => acc + (item.calificacion || 0), 0);
    this.totalValor = this.agreement.detalles.reduce((acc, item) => acc + (item.metaObj.valor || 0), 0);
  }

  
}
