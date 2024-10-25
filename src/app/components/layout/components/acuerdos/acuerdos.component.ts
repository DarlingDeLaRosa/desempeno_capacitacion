import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../helpers/material.components';
import { ClassImports } from '../../../../helpers/class.components';

@Component({
  selector: 'app-acuerdos',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './acuerdos.component.html',
})
export class AcuerdosComponent {

}
