import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI, Documento, historicalChangesI } from '../../interfaces/acuerdo.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { SnackBars } from '../../../../services/snackBars.service';
import { ActivatedRoute } from '@angular/router';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { ListadoDocumentoComponent } from '../listado-documento/listado-documento.component';
import { HistoricoComponent } from '../historico/historico.component';


@Component({
  selector: 'app-ver-acuerdo',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [agreementService],
  templateUrl: './ver-acuerdo.component.html',
  styleUrl: './ver-acuerdo.component.css'
})
export class VerAcuerdoComponent implements OnInit {

  type: string = '1'
  agreement!: AcuerdoI;
  goalDetails!: Array<any>;
  totalCalificacion: number = 0
  totalValor: number = 0
  commentsForm: FormGroup
  idAgreement: number = 0
  userLogged!: loggedUserI
  uploadFile: boolean = false
  historicalChanges: boolean = false

  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    public snackBar: SnackBars,
    private route: ActivatedRoute,
    public appHelper: HerlperService,
    private agreementservice: agreementService,
    public systemInformation: systemInformationService,
    // public dialogRef: MatDialogRef<VerAcuerdoComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: { idAgreement: number }
  ) {
    this.commentsForm = fb.group({
      acuerdoId: 0,
      descripcion: new FormControl('', [Validators.maxLength(400)]),
    })
    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type'] != undefined) {
        this.type = params['type'];
      }
    });

    this.idAgreement = Number(this.route.snapshot.paramMap.get('id'));
    this.getAgreementByIdCollaborator()
  }

  //metodo para obterner el acuerdo segun el id del collaborador
  getAgreementByIdCollaborator() {
    this.agreementservice.getAgreementById(this.idAgreement).subscribe((resp: any) => {
      this.agreement = resp.data;
      this.calculadora()
    })
  }

  postComment() {
    this.commentsForm.patchValue({ acuerdoId: this.agreement.idAcuerdo })
    this.agreementservice.postComment(this.commentsForm.value).subscribe((res: any) => {
      if (res.status) {
        this.appHelper.handleResponse(res, () => this.getAgreementByIdCollaborator(), this.commentsForm)
      }
    })
  }

  async agreementDesicion(decision: boolean) {
    let flowData
    let agreementDecision: boolean = await this.snackBar.snackbarConfirmation(`Esta seguro de evaluar el acuerdo como ${decision ? 'CORRECTO' : 'INCORRECTO'}`, '')

    if (agreementDecision) {
      if (this.agreement.colaboradorObj.grupoObj.idGrupo == 5) {
        flowData =
          decision && this.agreement.tipoProceso.id == 1 ?
            { acuerdoId: this.agreement.idAcuerdo, flujoId: this.agreement.flujoObj.idFlujo + 1 } :
            decision && this.agreement.tipoProceso.id != 1 ? { acuerdoId: this.agreement.idAcuerdo, flujoId: this.agreement.flujoObj.idFlujo + 2 }
              : { acuerdoId: this.agreement.idAcuerdo, flujoId: this.agreement.flujoObj.idFlujo }
      } else {
        decision ? flowData = { acuerdoId: this.agreement.idAcuerdo, flujoId: this.agreement.flujoObj.idFlujo + 2 }
          : flowData = { acuerdoId: this.agreement.idAcuerdo, flujoId: 1 }
      }

      this.agreementservice.updateFlow(flowData, decision).subscribe((res: any) => {
        if (res.status) {
          this.appHelper.handleResponse(res, () => this.getAgreementByIdCollaborator(), this.commentsForm)
        }
      })
    }
  }

  //metodo para calcular la Calificaicon total y el valor total
  calculadora() {
    this.totalCalificacion = this.agreement.detalles.reduce((acc, item) => acc + (item.calificacion || 0), 0);
    this.totalValor = this.agreement.detalles.reduce((acc, item) => acc + (item.metaObj.valor || 0), 0);
  }

  openModalListadoDocumentos(nombre: string, apellido: string, documentosList: Documento[] = []): void {
    const nombreCompleto = nombre + ' ' + apellido;
    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      data: {
        idCollaborator: 0,
        nombreCompleto,
        documentosList
      }
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.getAgreementByIdCollaborator()
      }
    });
  }
  
  openModalHistorico(changesList: historicalChangesI[] = [], meta: string): void {
    const dialog = this.dialog.open(HistoricoComponent, {
      data: { changesList, meta }
    })
  }

  // closeModal(): void {
  //   this.dialogRef.close();
  // }
}
