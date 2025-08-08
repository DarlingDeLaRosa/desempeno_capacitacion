import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material.components';
import { ClassImports } from '../../../../../helpers/class.components';
import { MatDialog } from '@angular/material/dialog';
import { ListadoDocumentoComponent } from '../modals/listado-documento/listado-documento.component';
import { VerAcuerdoComponent } from '../modals/ver-acuerdo/ver-acuerdo.component';
import { systemInformationService } from '../../../services/systemInformationService.service';
import { agreementService } from '../services/acuerdo.service';
import { loggedUserI } from '../../../../../helpers/intranet/intranet.interface';
import { AcuerdoI } from '../interfaces/acuerdo.interface';
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

  hijosList!: any[];
  selectGroup: boolean = true
  isLoading: boolean = true;
  page: number = 1
  pagination!: PaginationI
  usuario!: loggedUserI
  agreement!: Array<AcuerdoI> 
  searchTerm: string = '';
  activeProcess!: periodProcessGetI

  constructor(
    private dialog: MatDialog,
    public appHelpers: HerlperService,
    private agreementService: agreementService,
    public systemInformation: systemInformationService,
    private periodProcessService: PeriodsProcessServices,
  ) { }

  ngOnInit(): void {
    this.usuario = this.systemInformation.localUser;
    this.systemInformation.activeRol();
    this.getActiveAgreementPeriod()
    this.getAcuerdoByRol('');
  }

  getActiveAgreementPeriod() {
    this.periodProcessService.getPeriodProcessesActive(true)
      .subscribe((res: any) => {
        if (res) this.activeProcess = res.data
      })
  }

  //Metodo para traer la lista de los hijos de los supervisores
  getAcuerdoByRol(term: string) {
    this.isLoading = true;
    this.agreementService.getAgreementByRol(term, this.selectGroup, this.page, 10).subscribe((resp: any) => {
      this.agreement = resp.data;
      let { currentPage, totalItem, totalPage } = resp
      this.pagination = { currentPage, totalItem, totalPage }

      // if (currentPage > totalPage) { this.page = 1 }
      this.isLoading = false;
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
  openModalListadoDocumentos(idCollaborator: number, nombre: string, apellido: string, estado: number): void {
    const nombreCompleto = nombre + ' ' + apellido;
    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      // width: '750px',
      // height: '505px',
      data: {
        type: 1,
        idCollaborator,
        nombreCompleto, 
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
