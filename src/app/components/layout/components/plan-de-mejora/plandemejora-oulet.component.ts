import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MaterialComponents } from '../../../../helpers/material.components';
import { ClassImports } from '../../../../helpers/class.components';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-plandemejora',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './plandemejora-oulet.component.html',
})
export class PlanMejoraOuletComponent {

}
