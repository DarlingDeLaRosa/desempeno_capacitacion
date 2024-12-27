import { EMPTY, of, switchMap } from 'rxjs';
import { Component, OnInit, effect } from '@angular/core';
import { SnackBars } from '../../../../services/snackBars.service';
import { PeriodI } from '../periodos/interfaces/periodo.interface';
import { CollaboratorServices } from './services/colaboradores.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { OcupationalGroupI } from '../../../../../../helpers/intranet/intranet.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { asignationAgreementI } from '../asignacion-acuerdo/interfaces/asignacion-acuerdo.interface';
import { AsignationAgreementServices } from '../asignacion-acuerdo/services/asignacion-acuerdo.service';
import { DepartmentI, DirectionI, DivisionI, PositionI, LocationI, ViceRectorate, RolI, PersonI, CollaboratorsGetI } from './interfaces/colaboradores.interface';

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './colaboradores.component.html',
  styleUrl: './colaboradores.component.css'
})
export class ColaboradoresComponent implements OnInit {

  data: any
  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private intranetService: IntranetServices,
    private collaboratorService: CollaboratorServices,
    private systemInformationService: systemInformationService,
    private asignationAgreementService: AsignationAgreementServices,
  ) {
    this.collaboratorForm = fb.group({
      idUsuario: null,
      cedula: new FormControl('', [Validators.required, Validators.maxLength(11)]),
      nombre: new FormControl('', Validators.required),
      sexo: new FormControl('', Validators.required),
      edad: new FormControl('', Validators.required),
      supervisor: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      idRol: new FormControl('', Validators.required),
      carreraAdministrativa: new FormControl(false, Validators.required),
      fechaIngreso: new FormControl('', Validators.required),
      idCargo: new FormControl(0, Validators.required),
      idGrupo: new FormControl(0, Validators.required),
      idDepartamento: new FormControl(null),
      idDireccion: new FormControl(null),
      idViceRectoria: new FormControl(null),
      idDivision: new FormControl(null),
      idRecinto: new FormControl('', Validators.required),
      idCargoDesempenia: new FormControl(null),
      idGrupoDesempenia: new FormControl(null),
      noResolucion: new FormControl(null),
      idEstado: new FormControl(1),
      idSupervisor: new FormControl('', Validators.required),
      idSistema: new FormControl('', Validators.required),
      diferentPosition: new FormControl(false)
    })
  }

  roles!: RolI[]
  page: number = 1
  vic: boolean = true
  dir: boolean = true
  dep: boolean = true
  div: boolean = true
  periodId: number = 0
  adminCareer!: boolean
  supervisors!: CollaboratorsGetI[]
  locations!: LocationI[]
  divisions!: DivisionI[]
  positions!: PositionI[]
  pagination!: PaginationI
  collaborators!: PersonI[]
  directions!: DirectionI[]
  departments!: DepartmentI[]
  collaboratorForm: FormGroup
  viceRectorates!: ViceRectorate[]
  ocupationalGroups!: OcupationalGroupI[]
  asignationAgreement!: asignationAgreementI

  ngOnInit(): void {
    this.getRoles()
    this.getDivision()
    this.getPositions()
    this.getLocations()
    this.getDirections()
    this.getDepartments()
    this.getCollaborators()
    this.getViceRectorates()
    this.getOcupationalGroup()
  }

  //Metodo para mostrar el nombre en el input
  displaySUPName(sup: CollaboratorsGetI): string {
    console.log(sup);

    return sup ? `${sup.nombre} ${sup.apellidos}` : '';
  }

  // Metodo para ocultar unidades organiativas dependiendo de la necesaria
  hidingUnitOrg() {
    const { idViceRectoria, idDireccion, idDepartamento, idDivision } = this.collaboratorForm.value

    if (idViceRectoria > 0) this.dir = this.dep = this.div = false

    else if (idDireccion > 0) this.vic = this.dep = this.div = false

    else if (idDepartamento > 0) this.vic = this.dir = this.div = false

    else if (idDivision > 0) this.vic = this.dep = this.dir = false

    else this.vic = this.dep = this.div = this.dir = true
  }

  // Metodo para determinar si el usuario es de carrera administrativa
  onCareerSelectionChange(value: boolean) {
    this.adminCareer = value
    this.updateValidators('noResolucion', this.adminCareer);
  }

  // Metodo para determinar si el usuario trabaja en un cargo o GO diferente
  onPositionSelectionChange(value: boolean) {

    this.collaboratorForm.patchValue({ diferentPosition: value })
    this.updateValidators('idCargoDesempenia', this.collaboratorForm.value.diferentPosition);
    this.updateValidators('idGrupoDesempenia', this.collaboratorForm.value.diferentPosition);
  }

  // Metodo para cambiar si los campos son requeridos o no
  updateValidators(controlName: string, isRequired: boolean | null) {
    const control = this.collaboratorForm.get(controlName);

    if (isRequired) control?.setValidators([Validators.required]);
    else control?.clearValidators();

    control?.updateValueAndValidity();
    control?.reset();
  }

  // Metodo para obtener todos los grupos ocupacionales
  getRoles() {
    this.intranetService.getRoles()
      .subscribe((res: any) => {
        this.roles = res.data;
      })
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

  // Metodo para obtener todos los recintos
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

  // Metodo para obtener todos los colaboradores
  getPersonaByDNI() {
    if (this.collaboratorForm.value.cedula.length < 7) return

    this.collaboratorService.getCollaboratorByDNI(this.collaboratorForm.value.cedula)
      .subscribe((res: any) => {
        if (res.data) this.setValueToEdit(res.data)
      })
  }

  getSupervisorByName() {
    if (this.collaboratorForm.value.idSupervisor.length < 3) {
      this.supervisors = []
    } else {
      this.collaboratorService.getPersonFilterByName(this.collaboratorForm.value.idSupervisor)
        .subscribe((res: any) => {
          this.supervisors = res.data
        })
    }
  }

  // Metodo para obtener todos los colaboradores
  getCollaborators() {
    this.collaboratorService.getCollaborators(this.page, 10)
      .subscribe((res: any) => {
        this.collaborators = res.data;
        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
      })
  }

  // Metodo para crear un colaborador y crear la asignacion de acuerdo de desempeno
  postCollaborator() {
    this.collaboratorService.postCollaborator(this.collaboratorForm.value)
      .pipe(
        switchMap((res: any) => {
          this.appHelpers.handleResponse(
            res,
            () => this.getCollaborators(),
            this.collaboratorForm
          );
          return of(res);
        }),
        switchMap((res: any) => {
          if (res.data) {
            let agreementType: number
            this.collaboratorForm.value.noResolucion != null ? agreementType = 2 : agreementType = 1

            this.asignationAgreement = {
              idAsignacion: 0,
              idColaborador: res.data.idPersona,
              idTipoAcuerdo: agreementType,
              periodoId: this.systemInformationService.activePeriod().idPeriodo,
              acuerdosDuracionId: agreementType,
            };


            return this.asignationAgreementService.postAsignationAgreement(this.asignationAgreement);
          }
          return EMPTY;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status) {
            setTimeout(() => {
              this.snackBar.snackbarStaySuccess(
                'Al usuario nuevo se le asignó un acuerdo de desempeño probatorio con una duración de 6 meses.',
                'Para realizar cambios navegue a la sección de asignación de acuerdos.'
              );
            }, 2000);
          }
        },
        (error: any) => {
          console.error('Error al realizar las operaciones:', error);
          this.snackBar.snackbarError('Ocurrió un error al momento de asignarle un acuerdo de desempeño. Por favor procesa a crearlo manualmente.');
        }
      );
  }

  // Metodo para editar un colaborador
  putCollaborator() {
    this.collaboratorService.putCollaborator(this.collaboratorForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCollaborators(), this.collaboratorForm)
      })
  }

  // Metodo para eliminar un colaborador
  async deleteCollaborator(idUsuario: number, idPersona: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)

      this.collaboratorService.deleteCollaborator(idUsuario)
        .pipe(
          switchMap((res: any) => {
            this.appHelpers.handleResponse(res, () => this.getCollaborators(), this.collaboratorForm)

            return of(res)
          }),
          switchMap((res: any) => {
            if (res.status) {
              return this.asignationAgreementService.deleteAsignationAgreementByIdCollaborador(idPersona)
            }
            return EMPTY
          })
        )
        .subscribe(
          (res: any) => {
            if (res.status) {
              setTimeout(() => {
                this.snackBar.snackbarStaySuccess(
                  'La asignación de acuerdo fue removida automaticamente.', ''
                );
              }, 2000);
            }
          }, (error) => {
            this.snackBar.snackbarError('Ocurrió un error al momento de eliminar la asignación de acuerdo del usuario eliminado. Por favor proceda a eliminarlo manualmente.');
          }
        )
    }
  }

  async clearForm() {
    await this.collaboratorForm.reset();
    this.hidingUnitOrg();
    this.onPositionSelectionChange(false)
  }

  // Metodo asignar valores y habilitar la edición de un registro
  async setValueToEdit(collaborator: PersonI) {

    this.snackBar.snackbarLouder(true)
    this.collaboratorService.getPersonByID(collaborator.persona.idSupervisor).subscribe((res: any) => {
      this.collaboratorForm.patchValue({ idSupervisor: res.data })
    })

    let diferentPosition = collaborator.persona.idCargoDesempenia ? true : false

    await this.onCareerSelectionChange(collaborator.persona.carreraAdministrativa)
    await this.onPositionSelectionChange(diferentPosition)

    this.collaboratorForm.reset(collaborator.persona)
    this.collaboratorForm.patchValue({
      idUsuario: collaborator.idUsuario,
      idRol: collaborator.rol.idRol,
      diferentPosition: diferentPosition
    })

    this.hidingUnitOrg()
    this.snackBar.snackbarLouder(false)
    console.log(this.collaboratorForm.value);
    
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    let idSup = this.collaboratorForm.value.idSupervisor
    this.collaboratorForm.patchValue({
      idSistema: this.systemInformationService.getSistema,
      idSupervisor: idSup.idPersona
    });

    if (this.collaboratorForm.value.idSupervisor == undefined) {
      this.snackBar.snackbarError('El supervisor es incorrecto, Asegurese de seleccionar uno de la barra de opciones.', 5000)
    }
    else {
      this.appHelpers.saveChanges(() => this.postCollaborator(), () => this.putCollaborator(), this.collaboratorForm.value.idUsuario, this.collaboratorForm)
    }
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getCollaborators()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getCollaborators()
    }
  }
}
