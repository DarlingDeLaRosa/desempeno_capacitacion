import { Component } from '@angular/core';
import { ClassImports } from '../../class.components';
import { MaterialComponents } from '../../material.components';

@Component({
  selector: 'snackBarSuccess',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './snackBarSuccess.component.html',
})
export class SnackBarSuccess {

}
