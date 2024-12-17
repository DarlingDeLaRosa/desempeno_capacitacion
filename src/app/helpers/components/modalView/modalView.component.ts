import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialComponents } from '../../material.components';
import { ClassImports } from '../../class.components';

@Component({
  selector: 'app-responsible-view',
  templateUrl: './modalView.component.html',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
})

export class ListPropertyViewComponent{
  
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: {elementList: any[], name: string, property: string},
  ) {}
}
