import { Component } from '@angular/core';
import { MaterialComponents } from '../../material.components';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { ClassImports } from '../../class.components';

@Component({
  selector: 'snackbarServerError',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './snackbarServerError.component.html',
})
export class SnackbarServerError {

  constructor(
    private snackBarRef: MatSnackBarRef<SnackbarServerError>
  ){}

  closeSnackbar() { this.snackBarRef.dismiss() }
}
