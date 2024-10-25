import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material.components';
import { ClassImports } from '../../../../../helpers/class.components';

@Component({
  selector: 'app-mi-acuerdo',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './mi-acuerdo.component.html',
  styleUrl: './mi-acuerdo.component.css'
})
export class MiAcuerdoComponent {
  goals = [
    { meta: '', valor: '', evidencias: '', calificacion: '', observaciones: '' },
    { meta: '', valor: '', evidencias: '', calificacion: '', observaciones: '' },
    { meta: '', valor: '', evidencias: '', calificacion: '', observaciones: '' },
    { meta: '', valor: '', evidencias: '', calificacion: '', observaciones: '' },
    { meta: '', valor: '', evidencias: '', calificacion: '', observaciones: '' },
    { meta: '', valor: '', evidencias: '', calificacion: '', observaciones: '' },
  ];

}
