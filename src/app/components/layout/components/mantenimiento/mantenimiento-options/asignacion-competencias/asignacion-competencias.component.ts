import { Component, OnInit } from '@angular/core';
import { SnackBars } from '../../../../services/snackBars.service';
import { GradesGetI } from '../grados/interfaces/grados.interfaces';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { CompetencyI } from '../competencias/interfaces/competencias.interfaces';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { CompetencyServices } from '../competencias/services/competencias.service';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { OcupationalGroupI } from '../../../../../../helpers/intranet/intranet.interface';
import { AsignationGetCompetencyI } from './interfaces/asignacion-competencias.interface';
import { AsignationCompetenciesServices } from './services/asignacion-competencias.service';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';

@Component({
  selector: 'app-asignacion-competencias',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './asignacion-competencias.component.html',
  styleUrl: './asignacion-competencias.component.css'
})

export class AsignacionCompetenciasComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private intranetService: IntranetServices,
    private competencyService: CompetencyServices,
    private asignationCompetenciesService: AsignationCompetenciesServices,
  ) {
    this.asignationCompetencyForm = fb.group({
      idAsignacion: 0,
      // isSup: new FormControl(false),
      idGrupo: new FormControl('', Validators.required),
      idGrado: new FormControl('', Validators.required),
      idCompetencia: new FormControl('', Validators.required),
    })
  }

  page: number = 1
  pagination!: PaginationI
  gradesTypes!: GradesGetI[]
  competencies!: CompetencyI[]
  showSupGOII: boolean = false
  asignationCompetencyForm: FormGroup
  ocupationalGroup!: OcupationalGroupI[]
  asignationCompetencies!: AsignationGetCompetencyI[]

  ngOnInit(): void {
    this.getCompetencies()
    this.getOcupationalGroup()
    this.getAsignationCompetencies()
  }

  // activeSup(event: number) {
  //   if (event == 2) this.showSupGOII = true
  //   else this.showSupGOII = false
  // }

  // Metodo para obtener todos los grupos ocupacionales
  getOcupationalGroup() {
    this.intranetService.getOcupationalGroup()
      .subscribe((res: any) => {
        this.ocupationalGroup = res.data;
      })
  }

  // Metodo para obtener todas las competencias
  getCompetencies() {
    this.competencyService.getCompetency()
      .subscribe((res: any) => {
        this.competencies = res.data;
      })
  }

  // Metodo para obtener todas las competencias
  getCompetencyById(idCompetency: number) {
    this.competencyService.getCompetencyById(idCompetency)
      .subscribe((res: any) => {
        this.gradesTypes = res.data.gradosObj;
      })
  }

  // Metodo para obtener todas las asignaciones de competencias
  getAsignationCompetencies() {
    this.asignationCompetenciesService.getAsignationCompetencies(this.page, 10)
      .subscribe((res: any) => {
        this.asignationCompetencies = res.data;
        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
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
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.asignationCompetenciesService.deleteAsignationCompetency(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getAsignationCompetencies(), this.asignationCompetencyForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  async setValueToEdit(asignationCompetency: AsignationGetCompetencyI) {
    await this.getCompetencyById(asignationCompetency.idCompetencia)
    this.asignationCompetencyForm.reset(asignationCompetency)
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    console.log(this.asignationCompetencyForm.value);
    
    // this.appHelpers.saveChanges(() => this.postAsignationCompetency(), () => this.putAsignationCompetency(), this.asignationCompetencyForm.value.idAsignacion, this.asignationCompetencyForm)
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getAsignationCompetencies()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getAsignationCompetencies()
    }
  }
}
