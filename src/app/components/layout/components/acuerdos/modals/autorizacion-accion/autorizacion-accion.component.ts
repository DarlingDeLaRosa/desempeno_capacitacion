import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { typeProcessesI } from '../../../mantenimiento/mantenimiento-options/asignacion-acuerdo/interfaces/asignacion-acuerdo.interface';
import { PeriodsProcessServices } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { agreementService } from '../../services/acuerdo.service';

@Component({
  selector: 'app-autorizacion-accion',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './autorizacion-accion.component.html',
  styleUrl: './autorizacion-accion.component.css'
})
export class AutorizacionAccionComponent implements OnInit{

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelper: HerlperService,
    private agreementservice: agreementService,
    private periodProcessService: PeriodsProcessServices,
    private dialogRef: MatDialogRef<AutorizacionAccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {idPersona: number,  nombre: string, apellido: string, idAcuerdo: number},
  ) {
    this.authorizeAccionForm = fb.group({
      processId: 0,
    })
  }

  authorizeAccionForm: FormGroup
  processes!: typeProcessesI[]

  ngOnInit(): void {
    this.getProcesses()
  }
  
  getProcesses() {
    this.periodProcessService.getTypeProcess(true)
      .subscribe((res: any) => { this.processes = res.data; })
  }
  
  closeModal(): void {
    this.dialogRef.close();
  }

  async postProcessChange() {
    let processData
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation(`¿Esta seguro de cambiar el proceso del acuerdo de desempeño ?`, 'Esto permitira a usuarios hacer cambios que el proceso permita.')

    if (removeDecision) {
       processData = { acuerdoId: this.data.idAcuerdo, procesoId: this.authorizeAccionForm.value.processId }

      this.agreementservice.updateProcess(processData).subscribe((res: any) => {
        if (res.status) {
          this.appHelper.handleResponse(res, () => this.closeModal(), this.authorizeAccionForm)
        }
      })
    }
  }

}
