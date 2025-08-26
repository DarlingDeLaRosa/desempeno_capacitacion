import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { MinutaService } from '../../services/minuta.service';
import { DocumentoMinuta, MinutaGetI, MinutaI, validationMinutaI } from '../../interfaces/acuerdo.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { MatDialog } from '@angular/material/dialog';
import { VerMinutaComponent } from '../../modals/ver-minuta/ver-minuta.component';
import { ListadoDocumentoComponent } from '../../modals/listado-documento/listado-documento.component';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { SnackBars } from '../../../../services/snackBars.service';
import { MinutaEvaluacionCompetenciaComponent } from '../../../../templates/minuta-evaluacion-competencia/minuta-evaluacion-competencia.component';
import { FormGroup } from '@angular/forms';
import { CommentEmailComponent } from './dialog/comment-email/comment-email.component';

@Component({
  selector: 'app-minuta-list',
  standalone: true,
  imports: [ClassImports, MaterialComponents],
  providers: [MinutaService],
  templateUrl: './minuta-list.component.html',
  styleUrl: './minuta-list.component.css'
})
export class MinutaListComponent implements OnInit {

  minutaList!: MinutaGetI[]
  searchTerm: string = '';
  typeMinuta: string = ''
  pagination!: PaginationI
  page: number = 1
  charge: boolean = false

  constructor(
    private dialog: MatDialog,
    public snackBar: SnackBars,
    public appHelper: HerlperService,
    private minutaService: MinutaService,
    public systemInformation: systemInformationService,
  ) { }

  ngOnInit(): void {
    this.getMinutas('')
  }

  getMinutas(term: string) {
    this.charge = true
    this.minutaList = []

    this.minutaService.getMinuta(term, this.typeMinuta, false).subscribe((resp: any) => {
      this.charge = false
      this.minutaList = resp.data;
    })
  }

  //buscar los por departamento y nombre del colaborador
  Buscar() {
    if (this.searchTerm.length > 2) {
      this.getMinutas(this.searchTerm)
    } else {
      if (this.searchTerm.length < 1) {
        this.getMinutas('');
      }
    }
  }

  openModalListadoDocumentos(nombre: string, apellido: string, idPersona: number, documentos: DocumentoMinuta[] = []): void {
    const nombreCompleto = nombre + ' ' + apellido;
    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      data: {
        type: 2,
        idCollaborator: idPersona,
        nombreCompleto,
        documentos, 
      }
    })
    dialog.afterClosed().subscribe(result => {
      if (result) { this.getMinutas('') }
    });
  }

  openModalTemplateMinuta(MinutaId: number): void {
    const dialog = this.dialog.open(MinutaEvaluacionCompetenciaComponent, { data: { idMinuta: MinutaId } })
  }

  async postValidarMinuta(minutaId: number, state: boolean = false, comentario: string = '') {

    let validation: validationMinutaI = { estado: state, comentario: comentario }
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      // let commentDecision: boolean = await this.snackBar.snackbarConfirmation('¿Deseas agregar un mensaje?', 'Puedes incluir un texto adicional que será enviado en el correo.', 'Si', 'No', '#aaa', '#aaa')

    if (removeDecision) {
      const dialog = this.dialog.open(CommentEmailComponent, {disableClose: true})
      
      dialog.afterClosed().subscribe(result => {
        validation.comentario = result
        
        this.minutaService.postValidarMinuta(minutaId, validation).subscribe((resp: any) => {
          this.appHelper.handleResponse(resp, () => this.getMinutas(''))
        })
      });
      
    }else{
      this.minutaService.postValidarMinuta(minutaId, validation).subscribe((resp: any) => {
        this.appHelper.handleResponse(resp, () => this.getMinutas(''))
      })
    }
    }
  }

  async deleteMinuta(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.minutaService.deleteMinuta(id).subscribe((res: any) => {
        this.appHelper.handleResponse(res, () => this.getMinutas(''))
      })
    }
  }


  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getMinutas('')
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getMinutas('')
    }
  }
}
