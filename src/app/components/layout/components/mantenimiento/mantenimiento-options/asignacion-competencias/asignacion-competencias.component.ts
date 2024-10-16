import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { CompetencyServices } from '../competencias/services/competencias.service';
import { TypesGradesServices } from '../grados/services/tiposGrados.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { CompetencyI } from '../competencias/interfaces/competencias.interfaces';
import { GradesTypeGetI } from '../grados/interfaces/tiposGrados.interface';
import { AsignationCompetencyI } from './interfaces/asignacion-competencias.interface';
import { AsignationCompetenciesServices } from './services/asignacion-competencias.service';

@Component({
  selector: 'app-asignacion-competencias',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [CompetencyServices, TypesGradesServices, AsignationCompetenciesServices],
  templateUrl: './asignacion-competencias.component.html',
  styleUrl: './asignacion-competencias.component.css'
})

export class AsignacionCompetenciasComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private typeGradeService: TypesGradesServices,
    private competencyService: CompetencyServices,
    private asignationCompetenciesService: AsignationCompetenciesServices,
  ) {

    this.asignationCompetencyForm = fb.group({
      idAsignacion: 0,
      idGrupo: new FormControl('', Validators.required),
      idCompetencia: new FormControl('', Validators.required),
      idGrado: new FormControl('', Validators.required),
    })
  }

  asignationCompetencies!: AsignationCompetencyI[]
  asignationCompetencyForm: FormGroup
  competencies!: CompetencyI[]
  gradesTypes!: GradesTypeGetI[]

  ngOnInit(): void {
    this.getCompetencies()
    this.getAsignationCompetencies()
  }

  // Metodo para obtener todas las competencias
  getCompetencies() {
    this.competencyService.getCompetency()
      .subscribe((res: any) => {
        this.competencies = res.data;
      })
  }

  // Metodo para obtener todos los tipos de grados 
  getTypeGrades() {
    this.typeGradeService.getTypesGrades()
      .subscribe((res: any) => {
        this.gradesTypes = res.data;
      })
  }

  // Metodo para obtener todas las asignaciones de competencias 
  getAsignationCompetencies() {
    this.asignationCompetenciesService.getAsignationCompetencies()
      .subscribe((res: any) => {
        this.asignationCompetencies = res.data;
        console.log(this.asignationCompetencies);
      })
  }

  // Metodo para crear las asignaciones de competencias
  postAsignationCompetency() {
    this.asignationCompetenciesService.postAsignationCompetency(this.asignationCompetencyForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getAsignationCompetencies(), this.asignationCompetencyForm)
      })
  }

  // Metodo para editar las asignaciones de competencias
  putAsignationCompetency() {
    this.asignationCompetenciesService.putAsignationCompetency(this.asignationCompetencyForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getAsignationCompetencies(), this.asignationCompetencyForm)
      })
  }

  // Metodo para eliminar las asignaciones de competencias 
  async deleteAsignationCompetency(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.asignationCompetenciesService.deleteAsignationCompetency(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getAsignationCompetencies(), this.asignationCompetencyForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(asignationCompetency: any) {
    this.asignationCompetencyForm.reset(asignationCompetency)
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postAsignationCompetency(), () => this.putAsignationCompetency(), this.asignationCompetencyForm.value.idAsignacion, this.asignationCompetencyForm)
  }
}
