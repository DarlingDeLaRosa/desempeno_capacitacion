import { Component, OnInit } from '@angular/core';
import { MaterialComponents,} from '../../helpers/material.components';
import { ClassImports } from '../../helpers/class.components';
import { systemInformationService } from './services/systemInformationService.service';
import { loggedUserI } from '../../helpers/intranet/intranet.interface';
import { SnackBars } from './services/snackBars.service';
import { PeriodsProcessServices } from './components/mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { HerlperService } from './services/appHelpers.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{

  usuario!: loggedUserI
  improvePlan!: {fechaFin: string, fechaInicio: string }
  evaluationComptency!: {fechaFin: string, fechaInicio: string }

  constructor(
    private SnackBar: SnackBars,
    public appHelpers: HerlperService,
    private periodProcessService: PeriodsProcessServices,
    public systemInformationService: systemInformationService,
  ){}

  ngOnInit(): void {
    this.usuario = this.systemInformationService.localUser;
    this.getPeriodsProcesses(6)
    this.getPeriodsProcesses(7)
  }

  sidenavOpened: boolean = false;
  dropdownOpen: boolean = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  async cerrarSesion() {
    let remove: boolean = await this.SnackBar.snackbarConfirmation("Está seguro que desea cerrar la sesión ?", '')
    if (remove) {
      this.onLogout()
    }
  }

  getPeriodsProcesses(id: number) {
    this.periodProcessService.getPeriodBytypeProcess(id)
      .subscribe((res: any) => {
        if (res.data) { 
          if (res.data.tipoProceso.id == 6) this.improvePlan = {fechaFin: res.data.fechaFin, fechaInicio: res.data.fechaInicio}
          if (res.data.tipoProceso.id == 7) this.evaluationComptency = {fechaFin: res.data.fechaFin, fechaInicio: res.data.fechaInicio}
        }
      })
  }


  onLogout() {
    this.systemInformationService.logout();
     window.location.href = 'https://intranet.isfodosu.edu.do/#/home/home';
  }
}
