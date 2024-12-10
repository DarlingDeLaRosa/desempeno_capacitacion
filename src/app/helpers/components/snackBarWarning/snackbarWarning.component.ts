import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ClassImports } from '../../class.components';
import { MaterialComponents } from '../../material.components';

@Component({
  selector: 'SnackbarWarning',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './snackbarWarning.component.html',
})
export class SnackbarWarning {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
