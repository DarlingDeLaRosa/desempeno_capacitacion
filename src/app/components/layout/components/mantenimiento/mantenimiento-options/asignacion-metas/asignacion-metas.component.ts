import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { AsignationGoalGetI } from './interfaces/asignacion-metas.interface';
import { OcupationalGroupI } from '../../../../../../helpers/intranet/intranet.interface';
import { AsignationGoalsServices } from './services/asignacion-meta.service';
import { GoalGetI } from '../metas/interface/metas.interface';
import { GoalsServices } from '../metas/services/meta.service';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';

@Component({
  selector: 'app-asignacion-metas',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './asignacion-metas.component.html',
  styleUrl: './asignacion-metas.component.css'
})
export class AsignacionMetasComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private goalService: GoalsServices,
    private appHelpers: HerlperService,
    private intranetService: IntranetServices,
    private asignationGoalService: AsignationGoalsServices,
  ) {

    this.asignationGoalForm = fb.group({
      idAsignacion: 0,
      isSup: new FormControl(false),
      idGrupo: new FormControl('', Validators.required),
      idMeta: new FormControl('', Validators.required),
    })
  }

  page: number = 1
  goals!: GoalGetI[]
  pagination!: PaginationI
  showSupGOII: boolean = false
  asignationGoalForm: FormGroup
  ocupationalGroup!: OcupationalGroupI[]
  asignationGoals!: AsignationGoalGetI[]

  ngOnInit(): void {
    this.getGoals()
    this.getAsignationGoals()
    this.getOcupationalGroup()
  }

  // Metodo para obtener todos los grupos ocupacionales
  // validateMetaPOA(goal: GoalGetI) {
  //   if (this.asignationGoalForm.value.idGrupo == 5 && goal.metaPoa == null) {
  //     this.snackBar.snackbarWarning('La meta seleccionada debe estar atada a una meta del POA para ser asignada al grupo ocupacional V.', 7000)
  //     this.asignationGoalForm.get('idMeta')?.reset()
  //   }
  // }

  // Metodo para obtener todos los grupos ocupacionales
  getOcupationalGroup() {
    this.intranetService.getOcupationalGroup()
      .subscribe((res: any) => {
        this.ocupationalGroup = res.data;
      })
  }

  // Metodo para obtener todos las metas
  getGoals() {
    this.goalService.getGoals(1, 1000, true)
      .subscribe((res: any) => {
        this.goals = res.data;
      })
  }

  // Metodo para obtener todas las asignaciones de metas 
  getAsignationGoals() {
    this.asignationGoalService.getAsignationGoals(this.page, 10)
      .subscribe((res: any) => {
        this.asignationGoals = res.data;
        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
      })
  }

  // Metodo para crear las asignaciones de metas
  postAsignationGoal() {
    this.asignationGoalService.postAsignationGoal(this.asignationGoalForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getAsignationGoals(), this.asignationGoalForm)
      })
  }

  // Metodo para editar las asignaciones de metas
  putAsignationGoal() {
    this.asignationGoalService.putAsignationGoal(this.asignationGoalForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getAsignationGoals(), this.asignationGoalForm)
      })
  }

  // Metodo para eliminar las asignaciones de metas 
  async deleteAsignationGoal(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.asignationGoalService.deleteAsignationGoal(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getAsignationGoals(), this.asignationGoalForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(asignationGoal: AsignationGoalGetI) {
    this.asignationGoalForm.reset(asignationGoal)
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postAsignationGoal(), () => this.putAsignationGoal(), this.asignationGoalForm.value.idAsignacion, this.asignationGoalForm)
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getAsignationGoals()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getAsignationGoals()
    }
  }
}
