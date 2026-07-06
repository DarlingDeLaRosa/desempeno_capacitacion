import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material.components';
import { ClassImports } from '../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { ListadoDocumentoComponent } from '../modals/listado-documento/listado-documento.component';
import { systemInformationService } from '../../../services/systemInformationService.service';
import { agreementService } from '../services/acuerdo.service';
import { loggedUserI, OcupationalGroupI } from '../../../../../helpers/intranet/intranet.interface';
import { AcuerdoDetalle, AcuerdoI, Documento, DocumentoMinuta, MinutaGetI } from '../interfaces/acuerdo.interface';
import { AutorizacionAccionComponent } from '../modals/autorizacion-accion/autorizacion-accion.component';
import { ComentariosComponent } from '../modals/comentarios/comentarios.component';
import { HerlperService } from '../../../services/appHelpers.service';
import { PeriodsProcessServices } from '../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { periodProcessGetI } from '../../mantenimiento/mantenimiento-options/periodo-procesos/interface/periodo-procesos.interface';
import { PaginationI } from '../../../../interfaces/generalInteerfaces';
import { MinutaService } from '../services/minuta.service';
import { MinutaEvaluacionCompetenciaComponent } from '../../../templates/minuta-evaluacion-competencia/minuta-evaluacion-competencia.component';
import { stepperService } from '../services/stepper.service';
import { PeriodProcessStepsI, ProcessStepsI } from '../interfaces/steps.interface';
import { SnackBars } from '../../../services/snackBars.service';
import { LoaderStepperBoxComponent } from '../../../../../helpers/components/loader-stepper-box/loader-stepper-box.component';
import { IntranetServices } from '../../../../../helpers/intranet/intranet.service';

@Component({
  selector: 'app-acuerdo-desempenio',
  standalone: true,
  imports: [MaterialComponents, ClassImports, LoaderStepperBoxComponent],
  providers: [agreementService],
  templateUrl: './acuerdo-desempenio.component.html',
  styleUrl: './acuerdo-desempenio.component.css'
})
export class AcuerdoDesempenioComponent implements OnInit {

  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  page: number = 1
  hijosList!: any[];
  usuario!: loggedUserI
  charge: boolean = true
  minuta!: MinutaGetI
  totalMinutaList!: MinutaGetI[]
  minutaList!: Documento[]
  searchTerm: string = '';
  userLogged!: loggedUserI
  pagination!: PaginationI
  isLoading: boolean = true;
  agreement!: Array<AcuerdoI>
  agreementProbatorios!: boolean
  activeStep!: ProcessStepsI | undefined
  selectGroup: boolean = true
  loadingSteps: boolean = true
  typeAD!: boolean
  minutaVerified!: { existe: Boolean, docCargado: Boolean }
  activeProcess!: periodProcessGetI
  validationCreation!: boolean
  recinto: string = ''
  process: string = ''
  flujo: string = ''
  ocuGroup: string = ''
  validationGv: boolean = false
  validationDocAgreement!: boolean
  steps!: PeriodProcessStepsI
  selectedStage!: number
  ocupationalGroup!: OcupationalGroupI[]

  constructor(
    private dialog: MatDialog,
    public snackBar: SnackBars,
    public appHelpers: HerlperService,
    private minutaService: MinutaService,
    private intranetService: IntranetServices,
    private agreementService: agreementService,
    private stepperService: stepperService,
    public systemInformation: systemInformationService,
    private periodProcessService: PeriodsProcessServices,
  ) {
    const localTypeAd = localStorage.getItem("typeAd")
    const selectedStage = localStorage.getItem("stage")

    this.typeAD = localTypeAd != null ? localTypeAd === "true" : false
    this.selectedStage = selectedStage != null ? Number(selectedStage) : 2

    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.usuario = this.systemInformation.localUser;

    this.systemInformation.activeRol();
    this.getActiveAgreementPeriod()
    this.validateAgreement();
    this.validateCreationFT()
    this.getOcupationalGroup()
  }

  getOcupationalGroup() {
    this.intranetService.getOcupationalGroup()
      .subscribe((res: any) => {
        this.ocupationalGroup = res.data;
      })
  }

