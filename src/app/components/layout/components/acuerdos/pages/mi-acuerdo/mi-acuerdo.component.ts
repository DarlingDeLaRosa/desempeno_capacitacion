import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { AcuerdoI } from '../../interfaces/acuerdo.interface';
import { agreementService } from '../../services/acuerdo.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { Router } from '@angular/router';
import { SnackBars } from '../../../../services/snackBars.service';

@Component({
  selector: 'app-mi-acuerdo',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [agreementService, systemInformationService],
  templateUrl: './mi-acuerdo.component.html',
  styleUrl: './mi-acuerdo.component.css'
})
export class MiAcuerdoComponent implements OnInit {
  usuario!: loggedUserI
  agreement!: AcuerdoI
  totalCalificacion: number = 0
  totalValor: number = 0

  constructor(
    private router: Router,
    public snackBar: SnackBars,
    public appHelper: HerlperService,
    private agreementService: agreementService,
    private systemInformation: systemInformationService
  ) { }

  ngOnInit(): void {
    this.usuario = this.systemInformation.localUser;
    this.getAgreementByIdCollaborator()
  }

  getAgreementByIdCollaborator() {
    this.agreementService.getAgreementByIdCollaborator(this.usuario.idPersona).subscribe({
      next: (resp: any) => { this.agreement = resp.data },
      error: (error) => { 
        this.snackBar.snackbarError('El acuerdo de desempeño no fue encontrado', 4000)
        error.status == 404 ? this.navigate() : ''
      }
    });
  }

  navigate(){
    setTimeout(() => { this.router.navigate(['layout/acuerdos']);}, 1000);
  }

  calculadora() {
    this.totalCalificacion = this.agreement.detalles.reduce((acc, item) => acc + (item.calificacion || 0), 0);
    this.totalValor = this.agreement.detalles.reduce((acc, item) => acc + (item.metaObj.valor || 0), 0);
  }

}
