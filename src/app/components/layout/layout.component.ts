import { Component, OnInit } from '@angular/core';
import { MaterialComponents,} from '../../helpers/material.components';
import { ClassImports } from '../../helpers/class.components';
import { systemInformationService } from './services/systemInformationService.service';
import { loggedUserI } from '../../helpers/intranet/intranet.interface';
import { SnackBars } from './services/snackBars.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{

  usuario!: loggedUserI

  constructor(
    public systemInformationService: systemInformationService,
    private SnackBar: SnackBars,
  ){}

  ngOnInit(): void {
    this.usuario = this.systemInformationService.localUser;
  }

  sidenavOpened: boolean = false;
  dropdownOpen: boolean = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  async  cerrarSesion() {
    let remove: boolean = await this.SnackBar.snackbarConfirmation("Está seguro que desea cerrar la sesión ?", '')
    if (remove) {
      this.onLogout()
    }
  }
  onLogout() {
    this.systemInformationService.logout();
     window.location.href = 'https://intranet.isfodosu.edu.do/#/home/home';
  }
}
