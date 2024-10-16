import { Component } from '@angular/core';
import { MaterialComponents,} from '../../helpers/material.components';
import { ClassImports } from '../../helpers/class.components';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  sidenavOpened: boolean = false;
  dropdownOpen: boolean = false;

  toggleDropdown(event: Event) {
    event.stopPropagation(); 
    this.dropdownOpen = !this.dropdownOpen;
  }

}
