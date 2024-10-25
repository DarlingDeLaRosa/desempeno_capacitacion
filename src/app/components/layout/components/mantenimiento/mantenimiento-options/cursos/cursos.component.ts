import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { CoursesServices } from './services/cursos.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { CourseGetI, ModalityI, StateI } from './interfaces/cursos.interface';
import { SuppliersI } from '../../../../../../helpers/intranet/intranet.interface';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [CoursesServices, IntranetServices],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosMantenimientoComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private coursesService: CoursesServices,
    private intranetService: IntranetServices,
  ) {

    this.coursesForm = fb.group({
      idCurso: 0,
      nombre: new FormControl('', Validators.required),
      suplidor: new FormControl('', Validators.required),
      cuposDisponibles: new FormControl(0),
      interno: new FormControl(true, Validators.required),
      rnc: new FormControl(''),
      fechaInicioInscripcion: new FormControl('', Validators.required),
      fechaFinInscripcion: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      idModalidad: new FormControl(''),
      costoPersona: new FormControl(0),
      costoTotal: new FormControl(0),
      idEstado: new FormControl(null),
      link: new FormControl(''),
    })
  }

  coursesForm: FormGroup
  states!: StateI[]
  courses!: CourseGetI[]
  modalities!: ModalityI[]
  suppliersRs!: SuppliersI[]
  suppliersRnc!: SuppliersI[]

  ngOnInit(): void {
    this.getState()
    this.getCourses()
    this.getModality()

    this.coursesForm.get('suplidor')?.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe(() => {
        this.getSuppliersByRs();
      });
  }

  displayRsName(rs: SuppliersI): string {
    return rs ? rs.razonSocial : '';
  }

  // Metodo para obtener todas los cursos
  getSuppliersByRnc() {
    this.intranetService.findProveedorByRNC(this.coursesForm.value.rnc)
      .subscribe((res: any) => {
        this.suppliersRnc = res.data
        if (this.suppliersRnc) {
          this.coursesForm.patchValue({ suplidor: this.suppliersRnc[0].razonSocial })
        } else {
          this.coursesForm.get('rnc')?.reset()
          this.coursesForm.get('suplidor')?.reset()
          this.snackBar.snackbarError('El RNC no fue encontrado.')
        }
      })
  }

  // Metodo para obtener todos los proveedores por nombre
  getSuppliersByRs() {
    const suplidorValue = this.coursesForm.value.suplidor;

    if (suplidorValue && suplidorValue.length >= 3) {
      this.intranetService.findProveedorByRS(suplidorValue)
        .subscribe((res: any) => {
          this.suppliersRs = res.data;
        });
    } else {
      this.suppliersRs = [];
    }
  }

  // Metodo para completar el campo de RNC en el formulario
  setValueRs(suplier: SuppliersI) {
    this.coursesForm.patchValue({ rnc: suplier.rnc })
  }

  // Metodo para obtener todas los cursos
  getCourses() {
    this.coursesService.getCourses()
      .subscribe((res: any) => {
        this.courses = res.data;
        console.log(this.courses);
      })
  }

  // Metodo para obtener todas las modalidades de cursos
  getModality() {
    this.coursesService.getModality()
      .subscribe((res: any) => {
        this.modalities = res.data;
      })
  }

  // Metodo para obtener todos los estados de los cursos
  getState() {
    this.coursesService.getStates()
      .subscribe((res: any) => {
        this.states = res.data;
      })
  }

  // Metodo para crear un curso
  postCourse() {
    this.coursesService.postCourse(this.coursesForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCourses(), this.coursesForm)
      })
  }

  // Metodo para editar un curso
  putCourse() {
    this.coursesService.putCourse(this.coursesForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCourses(), this.coursesForm)
      })
  }

  // Metodo para eliminar un curso 
  async deleteCourse(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.coursesService.deleteCourse(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getCourses(), this.coursesForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(course: CourseGetI) {
    this.snackBar.snackbarLouder(true)
    this.intranetService.findProveedorByRNC(course.rnc).subscribe((res: any) => {
      this.snackBar.snackbarLouder(false)
      this.coursesForm.reset(course)
      this.coursesForm.patchValue({ suplidor: res.data })
    })
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.coursesForm.value.suplidor = this.coursesForm.value.suplidor.razonSocial
    if (this.coursesForm.value.suplidor == undefined){
      this.snackBar.snackbarError('La razón social es incorrecta, asegurese de seleccionar una de la barra de opciones.', 5000)
    }
    else {
      this.appHelpers.saveChanges(() => this.postCourse(), () => this.putCourse(), this.coursesForm.value.idCurso, this.coursesForm)
    }
  }
}