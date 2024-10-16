import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { ClassImports } from '../../class.components';
import { MaterialComponents } from '../../material.components';

@Component({
    selector: 'selector',
    standalone: true,
    imports: [MaterialComponents, ClassImports],
    templateUrl: 'snackbarConfirmDelete.component.html'
})
export class SnackBarConfirmation {

    constructor(
        private snackBarRef: MatSnackBarRef<SnackBarConfirmation>
    ) { }

    onComfirm() { this.snackBarRef.dismissWithAction() }
    closeSnackbar() { this.snackBarRef.dismiss() }
}