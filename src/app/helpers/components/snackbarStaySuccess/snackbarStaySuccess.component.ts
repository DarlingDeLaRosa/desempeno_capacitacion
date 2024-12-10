import { Component, Inject } from '@angular/core';
import { ClassImports } from '../../class.components';
import { MaterialComponents } from '../../material.components';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'snackBarStaySuccess',
    standalone: true,
    imports: [MaterialComponents, ClassImports],
    templateUrl: './snackBarStaySuccess.component.html',
})
export class SnackBarStaySuccess {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private snackBarRef: MatSnackBarRef<SnackBarStaySuccess>
    ) { }

    closeSnackbar() { this.snackBarRef.dismiss() }
}
