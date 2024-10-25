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

@Component({
  selector: 'app-asignacion-metas',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [IntranetServices, AsignationGoalsServices, GoalsServices],
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
      idGrupo: new FormControl('', Validators.required),
      idMeta: new FormControl('', Validators.required),
    })
  }

  goals!: GoalGetI[]
  asignationGoalForm: FormGroup
  ocupationalGroup!: OcupationalGroupI[]
  asignationGoals!: AsignationGoalGetI[]

  ngOnInit(): void {
    this.getOcupationalGroup()
    this.getGoals()
  }

  // Metodo para obtener todos los grupos ocupacionales
  getOcupationalGroup() {
    this.intranetService.getOcupationalGroup()
      .subscribe((res: any) => {
        this.ocupationalGroup = res.data;
      })
  }

  // Metodo para obtener todos las metas
  getGoals() {
    this.goalService.getGoals()
      .subscribe((res: any) => {
        this.goals = res.data;
      })
  }

  // Metodo para obtener todas las asignaciones de metas 
  getAsignationGoals() {
    this.asignationGoalService.getAsignationGoals()
      .subscribe((res: any) => {
        this.asignationGoals = res.data;
        console.log(this.asignationGoals);
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
    let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()

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
}
