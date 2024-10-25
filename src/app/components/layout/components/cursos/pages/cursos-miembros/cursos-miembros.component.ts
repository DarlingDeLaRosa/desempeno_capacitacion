import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';

@Component({
  selector: 'app-cursos-miembros',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './cursos-miembros.component.html',
  styleUrl: './cursos-miembros.component.css'
})
export class CursosMiembrosComponent {

}
