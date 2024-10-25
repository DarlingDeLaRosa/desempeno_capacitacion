import { Component, OnInit } from '@angular/core';
import { MaterialComponents,} from '../../helpers/material.components';
import { ClassImports } from '../../helpers/class.components';
import { systemInformationService } from './services/systemInformationService.service';
import { loggedUserI } from '../../helpers/intranet/intranet.interface';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers:[systemInformationService],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
usuario!: loggedUserI

  constructor(
    private systemInformationService: systemInformationService
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

}
