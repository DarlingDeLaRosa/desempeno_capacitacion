import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material.components';
import { ClassImports } from '../../../../../helpers/class.components';

@Component({
  selector: 'app-plan-mejora-formulario',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './plan-mejora-formulario.component.html',
  styleUrl: './plan-mejora-formulario.component.css'
})
export class PlanMejoraFormularioComponent {
  puntosFuertes: string[] = ['Responsable', 'Buen Comunicador'];
  areasMejora: string[] = ['Manejo de Estres'];

  // Properties to bind to input fields
  nuevoPuntoFuerte: string = '';
  nuevaAreaMejora: string = '';

  addItem(type: string) {
    if (type === 'puntosFuertes' && this.nuevoPuntoFuerte.trim()) {
      this.puntosFuertes.push(this.nuevoPuntoFuerte.trim());
      this.nuevoPuntoFuerte = ''; // Clear the input after adding
    } else if (type === 'areasMejora' && this.nuevaAreaMejora.trim()) {
      this.areasMejora.push(this.nuevaAreaMejora.trim());
      this.nuevaAreaMejora = ''; // Clear the input after adding
    }
  }
  removeItem(type: string, index: number) {
    if (type === 'puntosFuertes') {
      this.puntosFuertes.splice(index, 1); // Remove item from puntosFuertes
    } else if (type === 'areasMejora') {
      this.areasMejora.splice(index, 1); // Remove item from areasMejora
    }
  }
}
