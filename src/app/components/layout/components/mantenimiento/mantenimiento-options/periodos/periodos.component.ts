import { Component, OnInit } from '@angular/core';
import { PeriodI } from './interfaces/periodo.interface';
import { PeriodsServices } from './services/periodos.service';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialComponents } from '../../../../../../helpers/material.components';

@Component({
  selector: 'app-periodos',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './periodos.component.html',
  styleUrl: './periodos.component.css'
})
export class PeriodosComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private periodService: PeriodsServices,
  ) {
    this.periodsForm = fb.group({
      idPeriodo: 0,
      estado: new FormControl(false),
      nombre: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
    })
  }

  page: number = 1
  periods!: PeriodI[]
  periodsForm: FormGroup
  pagination!: PaginationI

  ngOnInit(): void {
    this.getPeriods()
  }

  // Metodo para activar un periodo
  activatePeriod(idPeriodo: number){
    this.periodService.putActivatePeriod(idPeriodo)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getPeriods(), this.periodsForm)
      })
  }

  // Metodo para obtener todos los periodos
  getPeriods() {
    this.periodService.getPeriods(this.page, 10)
      .subscribe((res: any) => {
        this.periods = res.data;

        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
      })
  }

  // Metodo para crear los periodos
  postPeriod() {
    this.periodsForm.patchValue({idPeriodo: 0})
    this.periodService.postPeriod(this.periodsForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getPeriods(), this.periodsForm)
      })
  }

  // Metodo para editar los periodos
  putPeriod() {
    this.periodService.putPeriod(this.periodsForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getPeriods(), this.periodsForm)
      })
  }

  // Metodo para eliminar los periodos
  async deletePeriod(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.periodService.deletePeriod(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getPeriods(), this.periodsForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(Period: PeriodI) {
    this.periodsForm.reset(Period)
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postPeriod(), () => this.putPeriod(), this.periodsForm.value.idPeriodo, this.periodsForm)
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getPeriods()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getPeriods()
    }
  }
}
