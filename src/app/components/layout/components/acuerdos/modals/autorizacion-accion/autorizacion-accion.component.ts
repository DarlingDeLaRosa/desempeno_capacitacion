import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { typeProcessesI } from '../../../mantenimiento/mantenimiento-options/asignacion-acuerdo/interfaces/asignacion-acuerdo.interface';
import { PeriodsProcessServices } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';

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
    private appHelpers: HerlperService,
    private periodProcessService: PeriodsProcessServices,
    private dialogRef: MatDialogRef<AutorizacionAccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {idPersona: number,  nombre: string, apellido: string},
  ) {
    this.authorizeAccionForm = fb.group({
      idAuthorize: 0,
      idProcess: new FormControl(''),
      personaId: new FormControl('', Validators.required),
    })
  }

  authorizeAccionForm: FormGroup
  processes!: typeProcessesI[]

  ngOnInit(): void {
    this.getProcesses()
  }
  
  getProcesses() {
    this.periodProcessService.getTypeProcess()
      .subscribe((res: any) => { this.processes = res.data; })
  }
  
  closeModal(): void {
    this.dialogRef.close();
  }
}
