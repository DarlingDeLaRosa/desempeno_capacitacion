import { EMPTY, of, switchMap } from 'rxjs';
import { Component, OnInit, computed, effect } from '@angular/core';
import { SnackBars } from '../../../../services/snackBars.service';
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
import { DepartmentI, DirectionI, DivisionI, PositionI, LocationI, ViceRectorate, RolI, PersonI, CollaboratorsGetI, CollaboratorsI } from './interfaces/colaboradores.interface';

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
      // edad: new FormControl('', Validators.required),
      supervisor: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      idRol: new FormControl('', Validators.required),
      carreraAdministrativa: new FormControl(false, Validators.required),
      fechaIngreso: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      idGrupo: new FormControl(0, Validators.required),
      idCargo: new FormControl('', Validators.required),
      idViceRectoria: new FormControl(null),
      idDireccion: new FormControl(null),
      idDepartamento: new FormControl(null),
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

    this.filterForm = fb.group({
      filter: new FormControl('')
    })

    this.statusForm = fb.group({
      idPersona: new FormControl('', Validators.required),
      idEstado: new FormControl('', Validators.required)
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
  filterForm: FormGroup
  statusForm: FormGroup
  viceRectorates!: ViceRectorate[]
  ocupationalGroups!: OcupationalGroupI[]
  asignationAgreement!: asignationAgreementI

  ngOnInit(): void {
    this.getRoles()
    // this.getDivision()
    // this.getPositions()
    this.getLocations()
    // this.getDirections()
    // this.getDepartments()
    this.getCollaborators()
    // this.getViceRectorates()
    this.getOcupationalGroup()
  }

  //Metodo para mostrar el nombre en el input
  displaySUPName(sup: CollaboratorsGetI): string {
    return sup ? `${sup.nombre} ${sup.apellidos}` : '';
  }

  displayName(name: any): string {
    return name ? `${name.nombre}` : '';
  }

  readonly dateFormatString = computed(() => {
    return 'DD/MM/YYYY';
  });


  // Metodo para ocultar unidades organiativas dependiendo de la necesaria
  hidingUnitOrg() {
    const { idViceRectoria, idDireccion, idDepartamento, idDivision } = this.collaboratorForm.value

    if (idDivision && idDivision.id > 0) this.vic = this.dep = this.dir = false

    else if (idDepartamento && idDepartamento.idDepartamento > 0) this.vic = this.dir = this.div = false

    else if (idDireccion && idDireccion.idDireccion > 0) this.vic = this.dep = this.div = false

    else if (idViceRectoria && idViceRectoria.idViceRectoria > 0) this.dir = this.dep = this.div = false

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

  async changeStatus(collaborator: PersonI) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation('¿Estas seguro de cambiar el estado de este colaborador?', 'Una vez inactivo, no podrá realizar acciones en el sistema. Solo tendrá acceso de consulta.')
    const newState = collaborator.persona.estadoObj.idEstado === 1 ? 2 : 1;

    if (removeDecision) {
      this.statusForm.patchValue({ idPersona: collaborator.persona.idPersona, idEstado: newState })

      this.collaboratorService.putChangePersonStatus(this.statusForm.value).subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCollaborators(), this.statusForm)
      });
    }else{
      this.getCollaborators()
    }
  }

  // toggleActivatePerson(idPeriodo: number){
  //   this.periodService.putActivatePeriod(idPeriodo)
  //     .subscribe((res: any) => {
  //       this.appHelpers.handleResponse(res, () => this.getPeriods(), this.periodsForm)
  //     })
  // }

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
  // getPositions() {
  //   this.intranetService.getPositions()
  //     .subscribe((res: any) => {
  //       this.positions = res.data;
  //     })
  // }

  // Metodo para obtener todos los recintos
  getLocations() {
    this.intranetService.getLocations()
      .subscribe((res: any) => {
        this.locations = res.data;
      })
  }

  // Metodo para obtener todos los vicerrectorias
  // getViceRectorates() {
  //   this.intranetService.getViceRectorates()
  //     .subscribe((res: any) => {
  //       this.viceRectorates = res.data;
  //     })
  // }

  // Metodo para obtener todos los direcciones
  // getDirections() {
  //   this.intranetService.getDirections()
  //     .subscribe((res: any) => {
  //       this.directions = res.data;
  //     })
  // }

  // Metodo para obtener todos los departamentos
  // getDepartments() {
  //   this.intranetService.getDepartments()
  //     .subscribe((res: any) => {
  //       this.departments = res.data;
  //     })
  // }

  // Metodo para obtener todos los divisiones
  // getDivision() {
  //   this.intranetService.getDivisions()
  //     .subscribe((res: any) => {
  //       this.divisions = res.data;
  //     })
  // }

  // Metodo para obtener todos los colaboradores
  getPersonaByDNI() {
    if (this.collaboratorForm.value.cedula.length < 7) return

    this.collaboratorService.getCollaboratorByDNI(this.collaboratorForm.value.cedula)
      .subscribe((res: any) => {
        if (res.data.idUsuario > 0) {
          this.setValueToEdit(res.data)
        } else {
          this.setPersonValue(res.data.persona)
        }
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

  getCargoByName() {
    if (this.collaboratorForm.value.idCargo.length < 3) {
      this.positions = []
    } else {
      this.intranetService.getPositionsByName(this.collaboratorForm.value.idCargo)
        .subscribe((res: any) => {
          this.positions = res.data
        })
    }
  }

  getViceRectorateByName() {
    if (this.collaboratorForm.value.idViceRectoria.length < 3) {
      this.viceRectorates = []
    } else {
      this.intranetService.getViceRectoratesByName(this.collaboratorForm.value.idViceRectoria)
        .subscribe((res: any) => {
          this.viceRectorates = res.data
        })
    }
  }

  getDirectionByName() {
    if (this.collaboratorForm.value.idDireccion.length < 3) {
      this.directions = []
    } else {
      this.intranetService.getDirectionByName(this.collaboratorForm.value.idDireccion)
        .subscribe((res: any) => {
          this.directions = res.data
        })
    }
  }

  getDeparmentByName() {
    if (this.collaboratorForm.value.idDepartamento.length < 3) {
      this.departments = []
    } else {
      this.intranetService.getDepartmentByName(this.collaboratorForm.value.idDepartamento)
        .subscribe((res: any) => {
          this.departments = res.data
        })
    }
  }

  getDivisionByName() {
    if (this.collaboratorForm.value.idDivision.length < 3) {
      this.divisions = []
    } else {
      this.intranetService.getDivisionByName(this.collaboratorForm.value.idDivision)
        .subscribe((res: any) => {
          this.divisions = res.data
        })
    }
  }

  //Metodo para filtrar colaboradores 
  // Metodo para obtener todos los colaboradores
  getCollaborators() {
    this.collaboratorService.getCollaborators(this.page, 10, this.filterForm.value.filter)
      .subscribe((res: any) => {
        this.collaborators = res.data;
        let { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }

        if (currentPage > totalPage) { this.page = 1 }
      })
  }

  // Metodo para crear un colaborador y crear la asignacion de acuerdo de desempeno
  postCollaborator() {
    let agreementType: number
    let months: number

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
            if (this.collaboratorForm.value.noResolucion != null) {
              agreementType = 2
              months = 6
            } else {
              agreementType = 1
              months = 12
            }

            this.asignationAgreement = {
              idAsignacion: 0,
              idColaborador: res.data.idPersona,
              idTipoAcuerdo: agreementType,
              periodoId: this.systemInformationService.activePeriod().idPeriodo,
              acuerdosDuracionId: months,
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
                `Al usuario nuevo se le asignó un acuerdo de desempeño ${agreementType == 1 ? '' : 'probatorio'} ${agreementType == 1 ? 'con duración de 12 meses' : 'con duración de 6 meses'}.`,
                'Para realizar cambios navegue a la sección de asignación de acuerdos.'
              );
            }, 2000);
          }
        },
        (error: any) => {
          console.error('Error al realizar las operaciones:', error);
          this.snackBar.snackbarError('Ocurrió un error al momento de asignarle un acuerdo de desempeño. Por favor proceda a crearlo manualmente.');
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

  // Metodo para  asignar los valores de persona, antes de crear un usuario

  async setPersonValue(persona: CollaboratorsGetI) {
    this.collaboratorForm.patchValue({
      nombre: persona.nombre ? persona.nombre : '',
      sexo: persona.sexo ? persona.sexo : 0,
      apellidos: persona.apellidos ? persona.apellidos : '',
      usuario: persona.usuario ? persona.usuario : 0,
      idGrupo: persona.grupoObj ? persona.grupoObj.idGrupo : 0,
      fechaIngreso: persona.fechaIngreso ? persona.fechaIngreso : '',
      fechaNacimiento: persona.fechaNacimiento ? persona.fechaNacimiento : '',
      idCargo: persona.cargo && persona.cargo.nombre != "N/A" ? persona.cargo : 0,
      idViceRectoria: persona.viceRectoria && persona.viceRectoria.nombre != "NO ASIGNADO" && persona.viceRectoria.nombre != "N/A" ? persona.viceRectoria : 0,
      idDireccion: persona.direccion && persona.direccion.nombre != "NO ASIGNADO" && persona.direccion.nombre != "N/A" ? persona.direccion : 0,
      idDepartamento: persona.departamento && persona.departamento.nombre != "NO ASIGNADO" && persona.departamento.nombre != "N/A" ? persona.departamento : 0,
      idDivision: persona.division && persona.division.nombre != "NO ASIGNADO" && persona.division.nombre != "N/A" ? persona.division : 0,
      idRecinto: persona.recinto.idRecinto,
      idEstado: persona.idEstado,
    })
    await this.hidingUnitOrg()
  }

  // Metodo asignar valores y habilitar la edición de un registro
  async setValueToEdit(collaborator: PersonI) {

    this.snackBar.snackbarLouder(true)
    if (collaborator.persona.idSupervisor) {
      this.collaboratorService.getPersonByID(collaborator.persona.idSupervisor).subscribe((res: any) => {
        this.collaboratorForm.patchValue({ idSupervisor: res.data })
      })
    }

    let diferentPosition = collaborator.persona.idCargoDesempenia ? true : false

    await this.onCareerSelectionChange(collaborator.persona.carreraAdministrativa)
    await this.onPositionSelectionChange(diferentPosition)

    this.collaboratorForm.reset(collaborator.persona)
    this.collaboratorForm.patchValue({
      idCargoDesempenia: collaborator.persona.cargoDesempeniaObj,
      idUsuario: collaborator.idUsuario,
      idRol: collaborator.rol.idRol,
      diferentPosition: diferentPosition,
      idCargo: collaborator.persona.cargo,
      idViceRectoria: collaborator.persona.viceRectoria.nombre != "NO ASIGNADO" && collaborator.persona.viceRectoria.nombre != "N/A" ? collaborator.persona.viceRectoria : 0,
      idDireccion: collaborator.persona.direccion.nombre != "NO ASIGNADO" && collaborator.persona.direccion.nombre != "N/A" ? collaborator.persona.direccion : 0,
      idDepartamento: collaborator.persona.departamento.nombre != "NO ASIGNADO" && collaborator.persona.departamento.nombre != "N/A" ? collaborator.persona.departamento : 0,
      idDivision: collaborator.persona.division.nombre != "NO ASIGNADO" && collaborator.persona.division.nombre != "N/A" ? collaborator.persona.division : 0,
    })

    this.hidingUnitOrg()
    this.snackBar.snackbarLouder(false)
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    let idSup = this.collaboratorForm.value.idSupervisor
    let idPos = this.collaboratorForm.value.idCargo
    let idVic = this.collaboratorForm.value.idViceRectoria
    let idDir = this.collaboratorForm.value.idDireccion
    let idDep = this.collaboratorForm.value.idDepartamento
    let idDiv = this.collaboratorForm.value.idDivision

    // if (!this.collaboratorForm.valid) return

    this.collaboratorForm.patchValue({ idSistema: this.systemInformationService.getSistema })

    if (this.collaboratorForm.value.idSupervisor == undefined) {
      this.collaboratorForm.patchValue({ idSupervisor: idSup.idPersona });
      this.snackBar.snackbarError('El supervisor es incorrecto, Asegurese de seleccionar uno de la barra de opciones.', 5000)
    }
    else {
      if (this.collaboratorForm.value.idUsuario > 0 || this.collaboratorForm.value.idUsuario == null) { this.collaboratorForm.patchValue({ idSupervisor: idSup.idPersona }); }
      // if ( ) { this.collaboratorForm.patchValue({ idSupervisor: idSup.idPersona }); }

      this.collaboratorForm.patchValue({
        idCargo: idPos.idCargo,
        idViceRectoria: idVic ? idVic.idViceRectoria : null,
        idDireccion: idDir ? idDir.idDireccion : null,
        idDepartamento: idDep ? idDep.idDepartamento : null,
        idDivision: idDiv ? idDiv.id : null,
      });

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
