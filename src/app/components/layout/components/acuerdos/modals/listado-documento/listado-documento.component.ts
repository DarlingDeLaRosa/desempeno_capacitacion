import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI, Documento } from '../../interfaces/acuerdo.interface';
import { HttpClient } from '@angular/common/http';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';

@Component({
  selector: 'app-listado-documento',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './listado-documento.component.html',
  styleUrl: './listado-documento.component.css'
})
export class ListadoDocumentoComponent implements OnInit{

  documentosList!: Array<Documento>;
  acuerdo!: AcuerdoI;
  selectedFile: File | null = null;
  selectedFileName: string | undefined;
  isLoading:boolean = true
  constructor(
    private http:HttpClient,
    private SnackBar:SnackBars,
    private appHelpers: HerlperService,
    private agreementservice:agreementService,
    public dialogRef: MatDialogRef<ListadoDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){

  }
  ngOnInit(): void {
    this.getAcuerdoByIdCollaborator()
  }

  getAcuerdoByIdCollaborator(){
    this.agreementservice.getAgreementByIdCollaborator(this.data.idCollaborator).subscribe((resp:any)=>{
      this.acuerdo = resp.data

      if (this.acuerdo) this.documentosList = this.acuerdo.documentosObj;
      else this.documentosList = []
    })
  }

  postFileAcuerdo(formdata:any){
    this.agreementservice.postFileAcuerdo(formdata).subscribe((resp)=>{
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.getAcuerdoByIdCollaborator());
      this.selectedFile = null;
      this.selectedFileName = undefined;
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
      this.agreementservice.deleteDocumentAcuerdo(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () =>
          this.getAcuerdoByIdCollaborator())
        })
    }
  }

  openDocumentInNewTab(urldocument:any): void {
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
    }else{
      formData.append('Documentos', this.selectedFile);
      formData.append('IdAcuerdo', this.acuerdo.idAcuerdo.toString());
    this.postFileAcuerdo(formData);
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
