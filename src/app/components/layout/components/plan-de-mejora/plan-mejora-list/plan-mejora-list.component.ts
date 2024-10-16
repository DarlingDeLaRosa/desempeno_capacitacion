import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material.components';
import { ClassImports } from '../../../../../helpers/class.components';

@Component({
  selector: 'app-plan-mejora-list',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './plan-mejora-list.component.html',
  styleUrl: './plan-mejora-list.component.css'
})
export class PlanMejoraListComponent {

}
