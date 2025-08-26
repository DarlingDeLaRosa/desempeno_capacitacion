import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI, Documento, DocumentoMinuta, MinutaGetI, validationMinutaI } from '../../interfaces/acuerdo.interface';
import { HttpClient } from '@angular/common/http';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { MinutaService } from '../../services/minuta.service';
import { PeriodsProcessServices } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { CommentEmailComponent } from '../../pages/minuta-list/dialog/comment-email/comment-email.component';

@Component({
  selector: 'app-listado-documento',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './listado-documento.component.html',
  styleUrl: './listado-documento.component.css'
})
export class ListadoDocumentoComponent implements OnInit {

  documentosList!: Array<Documento>;
  idUserLogged!: number
  rolUserLogged!: string
  // documentosListMinuta!: Array<DocumentoMinuta>;
  acuerdo!: AcuerdoI;
  minuta!: MinutaGetI[];
  selectedFile: File | null = null;
  selectedFileName: string | undefined;
  isLoading: boolean = true
  evaluationComptency!: { fechaFin: string, fechaInicio: string }

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private SnackBar: SnackBars,
    public appHelpers: HerlperService,
    private minutaservice: MinutaService,
    private agreementservice: agreementService,
    public systemInformation: systemInformationService,
    private periodProcessService: PeriodsProcessServices,
    public dialogRef: MatDialogRef<ListadoDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: number,
      idCollaborator: number,
      nombreCompleto: string,
      documentos: DocumentoMinuta[],
      estado?: number,
    }
  ) {
    this.idUserLogged = Number(systemInformation.localUser.idPersona)
    this.rolUserLogged = systemInformation.localUser.role
  }

  ngOnInit(): void {
    this.getPeriodsProcesses(7)

    if (this.data.type == 1) {
      this.getAcuerdoByIdCollaborator()
    } else {
      this.getMinutasDoc()
    }
  }

  getAcuerdoByIdCollaborator() {
    // this.agreementservice.getAgreementByIdCollaborator(this.data.idCollaborator).subscribe((resp: any) => {
    //   this.acuerdo = resp.data

    //   if (this.acuerdo) this.documentosList = this.acuerdo.documentosObj;
    //   else this.documentosList = []
    // })
  }

  getMinutasDoc() {
    this.minutaservice.getMinuta('', "evaluacion", true, 1, 5).subscribe((resp: any) => {
      this.minuta = resp.data
    })
  }

  postFileAcuerdo(formdata: any) {
    this.agreementservice.postFileAcuerdo(formdata).subscribe((resp) => {
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.getAcuerdoByIdCollaborator());

      this.selectedFile = null;
      this.selectedFileName = undefined;
    })
  }

  postFileMinuta(formdata: any) {
    this.minutaservice.postDocMinuta(this.minuta[0].id, formdata).subscribe((resp) => {

      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.getAcuerdoByIdCollaborator());

      this.selectedFile = null;
      this.selectedFileName = undefined;
      this.cerrar(true)
    })
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  async deleteDocument(id: number) {

    let removeDecision: boolean = await this.SnackBar.snackbarConfirmation()

    if (removeDecision) {

      let validation: validationMinutaI = { estado: removeDecision, comentario: '' }

      const dialog = this.dialog.open(CommentEmailComponent, {disableClose: true})

      dialog.afterClosed().subscribe(result => {
        validation.comentario = result
        this.SnackBar.snackbarLouder(true)

        if (this.data.type == 1) {
          this.agreementservice.deleteDocumentAcuerdo(id)
            .subscribe((res: any) => {
              this.appHelpers.handleResponse(res, () => this.getAcuerdoByIdCollaborator())
              this.cerrar(true)
            })
        } else {
          this.minutaservice.deleteDocMinuta(id, result)
            .subscribe((res: any) => {
              this.appHelpers.handleResponse(res, () => this.getAcuerdoByIdCollaborator())
              this.cerrar(true)
            })
        }
      });
    }
  }

  openDocumentInNewTab(urldocument: any): void {
    if (urldocument) {
      const url = urldocument as string;
      window.open(url, '_blank');
    }
  }

  enviarDatos() {
    const formData = new FormData();

    if (this.selectedFile == undefined) {
      this.SnackBar.snackbarError('No has seleccionado documento para guardar');
      return;
    } else {

      if (this.data.type == 1) {
        formData.append('Documentos', this.selectedFile);
        formData.append('IdAcuerdo', this.acuerdo.idAcuerdo.toString());

        this.postFileAcuerdo(formData);
      } else {
        formData.append('file', this.selectedFile);
        this.postFileMinuta(formData);
      }
    }
  }

  cerrar(should: boolean = false): void {
    this.dialogRef.close(should);
  }

  getPeriodsProcesses(id: number) {
    this.periodProcessService.getPeriodBytypeProcess(id)
      .subscribe((res: any) => {
        if (res.data) {
          if (res.data.tipoProceso.id == 7) this.evaluationComptency = { fechaFin: res.data.fechaFin, fechaInicio: res.data.fechaInicio }
        }
      })
  }
}
