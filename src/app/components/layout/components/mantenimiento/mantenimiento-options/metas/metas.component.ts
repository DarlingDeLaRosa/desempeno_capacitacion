import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { HerlperService } from '../../../../services/appHelpers.service';
import { SnackBars } from '../../../../services/snackBars.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoalGetI, VerificationMethodI } from './interface/metas.interface';
import { GoalsServices } from './services/meta.service';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.css'
})
export class MetasComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private goalService: GoalsServices,
    private intranetService: IntranetServices,
  ) {
    this.goalsForm = fb.group({
      idMeta: 0,
      metaPoa: new FormControl(''),
      isTranversal: new FormControl(true),
      valor: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      idMedio: new FormControl('', Validators.required),
    })
  }
  
  page: number = 1
  goals!: GoalGetI[]
  goalsForm: FormGroup
  pagination!: PaginationI
  goalsPoa!: VerificationMethodI[]
  verificationMethods!: VerificationMethodI[]

  ngOnInit(): void {
    this.getGoals()
    this.getGoalPOA()
    this.getVerificationMethod()
  }

  // Metodo para obtener todas las metas del POA
  getGoalPOAFiltered() {
    const goalPOAValue = this.goalsForm.value.metaPoa;
    
    if (goalPOAValue && goalPOAValue.length >= 3) this.getGoalPOA(goalPOAValue)
    else this.goalsPoa = [];
  }

  getGoalPOA(nombre: string = ''){
    this.intranetService.getGoalPOA(nombre)
    .subscribe((res: any) => {
      this.goalsPoa = res.data;
    });
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
    this.goalService.getGoals(this.page, 10, true)
      .subscribe((res: any) => {
        this.goals = res.data;
        const {currentPage ,totalItem, totalPage} = res
        this.pagination = {currentPage ,totalItem, totalPage}
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
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

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

    //Metodo para llamar a la siguiente pagina
    nextPage() {
      if (this.page < this.pagination.totalPage) {
        this.page += 1
        this.getGoals()
      }
    }
  
    //Metodo para llamar a la pagina anterior
    previousPage() {
      if (this.page > 1) {
        this.page -= 1
        ;this.getGoals()
      }
    }
}
