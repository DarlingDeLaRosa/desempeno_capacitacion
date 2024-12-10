import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { ClassImports } from '../../class.components';
import { MaterialComponents } from '../../material.components';

@Component({
    selector: 'snackbarConfirmDelete',
    standalone: true,
    imports: [MaterialComponents, ClassImports],
    templateUrl: 'snackbarConfirmDelete.component.html'
})
export class SnackBarConfirmation {

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private snackBarRef: MatSnackBarRef<SnackBarConfirmation>
    ) { }

    onComfirm() { this.snackBarRef.dismissWithAction() }
    closeSnackbar() { this.snackBarRef.dismiss() }
}