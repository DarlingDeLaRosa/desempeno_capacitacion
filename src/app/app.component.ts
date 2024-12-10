import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { systemInformationService } from './components/layout/services/systemInformationService.service';
import { PeriodsServices } from './components/layout/components/mantenimiento/mantenimiento-options/periodos/services/periodos.service';
import { MaterialComponents } from './helpers/material.components';
import { ClassImports } from './helpers/class.components';
import { IntranetServices } from './helpers/intranet/intranet.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialComponents, ClassImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private systemInformation: systemInformationService,
  ) {}

  ngOnInit(): void {}

  

  //metodo para obtener el token del sistema
  // getUserSystem() {
  //   const credenciales = {
  //     token: this.tokenIntranet,
  //     idSistema: this.systemInformation.getSistema
  //   }
  //   this.intranetService.postUserLogin(credenciales).subscribe((resp: any) => {
  //     this.systemInformation.setSystemToken = resp.token
  //   })
  // }
}
