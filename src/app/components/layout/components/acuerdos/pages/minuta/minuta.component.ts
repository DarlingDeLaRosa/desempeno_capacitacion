import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { materialize } from 'rxjs';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { AcuerdoI } from '../../interfaces/acuerdo.interface';
import { agreementService } from '../../services/acuerdo.service';

@Component({
  selector: 'app-minuta',
  standalone: true,
  imports: [ClassImports,MaterialComponents],
  providers:[IntranetServices,systemInformationService],
  templateUrl: './minuta.component.html',
  styleUrl: './minuta.component.css'
})
export class MinutaComponent implements OnInit{

  collaborator!: any;
  usuario!: loggedUserI
  isLoading: boolean = true;
  agreement: Array<AcuerdoI> = []

  constructor(
    private agreementService: agreementService,
    public systeminformation:systemInformationService,
  ){}

  ngOnInit(): void {
    this.usuario = this.systeminformation.localUser;
    console.log(this.usuario);

    this.getAcuerdoByRol()
  }

  getAcuerdoByRol() {
    this.isLoading = true;
    this.agreementService.getAgreementByRol(this.usuario.idPersona, '').subscribe((resp: any) => {
      this.agreement = resp.data;
      console.log(this.agreement);
      this.isLoading = false;
    })
  }


  // getPeopleById() {
  //   this.intranetService.getPeopleById(this.idRegistro).subscribe((resp: any) => {
  //     this.collaborator = resp.data;
  //     this.isLoading2 = false;
  //     this.getAgreementByIdCollaborator();
  //   })
  // }
}
