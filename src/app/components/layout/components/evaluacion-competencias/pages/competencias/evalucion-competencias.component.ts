import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { EvaluacionModalviewComponent } from '../../modals/evaluacion-modalview/evaluacion-modalview.component';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { CompetencyCount, EvaluationBehaviorsI, EvaluationCompetencyGetI } from '../../interface/evaluacion-competencias.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ProtocolI } from '../../../mantenimiento/mantenimiento-options/protocolos/interface/protocolos.interface';
import { ProtocolsServices } from '../../../mantenimiento/mantenimiento-options/protocolos/services/protocolo.service';
import { MinutaService } from '../../../acuerdos/services/minuta.service';

@Component({
  selector: 'app-evalucion-competencias',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './evalucion-competencias.component.html',
  styleUrl: './evalucion-competencias.component.css'
})
export class EvalucionCompetenciasComponent implements OnInit {

  userLogged!: loggedUserI
  selectGroup: boolean = true
  supervisorWithSubordinates!: CollaboratorsGetI[]
  evaluationCompetenciesCount: CompetencyCount = { tienen: 0, noTienen: 0 }
  evaluationsCompetencies!: EvaluationCompetencyGetI[]
  protocol!: ProtocolI
  docName: string = ''
  charge: boolean = true
  newMinuta!: boolean
  filter: string = ''

  constructor(
    public dialog: MatDialog,
    public appHelper: HerlperService,
    private protocolService: ProtocolsServices,
    private minutaService: MinutaService,
    public systemInformation: systemInformationService,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {
    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.getSupervisorWithSubordinates()
    this.getProtocol()
    this.getMinuta()
  }

  openModalviewEvaluation(colaborador: number,) {
    let dialogRef = this.dialog.open(EvaluacionModalviewComponent, { data: { colaborador } })
    dialogRef.afterClosed().subscribe(() => { })
  }

  getSupervisorWithSubordinates() {
    this.charge = true
    this.evaluationsCompetencies = this.supervisorWithSubordinates = []
    this.evaluationCompetenciesCount = { tienen: 0, noTienen: 0 }

    const hasMinLength = this.filter.length >= 3;
    const filterValue = hasMinLength ? this.filter : '';
    const shouldFetchAll = !hasMinLength && this.supervisorWithSubordinates.length === 0;
    
    if (hasMinLength || shouldFetchAll) {
      this.evaluationCompetencyService.getEvaluationCompetencies(this.selectGroup, filterValue).subscribe((res: any) => {
        this.supervisorWithSubordinates = res.data.colaboradores;
        this.evaluationCompetenciesCount = res.data.evaluacionCompetenciaCount
        this.evaluationsCompetencies = res.data.evaluacionesCompetencias;
        this.charge = false
      })
    }

  }

  getProtocol() {
    this.protocolService.getProtocolByTypeProtocolId(7)
      .subscribe((res: any) => {
        this.protocol = res.data;
        if (this.protocol.documentosObj.length == 0) return

        this.docName = this.protocol.documentosObj[0].nombre.split('.')[0]
      })
  }

  getMinuta() {
    this.minutaService.getMinutaExistente(this.systemInformation.activePeriod().idPeriodo, true)
      .subscribe((res: any) => {
        this.newMinuta = res;
      })
  }
}
