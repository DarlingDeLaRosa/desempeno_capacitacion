import { Component } from '@angular/core';
import { ClassImports } from '../../class.components';
import { MaterialComponents } from '../../material.components';

@Component({
  selector: 'snackBar-loader',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './snackBar.component.html',
})
export class SnackBar {

}
