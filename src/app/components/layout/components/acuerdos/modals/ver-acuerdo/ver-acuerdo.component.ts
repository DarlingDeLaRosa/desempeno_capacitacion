import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI } from '../../interfaces/acuerdo.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { SnackBars } from '../../../../services/snackBars.service';


@Component({
  selector: 'app-ver-acuerdo',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [agreementService],
  templateUrl: './ver-acuerdo.component.html',
  styleUrl: './ver-acuerdo.component.css'
})
export class VerAcuerdoComponent implements OnInit {

  agreement!: AcuerdoI;
  goalDetails!: Array<any>;
  totalCalificacion: number = 0
  totalValor: number = 0
  commentsForm: FormGroup

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    public appHelper: HerlperService,
    private agreementservice: agreementService,
    public systemInformation: systemInformationService,
    public dialogRef: MatDialogRef<VerAcuerdoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idAgreement: number }
  ) {
    this.commentsForm = fb.group({
      acuerdoId: 0,
      descripcion: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.getAgreementByIdCollaborator()
  }

  //metodo para obterner el acuerdo segun el id del collaborador
  getAgreementByIdCollaborator() {
    this.agreementservice.getAgreementById(this.data.idAgreement).subscribe((resp: any) => {
      this.agreement = resp.data;
      console.log(this.agreement);

      this.calculadora()
    })
  }

  postComment() {
    this.commentsForm.patchValue({ acuerdoId: this.agreement.idAcuerdo })
    this.agreementservice.postComment(this.commentsForm.value).subscribe((res: any) => {
      if (res.status) {
        this.appHelper.handleResponse(res, () => this.closeModal(), this.commentsForm)
      }
    })
  }

  async agreementDesicion(decision: boolean) {
    let flowData
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation(`Esta seguro de evaluar el acuerdo como ${decision ? 'CORRECTO' : 'INCORRECTO'}`, '')

    if (removeDecision) {
      decision ? flowData = { acuerdoId: this.agreement.idAcuerdo, flujoId: this.agreement.flujoObj.idFlujo + 1 }
        : flowData = { acuerdoId: this.agreement.idAcuerdo, flujoId: 2 }

      this.agreementservice.updateFlow(flowData).subscribe((res: any) => {
        if (res.status) {
          this.appHelper.handleResponse(res, () => this.closeModal(), this.commentsForm)
        }
      })
    }
  }

  //metodo para calcular la Calificaicon total y el valor total
  calculadora() {
    this.totalCalificacion = this.agreement.detalles.reduce((acc, item) => acc + (item.calificacion || 0), 0);
    this.totalValor = this.agreement.detalles.reduce((acc, item) => acc + (item.metaObj.valor || 0), 0);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
