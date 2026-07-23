import { Component } from '@angular/core';
import { MaterialComponents} from '../../../../helpers/material.components';
import { ClassImports } from '../../../../helpers/class.components';

@Component({
  selector: 'app-competencias-oulet',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './competencias-oulet.component.html',
})
export class CompetenciasOuletComponent {}
