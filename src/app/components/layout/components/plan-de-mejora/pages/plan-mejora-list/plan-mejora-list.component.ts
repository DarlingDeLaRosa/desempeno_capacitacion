import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { agreementService } from '../../../acuerdos/services/acuerdo.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { AcuerdoI } from '../../../acuerdos/interfaces/acuerdo.interface';
import { MatDialog } from '@angular/material/dialog';
import { VerPlanComponent } from '../../modals/ver-plan/ver-plan.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-plan-mejora-list',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  providers:[agreementService,systemInformationService],
  templateUrl: './plan-mejora-list.component.html',
  styleUrl: './plan-mejora-list.component.css'
})
export class PlanMejoraListComponent implements OnInit{

  usuario!: loggedUserI
  agreementList :Array<AcuerdoI> = []

  constructor(
    private agreementService:agreementService,
    private systemInformation:systemInformationService,
    private dialog: MatDialog,
    private router: Router
  ){
    this.usuario = this.systemInformation.localUser;
  }

  ngOnInit(): void {
    this.getAcuerdoByRol();
  }

  getAcuerdoByRol(){
    this.agreementService.getAgreementByRol(this.usuario.idPersona).subscribe((resp:any)=>{
      this.agreementList = resp.data;
      console.log(this.agreementList);

    })
  }

  openModalVerPlanMejora(idCollaborator:number, nombre:string, apellido:string): void {
    const nombreCompleto = (nombre + ' ' +apellido)
    const dialogRef = this.dialog.open(VerPlanComponent, {
      width: '70%',
      data: { idCollaborator,
        nombreCompleto }

    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
