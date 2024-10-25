import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GradesServices } from './services/grados.service';
import { GradesGetI } from './interfaces/grados.interfaces';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { CompetencyI } from '../competencias/interfaces/competencias.interfaces';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { CompetencyServices } from '../competencias/services/competencias.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ListPropertyViewComponent } from '../../../../../../helpers/components/modalView/modalView.component';
import { ClassImports } from '../../../../../../helpers/class.components';
import { GradesTypeGetI } from './interfaces/tiposGrados.interface';
import { TypesGradesServices } from './services/tiposGrados.service';

@Component({
  selector: 'app-grados',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [CompetencyServices, GradesServices, TypesGradesServices],
  templateUrl: './grados.component.html',
  styleUrl: './grados.component.css'
})
export class GradosComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private gradeService: GradesServices,
    private typeGradeService: TypesGradesServices,
    private competencyService: CompetencyServices,
  ) {

    this.gradesForm = fb.group({
      idGrado: 0,
      idCompetencia: new FormControl('', Validators.required),
      nombre: new FormControl(''),
      descripcion: new FormControl(''),
      idTipoGrado: new FormControl('', Validators.required),
      comportamientos: this.fb.array([])
    })
  }

  grades!: GradesGetI[]
  gradesForm: FormGroup
  competencies!: CompetencyI[]
  gradesTypes!: GradesTypeGetI[]

  ngOnInit(): void {
    this.getGrades()
    this.getTypeGrades()
    this.getCompetencies()
    this.initializeBehaviors()
  }

  get behaviors() {
    return this.gradesForm.get('comportamientos') as FormArray;
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

  // Metodo para inicializar los cinco comportamientos de cada grado 
  initializeBehaviors() {
    for (let i = 0; i < 5; i++) {
      this.behaviors.push(
        this.fb.group({
          nombre: new FormControl('', Validators.required),
          probatorio: new FormControl(false),
          calificacion: new FormControl(0),
        })
      )
    }
  }

  openPropertyModal(elementList: any[], name: string, property: string) {
    this.dialog.open(ListPropertyViewComponent, { data: { elementList, name, property } })
  }

  // Metodo para obtener todos los grados 
  getGrades() {
    this.gradeService.getGrades()
      .subscribe((res: any) => {
        this.grades = res.data;
        console.log(this.grades);
      })
  }

  // Metodo para crear los grados
  postGrade() {
    this.gradeService.postGrade(this.gradesForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getGrades(), this.gradesForm)
      })
  }

  // Metodo para editar los grados
  putGrade() {
    this.gradeService.putGrade(this.gradesForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getGrades(), this.gradesForm)
      })
  }

  // Metodo para eliminar los grados y comportamientos
  async deleteGrade(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.gradeService.deleteGrade(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getGrades(), this.gradesForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(grade: GradesGetI) {
    this.gradesForm.patchValue({
      idGrado: grade.idGrado,
      idCompetencia: grade.idCompetencia,
      idTipoGrado: grade.tipoGradoObj.idTipoGrado,
      comportamientos: grade.comportamientosObj.map((behavior, index) => {

        let behaviorsGroup = this.behaviors.at(index)
        behaviorsGroup.reset(behavior)
      })
    })
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postGrade(), () => this.putGrade(), this.gradesForm.value.idGrado, this.gradesForm)
  }
}
