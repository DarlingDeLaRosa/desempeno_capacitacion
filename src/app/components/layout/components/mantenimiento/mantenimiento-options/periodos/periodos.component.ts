import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';

@Component({
  selector: 'app-periodos',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './periodos.component.html',
  styleUrl: './periodos.component.css'
})
export class PeriodosComponent {

}