  validateCreationFT() {
    localStorage.setItem("typeAd", this.typeAD.toString());

    Promise.all([
      new Promise(resolve => this.getAcuerdoByRol(false, resolve)),
    ]).then(() => {
      Promise.all([
        new Promise(resolve => this.stepperPeriod(resolve))
      ]).then(() => {
        this.validateAgrementCreation();  // SOLO SE EJECUTA UNA VEZ
      });
    });
  }

  selectStage(stage: number) {
    // this.steps = { acuerdosStepsStatus: [], id: 0, tipoProceso: {id: 0, nombre: ''}}
    this.loadingSteps == true
    localStorage.setItem("stage", stage.toString());
    this.selectedStage = stage;
    this.stepperPeriod()
    this.getExactMinuta()
  }

  stepperPeriod(resolve?: Function) {
    if (this.userLogged.role == 'Analista') return

    this.stepperService.getStepByIdProcess(this.selectedStage)
      .subscribe((res: any) => {
        this.loadingSteps = false
        this.steps = res.data
        this.activeStep = this.steps.acuerdosStepsStatus.find(step => step.fechaCompletado === null);
        this.activeStep?.procesoSecuencia.orden == 2 ? this.validateSecStep() : ''
        this.activeStep?.procesoSecuencia.orden == 3 ? this.validateAllDocs() : ''
        if (resolve) resolve();
      })
  }

  validateAgrementCreation() {
    if (this.agreement != undefined && this.agreement.length == 0 && this.steps.acuerdosStepsStatus != undefined) return;

    let allValid = true;

    this.agreement.forEach(ag => {
      let totalDetalles = 0;

      ag.detalles.forEach(det => { totalDetalles += det.metaObj?.valor ?? 0; });
      if (totalDetalles !== ag.puntos) { allValid = false; }
    });

    if (
      allValid &&
      this.steps.acuerdosStepsStatus[0].fechaCompletado == null &&
      this.agreement.filter(item => item.tipoProceso.id === this.selectedStage) && this.agreement.every(item => item.flujoObj.idFlujo >= 2) &&
      (this.steps.tipoProceso.id == 1 || this.steps.tipoProceso.id == 2 || this.steps.tipoProceso.id == 3 || this.steps.tipoProceso.id == 9 && this.typeAD)
    ) {
      let typeProcess = this.typeAD ? 9 : this.activeProcess.tipoProceso.id

      this.stepperService.postCompleteStep(typeProcess).subscribe((res: any) => {
        this.snackBar.snackbarSuccess('Paso gestión de acuerdo completado correctamente')
        this.stepperPeriod()
      })
    }
  }

  async validateSecStep() {
    if (this.steps.acuerdosStepsStatus[0].fechaCompletado != null &&
      this.steps.acuerdosStepsStatus[1].fechaCompletado == null && this.agreement.length > 0 &&
      this.agreement.filter(item => item.tipoProceso.id === this.selectedStage) && this.agreement.every(item => item.flujoObj.idFlujo > 3)) {

      let typeProcess = this.typeAD ? 9 : this.activeProcess.tipoProceso.id

      this.stepperService.postCompleteStep(typeProcess).subscribe((res: any) => {
        this.snackBar.snackbarSuccess('La revisión fue completada correctamente')
        this.stepperPeriod()
      })
    }
  }

  validateAgreement() {
    this.agreementService.validateProbativeAgreement().subscribe((resp: any) => {
      this.agreementProbatorios = resp
    })
  }

  scrollLeft() { this.carousel.nativeElement.scrollBy({ left: -250, behavior: 'smooth' }); }
  scrollRight() { this.carousel.nativeElement.scrollBy({ left: 250, behavior: 'smooth' }); }

  openModalTemplateMinuta(): void {
    const dialog = this.dialog.open(MinutaEvaluacionCompetenciaComponent, { data: { idMinuta: 0, esSupInterino: false, typeEvaluation: 1, selectedStage: this.selectedStage } })
  }

  getMyMinuta() {
    this.minutaService.getMinuta('', '', '', "acuerdo", true, 1, 5).subscribe((resp: any) => {
      if (resp.data.length > 0) {
        this.totalMinutaList = resp.data
        this.getExactMinuta()
      }
    })
  }

