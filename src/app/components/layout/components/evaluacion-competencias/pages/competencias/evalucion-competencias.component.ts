import { Component, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { EvaluacionModalviewComponent } from '../../modals/evaluacion-modalview/evaluacion-modalview.component';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { CompetencyCount, EvaluationCompetencySummaryGetI } from '../../interface/evaluacion-competencias.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ProtocolI } from '../../../mantenimiento/mantenimiento-options/protocolos/interface/protocolos.interface';
import { ProtocolsServices } from '../../../mantenimiento/mantenimiento-options/protocolos/services/protocolo.service';
import { MinutaService } from '../../../acuerdos/services/minuta.service';
import { ListadoDocumentoComponent } from '../../../acuerdos/modals/listado-documento/listado-documento.component';
import { MinutaEvaluacionCompetenciaComponent } from '../../../../templates/minuta-evaluacion-competencia/minuta-evaluacion-competencia.component';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { periodProcessGetI } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/interface/periodo-procesos.interface';
import { PeriodsProcessServices } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { DocumentoMinuta, MinutaGetI } from '../../../acuerdos/interfaces/acuerdo.interface';
import { MissingCollaboratorModalComponent } from '../../modals/missing-collaborator-modal/missing-collaborator-modal.component';

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
  evaluationsCompetencies!: EvaluationCompetencySummaryGetI[]
  protocol!: ProtocolI
  docName: string = ''
  charge: boolean = true
  newMinuta!: { existe: Boolean, docCargado: Boolean }
  minuta!: MinutaGetI[]
  filter: string = ''
  rolActivo: string = ''
  periodo: any
  pagination!: PaginationI
  page: number = 1
  activeProcess!: periodProcessGetI 

  constructor(
    public dialog: MatDialog,
    public appHelper: HerlperService,
    private protocolService: ProtocolsServices,
    private minutaService: MinutaService,
    public systemInformation: systemInformationService,
    private periodProcessService: PeriodsProcessServices,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {
    this.userLogged = systemInformation.localUser
    this.getMyMinuta()

    effect(() => {
      this.periodo = this.systemInformation.activePeriod();
      const rolActivo = this.systemInformation.activeRol();

      if (this.periodo && this.periodo.idPeriodo) {
        this.getMinuta(this.periodo.idPeriodo);
      }

      if (rolActivo && rolActivo.nombre) {
        this.rolActivo = rolActivo.nombre
      }
    });

    this.getActiveAgreementPeriod()
  }

  getMyMinuta() {
    this.minutaService.getMinuta('', "evaluacion", true, 1, 5).subscribe((resp: any) => {
      this.minuta = resp.data
    })
  }

  getActiveAgreementPeriod() {
    this.periodProcessService.getPeriodProcessesActive()
      .subscribe((res: any) => {
        if (res) this.activeProcess = res.data
      })
  }

  ngOnInit(): void {
    this.getSupervisorWithSubordinates(false)
    this.getProtocol()
  }

  openModalviewEvaluation(colaborador: number) {
    let dialogRef = this.dialog.open(EvaluacionModalviewComponent, { data: { colaborador } })
    dialogRef.afterClosed().subscribe(() => { })
  }
  
  openModalviewMissingCollaborators() {
    let dialogRef = this.dialog.open(MissingCollaboratorModalComponent)
    dialogRef.afterClosed().subscribe(() => { })
  }

  getSupervisorWithSubordinates(moveFronPagintation: boolean) {
    this.charge = true
    this.evaluationsCompetencies = this.supervisorWithSubordinates = []
    if (moveFronPagintation == false) {
      this.evaluationCompetenciesCount = { tienen: 0, noTienen: 0 }
      this.pagination = { currentPage: 0, totalItem: 0, totalPage: 0 }
    }

    this.evaluationCompetencyService.getEvaluationCompetencies(this.selectGroup, this.filter, this.page).subscribe((res: any) => {
      this.charge = false

      let { currentPage, totalItem, totalPage } = res
      this.pagination = { currentPage, totalItem, totalPage }

      this.supervisorWithSubordinates = res.data.colaboradores;
      this.evaluationCompetenciesCount = res.data.evaluacionCompetenciaCount
      this.evaluationsCompetencies = res.data.evaluacionesCompetencias;
    })
  }

  getProtocol() {
    this.protocolService.getProtocolByTypeProtocolId(7)
      .subscribe((res: any) => {
        if (res.data == null) return

        this.protocol = res.data;
        if (this.protocol.documentosObj.length == 0) return
        this.docName = this.protocol.documentosObj[0].nombre.split('.')[0]
      })
  }

  openModalListadoDocumentos(): void {
    const nombreCompleto = 'Minuta de Evaluación de Competencias';
    let documentos: DocumentoMinuta[] = []

    if (this.minuta[0].documentos) {
      documentos = this.minuta[0].documentos
    }

    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      data: {
        type: 2,
        idCollaborator: Number(this.userLogged.idPersona),
        nombreCompleto,
        documentos
      }
    })

    dialog.afterClosed().subscribe(result => {
      this.getMinuta(this.periodo.idPeriodo)
      this.getMyMinuta()
    });
  }

  openModalTemplateMinuta(): void {
    const dialog = this.dialog.open(MinutaEvaluacionCompetenciaComponent, { data: { idMinuta: 0 } })
  }

  getMinuta(period: number) {
    this.minutaService.getMinutaExistente(period, true)
      .subscribe((res: any) => {
        this.newMinuta = res;
      })
  }

  //Metodo para llamar a la siguiente pagina 
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getSupervisorWithSubordinates(true)
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getSupervisorWithSubordinates(true)
    }
  }
}
