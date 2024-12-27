import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { PeriodsProcessServices } from './services/periodo-procesos.service';
import { periodProcessGetI } from './interface/periodo-procesos.interface';
import { typeProcessesI } from '../asignacion-acuerdo/interfaces/asignacion-acuerdo.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';

@Component({
  selector: 'app-periodo-procesos',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './periodo-procesos.component.html',
  styleUrl: './periodo-procesos.component.css'
})
export class PeriodoProcesosComponent implements OnInit{

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private periodProcessService: PeriodsProcessServices,
    private systemInformationSevice: systemInformationService,
  ) {
    this.periodsProcessForm = fb.group({
      idPeriodoAcuerdo: new FormControl(0),
      periodoId: new FormControl(0),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      fechaProroga: new FormControl(null),
      tipoProcesoId: new FormControl('', Validators.required),
    })
  }

  page: number = 1
  pagination!: PaginationI
  processes!: typeProcessesI[]
  periodsProcessForm: FormGroup
  periodsProcess!: periodProcessGetI[]

  ngOnInit(): void {
    this.getProcesses()
    this.getPeriodsProcess()
  }

  getProcesses() {
    this.periodProcessService.getTypeProcess()
      .subscribe((res: any) => {
        this.processes = res.data;
      })
  }

  // Metodo para obtener todos los periodos de los procesos
  getPeriodsProcess() {
    this.periodProcessService.getPeriodProcesses(this.page, 10)
      .subscribe((res: any) => {
        this.periodsProcess = res.data;
        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
      })
  }

  // Metodo para crear los periodos de los procesos
  postPeriodProcess() {
    this.periodsProcessForm.patchValue({idPeriodoAcuerdo: 0})
    this.periodProcessService.postPeriodProcess(this.periodsProcessForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getPeriodsProcess(), this.periodsProcessForm)
      })
  }

  // Metodo para editar los periodos de los procesos
  putPeriodProcess() {
    this.periodProcessService.putPeriodProcess(this.periodsProcessForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getPeriodsProcess(), this.periodsProcessForm)
      })
  }

  // Metodo para eliminar los periodos de los procesos
  async deletePeriodProcess(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.periodProcessService.deletePeriodProcess(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getPeriodsProcess(), this.periodsProcessForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(period: periodProcessGetI) {
    this.periodsProcessForm.reset(period)
    this.periodsProcessForm.patchValue({
      tipoProcesoId: period.tipoProceso.id
    })
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.periodsProcessForm.patchValue({periodoId: this.systemInformationSevice.activePeriod().idPeriodo })
    this.appHelpers.saveChanges(() => this.postPeriodProcess(), () => this.putPeriodProcess(), this.periodsProcessForm.value.idPeriodoAcuerdo, this.periodsProcessForm)
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getPeriodsProcess()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getPeriodsProcess()
    }
  }
}
