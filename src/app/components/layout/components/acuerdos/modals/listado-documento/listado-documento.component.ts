import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI, Documento, DocumentoMinuta, MinutaGetI } from '../../interfaces/acuerdo.interface';
import { HttpClient } from '@angular/common/http';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { MinutaService } from '../../services/minuta.service';
import { PeriodsProcessServices } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';

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
  documentosListMinuta!: Array<DocumentoMinuta>;
  acuerdo!: AcuerdoI;
  minuta!: MinutaGetI[];
  selectedFile: File | null = null;
  selectedFileName: string | undefined;
  isLoading: boolean = true
  evaluationComptency!: {fechaFin: string, fechaInicio: string }

  constructor(
    private http: HttpClient,
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
      estado?: number
    }
  ) {
    this.idUserLogged = Number(systemInformation.localUser.idPersona)
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
    this.agreementservice.getAgreementByIdCollaborator(this.data.idCollaborator).subscribe((resp: any) => {
      this.acuerdo = resp.data

      if (this.acuerdo) this.documentosList = this.acuerdo.documentosObj;
      else this.documentosList = []
    })
  }

  getMinutasDoc() {
    this.minutaservice.getMinuta('', "evaluacion", true, 1, 5).subscribe((resp: any) => {
      this.minuta = resp.data
      this.documentosListMinuta = resp.data[0].documentos
      // if (this.minuta.length > 0) this.documentosList = this.minuta;
      // else this.documentosList = []
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
      this.cerrar()
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

      this.SnackBar.snackbarLouder(true)

      if (this.data.type == 1) {
        this.agreementservice.deleteDocumentAcuerdo(id)
          .subscribe((res: any) => {
            this.appHelpers.handleResponse(res, () => this.getAcuerdoByIdCollaborator())
            this.cerrar()
          })
      } else {
        this.minutaservice.deleteDocMinuta(this.minuta[0].documentos[0].idDocumento)
          .subscribe((res: any) => {
            this.appHelpers.handleResponse(res, () => this.getAcuerdoByIdCollaborator())
            this.cerrar()
          })
      }
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

  cerrar(): void {
    this.dialogRef.close();
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
