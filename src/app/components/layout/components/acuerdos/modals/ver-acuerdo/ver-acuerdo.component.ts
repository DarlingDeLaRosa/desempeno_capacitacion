import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI } from '../../interfaces/acuerdo.interface';
import { HerlperService } from '../../../../services/appHelpers.service';


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

  constructor(
    private agreementservice: agreementService,
    public appHelper: HerlperService,

    public dialogRef: MatDialogRef<VerAcuerdoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idPersona: number }
  ) { }

  ngOnInit(): void {
    this.getAgreementByIdCollaborator()
  }

  //metodo para obterner el acuerdo segun el id del collaborador
  getAgreementByIdCollaborator() {
    this.agreementservice.getAgreementByIdCollaborator(this.data.idPersona).subscribe((resp: any) => {
      this.agreement = resp.data;
      console.log(this.agreement);
      this.calculadora()
    })
  }

  //metodo para calcular la Calificaicon total y el valor total
  calculadora() {
    this.totalCalificacion = this.agreement.detalles.reduce((acc, item) => acc + (item.calificacion || 0), 0);
    this.totalValor = this.agreement.detalles.reduce((acc, item) => acc + (item.metaObj.valor || 0), 0);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
