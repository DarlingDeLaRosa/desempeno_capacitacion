import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../helpers/material.components';
import { ClassImports } from '../../../../helpers/class.components';

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './mantenimiento.component.html',
  styleUrl: './mantenimiento.component.css'
})
export class MantenimientoComponent {

}
