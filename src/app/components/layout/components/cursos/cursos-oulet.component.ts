import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../helpers/material.components';
import { ClassImports } from '../../../../helpers/class.components';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './cursos-oulet.component.html',
})
export class CursosComponent {

}
