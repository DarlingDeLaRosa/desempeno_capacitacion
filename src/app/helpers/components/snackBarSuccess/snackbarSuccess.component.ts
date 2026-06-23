import { Component, Inject } from '@angular/core';
import { ClassImports } from '../../class.components';
import { MaterialComponents } from '../../material.components';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'snackBarSuccess',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './snackBarSuccess.component.html',
})
export class SnackBarSuccess {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
