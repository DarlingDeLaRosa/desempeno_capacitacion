import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './colaboradores.component.html',
  styleUrl: './colaboradores.component.css'
})
export class ColaboradoresComponent {

}
