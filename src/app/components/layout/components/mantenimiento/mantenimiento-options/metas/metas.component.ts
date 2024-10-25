import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { HerlperService } from '../../../../services/appHelpers.service';
import { SnackBars } from '../../../../services/snackBars.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoalGetI, VerificationMethodI } from './interface/metas.interface';
import { GoalsServices } from './services/meta.service';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [GoalsServices],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.css'
})
export class MetasComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private goalService: GoalsServices,
  ) {
    this.goalsForm = fb.group({
      idMeta: 0,
      idMedio: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      valor: new FormControl('', Validators.required),
    })
  }

  goals!: GoalGetI[]
  goalsForm: FormGroup
  verificationMethods!: VerificationMethodI[]

  ngOnInit(): void {
    this.getGoals()
    this.getVerificationMethod()
  }


  // Metodo para obtener todos los grupos ocupacionales
  getVerificationMethod() {
    this.goalService.getVerificationMethod()
      .subscribe((res: any) => {
        this.verificationMethods = res.data;
      })
  }

  // Metodo para obtener todas las competencias
  getGoals() {
    this.goalService.getGoals()
      .subscribe((res: any) => {
        this.goals = res.data;
      })
  }

  // Metodo para crear las asignaciones de competencias
  postGoal() {
    this.goalService.postGoal(this.goalsForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getGoals(), this.goalsForm)
      })
  }

  // Metodo para editar las asignaciones de competencias
  putGoal() {
    this.goalService.putGoal(this.goalsForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getGoals(), this.goalsForm)
      })
  }

  // Metodo para eliminar las asignaciones de competencias 
  async deleteGoal(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.goalService.deleteGoal(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getGoals(), this.goalsForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(goal: GoalGetI) {
    this.goalsForm.reset(goal)
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postGoal(), () => this.putGoal(), this.goalsForm.value.idMeta, this.goalsForm)
  }
}