  getExactMinuta() {
    [this.minuta] = this.totalMinutaList.filter((minuta: MinutaGetI) => minuta.periodoAcuerdo != null && minuta.periodoAcuerdo.tipoProceso.id == this.selectedStage)
    let docs: any
    docs = this.totalMinutaList.flatMap((minuta: MinutaGetI) => minuta.documentos || []);
    this.minutaList = docs
  }

  getActiveAgreementPeriod() {
    this.periodProcessService.getPeriodProcessesActive(true)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.activeProcess = res.data
          this.getMyMinuta()
        }
      })
  }

  async completeCheckOut(typeProcess: string, agreementId: number) {
    let removeDecision = await this.snackBar.snackbarConfirmation(`¿Está seguro de completar la "${typeProcess.toUpperCase()}" sin cambios en el acuerdo de desempeño?`)

    if (removeDecision) {
      let flowData
      flowData = { acuerdoId: agreementId, flujoId: 4 }

      this.agreementService.updateFlow(flowData).subscribe((res: any) => {
        if (res.status) {
          this.appHelpers.handleResponse(res, () => {
            this.getAcuerdoByRol()
            this.validateAllDocs()
            this.stepperPeriod()
          },)

        }
      })
    }
  }

  async completeAgreement(agreementId: number) {
    let removeDecision = await this.snackBar.snackbarConfirmation(`¿Está seguro de completar y cerrar el acuerdo de desempeño?`, 'Esta acción no se puede deshacer')

    if (removeDecision) {
      this.agreementService.updateProcessForOne(agreementId).subscribe((res: any) => {
        if (res.status) {
          this.appHelpers.handleResponse(res, () => this.getAcuerdoByRol())
        }
      })
    }
  }

  // verifiedMinuta(period: number) {
  //   this.minutaService.getMinutaExistente(period, false, this.activeProcess.idPeriodoAcuerdo)
  //     .subscribe((res: any) => {
  //       this.minutaVerified = res;
  //     })
  // }

  //Metodo para traer la lista de los hijos de los supervisores
  getAcuerdoByRol(moveFronPagintation: boolean = false, resolve?: Function) {
    this.isLoading = true;
    this.agreement = []

    if (moveFronPagintation == false) {
      this.pagination = { currentPage: 0, totalItem: 0, totalPage: 0 }
    }

    this.agreementService.getAgreementByRol(this.searchTerm, this.process, this.recinto, this.flujo, this.ocuGroup, this.selectGroup, this.page, 10, this.typeAD).subscribe((resp: any) => {
      this.isLoading = false;
      this.agreement = resp.data;

      let { currentPage, totalItem, totalPage } = resp
      this.pagination = { currentPage, totalItem, totalPage }

      // this.validateCreationAd()
      // this.validateOcupationalGroup()
      if (resolve) resolve();
      // this.validateAgrementCreation()
      // this.validateDocumentationAgreement()
    })
  }

  //buscar por departamento y nombre del colaborador
  Buscar() {
    if (this.searchTerm.length > 2) {
      this.getAcuerdoByRol(false, () => { })
    } else {
      if (this.searchTerm.length < 1) {
        this.getAcuerdoByRol();
      }
    }
  }

  //Metodo para abrir el modal de la lista de documento
  openModalListadoDocumentos(idCollaborator: number, nombre: string, apellido: string, documentosList: Documento[], flujoId: number, estado?: number): void {
    const nombreCompleto = nombre + ' ' + apellido;
    let selectedStage = this.selectedStage
    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      data: {
        type: 1,
        idCollaborator,
        nombreCompleto,
        documentosList,
        flujoId,
        estado,
        selectedStage
      }
    })

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.validateAllDocs()
        this.stepperPeriod()

        this.getAcuerdoByRol()
        this.getMyMinuta()
      }
    });
  }

  validateAllDocs() {
    if (this.steps.acuerdosStepsStatus[1].fechaCompletado != null &&
      this.steps.acuerdosStepsStatus[2].fechaCompletado == null && this.agreement.length > 0 &&
      this.agreement.filter(item => item.tipoProceso.id === this.selectedStage) && this.agreement.every(item => item.flujoObj.idFlujo > 4)) {

      let typeProcess = this.typeAD ? 9 : this.activeProcess.tipoProceso.id

      this.stepperService.postCompleteStep(typeProcess).subscribe((res: any) => {
        this.snackBar.snackbarSuccess('La carga de documentos fue completada correctamente')
        this.stepperPeriod()
      })
    }
  }
  //Metodo para abrir el modal del acuerdo estructurado
  // openModalVerAcuerdo(idAgreement: number): void {
  //   const dialog = this.dialog.open(VerAcuerdoComponent, { data: { idAgreement } })
  //   dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol(''); this.searchTerm = '' });
  // }

  // validateCreationAd() {
  //   if (this.agreement.length > 0) {
  //     for (const item of this.agreement) {
  //       if (item.puntos !== this.calculateGoalValue(item.detalles)) {
  //         this.validationCreation = false;
  //         return;
  //       }
  //     }
  //     this.validationCreation = true;
  //   }
  //   this.updateSteps()
  // }



  // valida si hay alguna persona que este fuera del proceso Id y fuera del flujo Id, si existe enviara como falso, sino existe entonces enviara como verdadero 
  // validateEvaluationAd(flujoId: number, typeProcessId: number,): boolean {
  //   const hayFlujoMayor = this.agreement.some(
  //     (item: AcuerdoI) => item.tipoProceso.id == typeProcessId && item.flujoObj.idFlujo <= flujoId
  //   );
  //   return !hayFlujoMayor
  // }

  // validateStageMayorAd(typeProcessId: number): boolean {
  //   const stage = this.agreement.every(
  //     (item: AcuerdoI) => item.tipoProceso.id >= typeProcessId
  //   );
  //   return stage
  // }

  // validateStageSameAd(typeProcessId: number): boolean {
  //   const stage = this.agreement.every(
  //     (item: AcuerdoI) => item.tipoProceso.id == typeProcessId
  //   );
  //   return stage
  // }

  // validateStageSameAd(typeProcessId: number, flujoId: number): boolean {
  //   const stage = this.agreement.some(
  //     (item: AcuerdoI) => item.tipoProceso.id == typeProcessId && item.flujoObj.idFlujo <= flujoId
  //   );
  //   return stage
  // }

  // validateOcupationalGroup() {
  //   this.validationGv = this.agreement.some(
  //     (item: AcuerdoI) => item.colaboradorObj.grupoObj.idGrupo == 5
  //   );
  // }

  validateDocumentationAgreement() {
    this.validationDocAgreement = this.agreement.some(
      (item: AcuerdoI) => item.documentosObj.length == 0
    );
  }

  pendingComments(acuerdo: AcuerdoI): boolean {
    return acuerdo.comentarios.some(comment => comment.leido == false && comment.creadoPorUsuario != this.userLogged.Username)
  }

  openAuthorizationAction(idPersona: number, nombre: string, apellido: string, idAcuerdo: number): void {
    const dialog = this.dialog.open(AutorizacionAccionComponent, { data: { idPersona, nombre, apellido, idAcuerdo } })
    dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol(); this.searchTerm = '' });
  }

  // async openAuthorizationAction(idTipoAcuerdo: number, nombre: string, apellido: string, idAcuerdo: number) {

  //   let removeDecision = await this.snackBar.snackbarConfirmation(`¿Está seguro de autorizar la evaluación de acuerdo de ${nombre.toUpperCase()} ${apellido.toUpperCase()} ?`, 'Esta acción no se puede deshacer.')

  //   if (removeDecision) {

  //     let processData = idTipoAcuerdo == 1 ? { acuerdoId: idAcuerdo, procesoId: 5 } : { acuerdoId: idAcuerdo, procesoId: 11 }  

  //     this.agreementService.updateProcess(processData).subscribe((res: any) => {
  //       if (res.status) {
  //         this.searchTerm = ''
  //         this.appHelpers.handleResponse(res, () => this.getAcuerdoByRol())
  //       }
  //     })
  //   }
  // }

  commentsAgreement(idAcuerdo: number, fullName: string, estado: number, user: string): void {
    const dialog = this.dialog.open(ComentariosComponent, { data: { idAcuerdo, fullName, estado, user } })
    dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol(); this.searchTerm = '' });
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getAcuerdoByRol(true)
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getAcuerdoByRol(true)
    }
  }

}
