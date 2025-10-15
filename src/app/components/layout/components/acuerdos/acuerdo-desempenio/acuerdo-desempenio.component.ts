import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material.components';
import { ClassImports } from '../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { ListadoDocumentoComponent } from '../modals/listado-documento/listado-documento.component';
import { VerAcuerdoComponent } from '../modals/ver-acuerdo/ver-acuerdo.component';
import { systemInformationService } from '../../../services/systemInformationService.service';
import { agreementService } from '../services/acuerdo.service';
import { loggedUserI } from '../../../../../helpers/intranet/intranet.interface';
import { AcuerdoDetalle, AcuerdoI, Documento, DocumentoMinuta } from '../interfaces/acuerdo.interface';
import { RolI } from '../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { AutorizacionAccionComponent } from '../modals/autorizacion-accion/autorizacion-accion.component';
import { ComentariosComponent } from '../modals/comentarios/comentarios.component';
import { HerlperService } from '../../../services/appHelpers.service';
import { PeriodsProcessServices } from '../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { periodProcessGetI } from '../../mantenimiento/mantenimiento-options/periodo-procesos/interface/periodo-procesos.interface';
import { PaginationI } from '../../../../interfaces/generalInteerfaces';

@Component({
  selector: 'app-acuerdo-desempenio',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
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
  searchTerm: string = '';
  userLogged!: loggedUserI
  pagination!: PaginationI
  isLoading: boolean = true;
  agreement!: Array<AcuerdoI>
  selectGroup: boolean = true
  activeProcess!: periodProcessGetI
  validationCreation!: boolean
  validationGv: boolean = false
  steps: any[] = []


  constructor(
    private dialog: MatDialog,
    public appHelpers: HerlperService,
    private agreementService: agreementService,
    public systemInformation: systemInformationService,
    private periodProcessService: PeriodsProcessServices,
  ) {
    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.usuario = this.systemInformation.localUser;
    this.systemInformation.activeRol();
    this.getActiveAgreementPeriod()
    this.getAcuerdoByRol('');
    this.updateSteps()
  }

  updateSteps() {
    this.steps = [
      { number: 1, show: true, title: 'Creación de acuerdos de colaboradores', status: this.validationCreation ? 'completed' : 'in-progress', responsable: 'Darling De la Rosa' },
      {
        number: 2,
        show: true,
        title: 'Validación de acuerdos',
        status:
          this.agreement != undefined && !this.validationCreation && !this.validateEvaluationAd(2)
            ? '' 
            : this.agreement != undefined && this.validationCreation && !this.validateEvaluationAd(2)
              ? 'in-progress' 
              : this.agreement != undefined && this.validationCreation && this.validateEvaluationAd(2)
                ? 'completed'
                : '',
        responsable: 'Analista de evaluación del desempeño'
      },
      {
        number: 3,
        show: this.validationGv,
        title: 'Validación de acuerdos de grupo ocupacional ( V )',
        status: this.agreement != undefined && !this.validationCreation && !this.validateEvaluationAd(2)
          ? '' 
          : this.agreement != undefined && this.validationCreation && this.validateEvaluationAd(2) && !this.validateEvaluationAd(3)
            ? 'in-progress' // creation true y flow false
            : this.agreement != undefined && this.validationCreation && this.validateEvaluationAd(3)
              ? 'completed' // ambos true
              : '',
        responsable: 'Analista de planificación'
      },
      { number: this.validationGv ? 4 : 3, show: true, title: 'Documentación de acuerdos de desempeño', status: '', responsable: 'Darling De la Rosa' },
      { number: this.validationGv ? 5 : 4, show: true, title: 'Creación de minuta', status: '', responsable: 'Darling De la Rosa' },
      { number: this.validationGv ? 6 : 5, show: true, title: 'Validación de minuta', status: '', responsable: 'Analista de evaluación del desempeño' },
      { number: this.validationGv ? 7 : 6, show: true, title: 'Documentación de minuta', status: '', responsable: 'Darling De la Rosa' },
      { number: this.validationGv ? 8 : 7, show: true, title: 'Completada', status: '', responsable: '' },
    ];
  }

  scrollLeft() { this.carousel.nativeElement.scrollBy({ left: -250, behavior: 'smooth' }); }
  scrollRight() { this.carousel.nativeElement.scrollBy({ left: 250, behavior: 'smooth' }); }

  getActiveAgreementPeriod() {
    this.periodProcessService.getPeriodProcessesActive(true)
      .subscribe((res: any) => { if (res) this.activeProcess = res.data })
  }

  //Metodo para traer la lista de los hijos de los supervisores
  getAcuerdoByRol(term: string) {
    this.isLoading = true;

    this.agreementService.getAgreementByRol(term, this.selectGroup, this.page, 10).subscribe((resp: any) => {
      this.isLoading = false;

      this.agreement = resp.data;
      let { currentPage, totalItem, totalPage } = resp
      this.pagination = { currentPage, totalItem, totalPage }

      this.validateCreationAd()
      this.validateOcupationalGroup()
      // if (currentPage > totalPage) { this.page = 1 }
    })
  }

  //buscar por departamento y nombre del colaborador
  Buscar() {
    if (this.searchTerm.length > 2) {
      this.getAcuerdoByRol(this.searchTerm)
    } else {
      if (this.searchTerm.length < 1) {
        this.getAcuerdoByRol('');
      }
    }
  }

  //Metodo para abrir el modal de la lista de documento
  openModalListadoDocumentos(idCollaborator: number, nombre: string, apellido: string, documentosList: Documento[], flujoId: number, estado: number): void {
    const nombreCompleto = nombre + ' ' + apellido;
    let documentos: DocumentoMinuta[] = []

    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      // width: '750px',
      // height: '505px',
      data: {
        type: 1,
        idCollaborator,
        nombreCompleto,
        documentos,
        documentosList,
        flujoId,
        estado
      }
    })
    dialog.afterClosed().subscribe(result => {
    });
  }

  //Metodo para abrir el modal del acuerdo estructurado
  // openModalVerAcuerdo(idAgreement: number): void {
  //   const dialog = this.dialog.open(VerAcuerdoComponent, { data: { idAgreement } })
  //   dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol(''); this.searchTerm = '' });
  // }

  validateCreationAd() {
    for (const item of this.agreement) {
      if (item.puntos !== this.calculateGoalValue(item.detalles)) {
        this.validationCreation = false;
        return;
      }
    }

    this.validationCreation = true;
    this.updateSteps()
  }

  calculateGoalValue(detalles: AcuerdoDetalle[]): number {
    let valor: number = 0
    detalles.map((item) => { valor += item.metaObj.valor })

    return valor
  }

  validateEvaluationAd(flujoId: number): boolean {
    const hayFlujoMayor = this.agreement.some(
      (item: AcuerdoI) => item.flujoObj.idFlujo <= flujoId
    );
    return !hayFlujoMayor
  }

  validateOcupationalGroup() {
    this.validationGv = this.agreement.some(
      (item: AcuerdoI) => item.colaboradorObj.grupoObj.idGrupo != 5
    );
    // console.log(this.validationGv);
    this.updateSteps()
  }

  openAuthorizationAction(idPersona: number, nombre: string, apellido: string, idAcuerdo: number): void {
    const dialog = this.dialog.open(AutorizacionAccionComponent, { data: { idPersona, nombre, apellido, idAcuerdo } })
    dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol(''); this.searchTerm = '' });
  }

  commentsAgreement(idAcuerdo: number, fullName: string, estado: number): void {
    const dialog = this.dialog.open(ComentariosComponent, { data: { idAcuerdo, fullName, estado } })
    dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol(''); this.searchTerm = '' });
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getAcuerdoByRol(this.searchTerm)
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getAcuerdoByRol(this.searchTerm)
    }
  }
}
