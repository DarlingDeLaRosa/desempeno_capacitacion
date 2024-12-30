import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { agreementService } from '../../services/acuerdo.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';

@Component({
  selector: 'app-ver-comportamientos-probatorios',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './ver-comportamientos-probatorios.component.html',
  styleUrl: './ver-comportamientos-probatorios.component.css'
})
export class VerComportamientosProbatoriosComponent implements OnInit {

  constructor(
    private agreementservice: agreementService,
    public systemInformation: systemInformationService,
  ) {

  }

  ngOnInit(): void {
    this.getBehaviorsTested()
  }

  getBehaviorsTested() {
    this.agreementservice.getBehaviorTest()
      .subscribe((res: any) => {
        console.log(res);
      })
  }
}
