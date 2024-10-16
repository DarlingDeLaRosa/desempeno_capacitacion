import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { SnackBars } from './snackBars.service';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: "root" })

export class HerlperService {

    constructor(
        public snackBar: SnackBars,
    ) { }

    // Maneja todas las peticiones validando si existe un error o devolviendo el resultado de la petición.
    handleRequest<T>(request: () => Observable<T>): Observable<T> {
        return request().pipe(
            catchError((error) => {
                this.snackBar.snackbarLouder(false);
                setTimeout(() => {
                    error.error.detail ? this.snackBar.snackbarError(error.error.detail)
                        : this.snackBar.snackbarServerError();
                }, 500);
                return throwError(error)
            }),
        );
    }

    //Maneja las respuestas de las peticiones lanzando un mensaje, reiniciando un formulario o llamando la funcion get para obtener los datos actualizados.
    handleResponse(response: any, onSuccess: () => void, formToReset?: FormGroup, onSecondSuccess?: () => void) {
        if (response.status) {
            this.snackBar.snackbarLouder(false);
            setTimeout(() => {
                this.snackBar.snackbarSuccess();
                onSuccess();
                formToReset?.reset();
                if (onSecondSuccess != undefined) onSecondSuccess();
            }, 500);
        } else {
            this.snackBar.snackbarLouder(false);
            this.snackBar.snackbarError('Ocurrio un error la operación no se realizo correctamente.')
        }
    }

    //Hacer peticion de crear o editar dependiendo de lo necesario, formateando el formulario
    saveChanges(saveFunction: () => void, updateFunction: () => void, idRegister: number, form: FormGroup) {
        if (form.valid) {
            this.snackBar.snackbarLouder(true)
            if (idRegister > 0) updateFunction()
            else saveFunction()
        } else this.snackBar.snackbarError('Completa los campos requeridos para realizar la acción.')
    }
}