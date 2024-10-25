import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SnackBar } from '../../../helpers/components/snackBar/snackBar.component';
import { SnackBarSuccess } from '../../../helpers/components/snackBarSuccess/snackbarSuccess.component';
import { SnackbarServerError } from '../../../helpers/components/snackBarServerError/snackbarServerError.component';
import { SnackbarError } from '../../../helpers/components/snackBarError/snackbarError.component';
import { SnackBarConfirmation } from '../../../helpers/components/snackBarConfirmDelete/snackbarConfirmDelete.component';

@Injectable({
    providedIn: 'root'
})

export class SnackBars {

    constructor(
        private snackBar: MatSnackBar,
        private rendererFactory: RendererFactory2
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    snackBarRef: any
    private overlayElement!: any;
    private renderer: Renderer2;

    snackbarLouder(state: boolean) {
        if (state) {
            this.createOverlay();
            this.snackBarRef = this.snackBar.openFromComponent(SnackBar, {
                horizontalPosition: 'center',
                verticalPosition: 'top',
            })
        } else {
            if (this.snackBarRef) {
                setTimeout(() => {
                    this.snackBarRef.dismiss()
                    this.removeOverlay();
                }, 500);
            }
        }
    }

    snackbarSuccess() {
        this.snackBarRef = this.snackBar.openFromComponent(SnackBarSuccess, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2500
        })
    }

    snackbarServerError() {
        this.snackBarRef = this.snackBar.openFromComponent(SnackbarServerError, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 10000,
        })
    }

    snackbarError(errorMessage: string, time: number = 2500) {
        this.snackBarRef = this.snackBar.openFromComponent(SnackbarError, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: time,
            data: errorMessage
        })
    }

    snackbarConfirmationDelete(): Promise<boolean> {
        this.createOverlay();

        return new Promise((resolve) => {
            const snackBarRefConfirm = this.snackBar.openFromComponent(SnackBarConfirmation, {
                horizontalPosition: 'center',
                verticalPosition: 'top',
            })

            snackBarRefConfirm.afterDismissed().subscribe(info => {
                this.removeOverlay();

                if (info.dismissedByAction) {
                    resolve(true);
                } else {
                    this.removeOverlay();
                    resolve(false);
                }
            });
        })
    }

    private createOverlay() {
        if (!this.overlayElement) {
            this.overlayElement = this.renderer.createElement('div');
            this.renderer.setStyle(this.overlayElement, 'position', 'fixed');
            this.renderer.setStyle(this.overlayElement, 'top', '0');
            this.renderer.setStyle(this.overlayElement, 'left', '0');
            this.renderer.setStyle(this.overlayElement, 'width', '100%');
            this.renderer.setStyle(this.overlayElement, 'height', '100%');
            this.renderer.setStyle(this.overlayElement, 'backgroundColor', 'rgba(0, 0, 0, 0.2)');
            this.renderer.setStyle(this.overlayElement, 'zIndex', '50');
            this.renderer.setStyle(this.overlayElement, 'cursor', 'not-allowed');
            this.renderer.appendChild(document.body, this.overlayElement); // Añadir al DOM
        }
    }

    // Método para remover el overlay
    private removeOverlay() {
        if (this.overlayElement) {
            this.renderer.removeChild(document.body, this.overlayElement);
            this.overlayElement = null;
        }
    }
}

