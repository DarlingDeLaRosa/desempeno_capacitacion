import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { SnackBars } from './snackBars.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from '../../../helpers/service/loader.service';
import { DepartmentI, DivisionI, DirectionI, ViceRectorate } from '../components/mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';

@Injectable({ providedIn: "root" })

export class HerlperService {

    constructor(
        public snackBar: SnackBars,
        private loaderService: LoaderService
    ) { }

    // Maneja todas las peticiones validando si existe un error o devolviendo el resultado de la petición.
    handleRequest<T>(request: () => Observable<T>): Observable<T> {
        return request().pipe(
            finalize(() => this.loaderService.hide()),
            catchError((error) => {
                this.snackBar.snackbarLouder(false);
                setTimeout(() => {
                    error.error.message ? this.snackBar.snackbarError(error.error.message, 6000)
                        : this.snackBar.snackbarServerError();
                }, 500);
                return throwError(error)
            }),
        );
    }

    //Maneja las respuestas de las peticiones lanzando un mensaje, reiniciando un formulario o llamando la funcion get para obtener los datos actualizados.
    handleResponse(response: any, onSuccess: () => void, formToReset?: FormGroup, onSecondSuccess?: () => void) {
        if (response.status) {
            console.log('SI LLEGO');
            
            this.snackBar.snackbarLouder(false);
            // setTimeout(() => {
                this.snackBar.snackbarSuccess();
                onSuccess();
                formToReset?.reset();
                if (onSecondSuccess != undefined) onSecondSuccess();
            // }, 500);
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

    //Metodo para retornar de cual unidad 
    getUnitOrg(division: DivisionI, department: DepartmentI, direction: DirectionI, vicerectorate: ViceRectorate) {
        return [division, department, direction, vicerectorate].find(
            unit => unit.nombre !== "NO ASIGNADO" && unit.nombre !== "N/A"
        );
    }
}
