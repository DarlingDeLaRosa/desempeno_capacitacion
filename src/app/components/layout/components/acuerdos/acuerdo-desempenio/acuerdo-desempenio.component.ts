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
  isLoading: boolean = true;
  systemUser: RolI
  usuario!: loggedUserI
  agreement: Array<AcuerdoI> = []
  rol!: RolI;
  searchTerm: string = '';

  constructor(
    private dialog: MatDialog,
    private agreementService: agreementService,
    public systemInformation: systemInformationService
  ) {
    this.systemUser = systemInformation.activeRol()
  }

  ngOnInit(): void {
    this.usuario = this.systemInformation.localUser;
    this.rol = this.systemInformation.activeRol();
    this.getAcuerdoByRol();
  }

  //Metodo para traer la lista de los hijos de los supervisores
  getAcuerdoByRol() {
    this.isLoading = true;
    this.agreementService.getAgreementByRol(this.usuario.idPersona, '').subscribe((resp: any) => {
      this.agreement = resp.data;
      console.log(this.agreement);
      this.isLoading = false;
    })
  }

  //buscar los por departamento y nombre del colaborador
  Buscar() {
    if (this.searchTerm.length > 2) {
      this.agreementService.getAgreementByRol(this.usuario.idPersona, this.searchTerm).subscribe((resp: any) => {
        this.agreement = resp.data;
        console.log(this.agreement);
      });
    } else {
      if (this.searchTerm.length < 1) {
        this.getAcuerdoByRol();
      }
    }
  }

  //Metodo para abrir el modal de la lista de documento
  openModalListadoDocumentos(idCollaborator: number, nombre: string, apellido: string): void {
    const Nombre = nombre + ' ' + apellido;
    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      width: '750px',
      height: '505px',
      data: {
        idCollaborator,
        Nombre
      }
    })
    dialog.afterClosed().subscribe(result => {
    });
  }

  //Metodo para abrir el modal del acuerdo estructurado
  openModalVerAcuerdo(idPersona: number): void {
    const dialog = this.dialog.open(VerAcuerdoComponent, { data: { idPersona } })
    dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol() });
  }

  openAuthorizationAction(idPersona: number, nombre: string, apellido: string, idAcuerdo: number): void {
    const dialog = this.dialog.open(AutorizacionAccionComponent, { data: { idPersona, nombre, apellido, idAcuerdo  } })
    dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol() });
  }

  commentsAgreement(idAcuerdo: number , fullName: string): void {
    const dialog = this.dialog.open(ComentariosComponent, {data:  {idAcuerdo, fullName}  })
    dialog.afterClosed().subscribe(() => { this.getAcuerdoByRol() });
  }
}
