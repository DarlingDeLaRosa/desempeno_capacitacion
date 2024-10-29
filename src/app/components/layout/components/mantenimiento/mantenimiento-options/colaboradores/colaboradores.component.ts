import { Component, OnInit } from '@angular/core';
import { SnackBars } from '../../../../services/snackBars.service';
import { CollaboratorServices } from './services/colaboradores.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { OcupationalGroupI } from '../../../../../../helpers/intranet/intranet.interface';
import { CollaboratorsGetI, DepartmentI, DirectionI, DivisionI, PositionI, LocationI, viceRectorate } from './interfaces/colaboradores.interface';

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [IntranetServices, CollaboratorServices],
  templateUrl: './colaboradores.component.html',
  styleUrl: './colaboradores.component.css'
})
export class ColaboradoresComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private intranetService: IntranetServices,
    private collaboratorService: CollaboratorServices,
  ) {

    this.collaboratorForm = fb.group({
      idPersona: 0,
      nombre: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      idCargo: new FormControl(0, Validators.required),
      idGrupo: new FormControl(0, Validators.required),
      idDepartamento: new FormControl(''),
      idDireccion: new FormControl(''),
      idViceRectoria: new FormControl(''),
      idDivision: new FormControl(''),
      idRecinto: new FormControl('', Validators.required),
      idCargoDesempenia: new FormControl(''),
      idGrupoDesempenia: new FormControl(''),
    })
  }

  vic: boolean = true
  dir: boolean = true
  dep: boolean = true
  div: boolean = true
  locations!: LocationI[]
  divisions!: DivisionI[]
  positions!: PositionI[]
  directions!: DirectionI[]
  diferentPosition!: boolean
  departments!: DepartmentI[]
  collaboratorForm: FormGroup
  viceRectorates!: viceRectorate[]
  collaborators!: CollaboratorsGetI[]
  ocupationalGroups!: OcupationalGroupI[]
  
  ngOnInit(): void {
    this.getDivision()
    this.getPositions()
    this.getLocations()
    this.getDirections()
    this.getDepartments()
    this.getCollaborators()
    this.getViceRectorates()
    this.getOcupationalGroup()
  }

  // Metodo para ocultar unidades organiativas dependiendo de la necesaria
  hidingUnitOrg() {
    const { idViceRectoria, idDireccion, idDepartamento, idDivision } = this.collaboratorForm.value

    if (idViceRectoria > 0) this.dir = this.dep = this.div =  false
    
    else if (idDireccion > 0) this.vic = this.dep = this.div = false
    
    else if (idDepartamento > 0) this.vic = this.dir = this.div = false
    
    else if (idDivision > 0) this.vic = this.dep = this.dir = false
    
    else this.vic = this.dep = this.div = this.dir = true
  }

  // Metodo para determinar si el usuario trabaja en un cargo o GO diferente
  onSelectionChange(value: boolean) {
    this.diferentPosition = value

    this.updateValidators('idCargoDesempenia', this.diferentPosition);
    this.updateValidators('idGrupoDesempenia', this.diferentPosition);
  }

  // Metodo para cambiar si los campos son requeridos o no
  updateValidators(controlName: string, isRequired: boolean) {
    const control = this.collaboratorForm.get(controlName);

    if (isRequired) control?.setValidators([Validators.required]);
    else control?.clearValidators();

    control?.updateValueAndValidity();
    control?.reset();
  }

  // Metodo para obtener todos los grupos ocupacionales
  getOcupationalGroup() {
    this.intranetService.getOcupationalGroup()
      .subscribe((res: any) => {
        this.ocupationalGroups = res.data;
      })
  }

  // Metodo para obtener todos los cargos
  getPositions() {
    this.intranetService.getPositions()
      .subscribe((res: any) => {
        this.positions = res.data;
      })
  }

  // Metodo para obtener todos los cargos
  getLocations() {
    this.intranetService.getLocations()
      .subscribe((res: any) => {
        this.locations = res.data;
      })
  }

  // Metodo para obtener todos los vicerrectorias
  getViceRectorates() {
    this.intranetService.getViceRectorates()
      .subscribe((res: any) => {
        this.viceRectorates = res.data;
      })
  }

  // Metodo para obtener todos los direcciones
  getDirections() {
    this.intranetService.getDirections()
      .subscribe((res: any) => {
        this.directions = res.data;
      })
  }

  // Metodo para obtener todos los departamentos
  getDepartments() {
    this.intranetService.getDepartments()
      .subscribe((res: any) => {
        this.departments = res.data;
      })
  }

  // Metodo para obtener todos los divisiones
  getDivision() {
    this.intranetService.getDivisions()
      .subscribe((res: any) => {
        this.divisions = res.data;
      })
  }

  // Metodo para obtener todos los divisiones
  getCollaborators() {
    this.collaboratorService.getCollaborators()
      .subscribe((res: any) => {
        this.collaborators = res.data;
      })
  }

  // Metodo para crear un colaborador
  postCollaborator() {
    this.collaboratorService.postCollaborator(this.collaboratorForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCollaborators(), this.collaboratorForm)
      })
  }

  // Metodo para editar un colaborador
  putCollaborator() {
    this.collaboratorService.putCollaborator(this.collaboratorForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCollaborators(), this.collaboratorForm)
      })
  }

  // Metodo para eliminar un colaborador 
  async deleteCollaborator(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.collaboratorService.deleteCollaborator(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getCollaborators(), this.collaboratorForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(collaborator: CollaboratorsGetI) {
    this.collaboratorForm.reset(collaborator)
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postCollaborator(), () => this.putCollaborator(), this.collaboratorForm.value.idAsignacion, this.collaboratorForm)
  }
}
