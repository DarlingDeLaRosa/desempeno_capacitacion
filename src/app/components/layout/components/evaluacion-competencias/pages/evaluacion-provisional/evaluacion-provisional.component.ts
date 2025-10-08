import { Component, OnInit, effect } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { CompetencyCount, EvaluationCompetencySummaryGetI } from '../../interface/evaluacion-competencias.interface';
import { ProtocolI } from '../../../mantenimiento/mantenimiento-options/protocolos/interface/protocolos.interface';
import { DocumentoMinuta, MinutaGetI } from '../../../acuerdos/interfaces/acuerdo.interface';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { periodProcessGetI } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/interface/periodo-procesos.interface';
import { MatDialog } from '@angular/material/dialog';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ProtocolsServices } from '../../../mantenimiento/mantenimiento-options/protocolos/services/protocolo.service';
import { MinutaService } from '../../../acuerdos/services/minuta.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { PeriodsProcessServices } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { EvaluacionModalviewComponent } from '../../modals/evaluacion-modalview/evaluacion-modalview.component';
import { MissingCollaboratorModalComponent } from '../../modals/missing-collaborator-modal/missing-collaborator-modal.component';
import { ListadoDocumentoComponent } from '../../../acuerdos/modals/listado-documento/listado-documento.component';
import { MinutaEvaluacionCompetenciaComponent } from '../../../../templates/minuta-evaluacion-competencia/minuta-evaluacion-competencia.component';
import { CollaboratorServices } from '../../../mantenimiento/mantenimiento-options/colaboradores/services/colaboradores.service';
import { LoaderComponent } from '../../../../../../helpers/components/loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluacion-provisional',
  standalone: true,
  imports: [MaterialComponents, ClassImports, LoaderComponent],
  templateUrl: './evaluacion-provisional.component.html',
  styleUrl: './evaluacion-provisional.component.css'
})
export class EvaluacionProvisionalComponent implements OnInit {
  
  userLogged!: CollaboratorsGetI // user provisional
  userLoggedLocal!: loggedUserI // user logged
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
    private router: Router,
    public dialog: MatDialog,
    public appHelper: HerlperService,
    private protocolService: ProtocolsServices,
    private minutaService: MinutaService,
    public systemInformation: systemInformationService,
    private periodProcessService: PeriodsProcessServices,
    private colaboratorsService: CollaboratorServices,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {

    this.userLoggedLocal = systemInformation.localUser 
    
    effect(() => {
      this.periodo = this.systemInformation.activePeriod();
      const rolActivo = this.systemInformation.activeRol();
      
      if (this.periodo && this.periodo.idPeriodo) {
        this.getUser()
      }

      if (rolActivo && rolActivo.nombre) {
        this.rolActivo = rolActivo.nombre
      }
    });

    this.getActiveAgreementPeriod()
  }

  getUser(){
    this.colaboratorsService.getPersonByID(Number(this.userLoggedLocal.idSupliendoA)).subscribe((res: any)=>{
      this.userLogged = res.data
      
      this.getMyMinuta()
      this.getMinuta(this.periodo.idPeriodo);
    })
  }

  getMyMinuta() { // necesario hacer la llamada por usuario digase por un id no por el token 
    this.minutaService.getMinuta('', "evaluacion", true, 1, 5, true).subscribe((resp: any) => {
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

    this.evaluationCompetencyService.getEvaluationCompetenciesBySupInterino( this.filter, this.page).subscribe((res: any) => {
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
    const esSupIn = true;

    let documentos: DocumentoMinuta[] = []

    if (this.minuta[0].documentos) {
      documentos = this.minuta[0].documentos
    }

    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      data: {
        type: 2,
        idCollaborator: Number(this.userLogged.idPersona),
        nombreCompleto,
        documentos,
        esSupIn
      }
    })

    dialog.afterClosed().subscribe(result => {
      this.getMinuta(this.periodo.idPeriodo)
      this.getMyMinuta()
    });
  }

  openModalTemplateMinuta(): void {
    const dialog = this.dialog.open(MinutaEvaluacionCompetenciaComponent, { data: { idMinuta: 0, esSupInterino: true } })
  }

  getMinuta(period: number) {
    this.minutaService.getMinutaExistenteByPerson(this.userLogged.idPersona, period, true)
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
