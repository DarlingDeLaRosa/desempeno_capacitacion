import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { CollaboratorServices } from '../colaboradores/services/colaboradores.service';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { asignationAgreementGetI, durationAgreementI, typeAgreementI, typeProcessesI } from './interfaces/asignacion-acuerdo.interface';
import { CollaboratorsGetI, LocationI, PersonI } from '../colaboradores/interfaces/colaboradores.interface';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { AsignationAgreementServices } from './services/asignacion-acuerdo.service';
import { Subscription, debounceTime } from 'rxjs';
import { systemInformationService } from '../../../../services/systemInformationService.service';

@Component({
  selector: 'app-asignacion-acuerdo',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './asignacion-acuerdo.component.html',
  styleUrl: './asignacion-acuerdo.component.css'
})
export class AsignacionAcuerdoComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    public appHelpers: HerlperService,
    private systemInformationSevice: systemInformationService,
    private asignationAgreementService: AsignationAgreementServices,
  ) {

    this.asignationAgreementForm = fb.group({
      idAsignacion: 0,
      idUnitOrg: new FormControl(''),
      nombre: new FormControl(''),
      usuario: new FormControl(''),
      idCargo: new FormControl(''),
      apellidos: new FormControl(''),
      idRecinto: new FormControl(''),
      periodoId: new FormControl('', Validators.required),
      idColaborador: new FormControl('', Validators.required),
      idTipoAcuerdo: new FormControl('', Validators.required),
      acuerdosDuracionId: new FormControl('', Validators.required),
      cedula: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    })
  }

  page: number = 1
  pagination!: PaginationI
  typeAgreements!: typeAgreementI[]
  asignationAgreementForm: FormGroup
  asignationsAgreement!: asignationAgreementGetI[]
  agreementsDurations!: durationAgreementI[]
  asignationCollaborators!: asignationAgreementGetI[]

  ngOnInit(): void {
    this.getTypeAgreement()
    this.getAsignationAgreement()
    this.getDurationAgreements()
  }

  // Metodo para obtener todos los colaboradores
  getAsignationAgreement() {
    this.asignationAgreementService.getAsignationAgreements(this.page, 10)
      .subscribe((res: any) => {
        this.asignationsAgreement = res.data;
        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
      })
  }

  // Metodo para obtener las duraciones de los acuerdos
  getDurationAgreements() {
    this.asignationAgreementService.getAgreementDurations()
      .subscribe((res: any) => {
        this.agreementsDurations = res.data
      })
  }

  getTypeAgreement() {
    this.asignationAgreementService.getTypeAgreement()
      .subscribe((res: any) => {
        this.typeAgreements = res.data;
      })
  }

  getAsignationAgreementsByDNI(event: any) {
    event.preventDefault();
    if (this.asignationAgreementForm.value.cedula.length < 7) return

    this.asignationAgreementService.getAsignationAgreementsByDNI(this.asignationAgreementForm.value.cedula)
      .subscribe((res: any) => {
        if (res.data){
          this.setValueToEdit(res.data)
          if (res.data.idAsignacion > 0) this.createSecondAsignation()
        }
      })
  }

  async createSecondAsignation() {
    let addNewAsignation: boolean = await this.snackBar.snackbarConfirmation('¿Desea agregar una nueva asignación de acuerdo? ', 'Aplicable a procesos de ascenso, promoción y cambios a carrera administrativa.')
    if (addNewAsignation) {
      this.asignationAgreementForm.patchValue({
        idAsignacion: 0,
        idTipoAcuerdo: 0,
        acuerdosDuracionId: 0,
      })
    }
  }

  postAsignationAgreement() {
    this.asignationAgreementService.postAsignationAgreement(this.asignationAgreementForm.value)
      .subscribe((res: any) => {

        this.appHelpers.handleResponse(res, () => this.getAsignationAgreement(), this.asignationAgreementForm)
      })
  }

  putAsignationAgreement() {
    this.asignationAgreementService.putAsignationAgreement(this.asignationAgreementForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getAsignationAgreement(), this.asignationAgreementForm)
      })
  }

  async deleteAsignationAgreement(idAsignation: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()
    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.asignationAgreementService.deleteAsignationAgreement(idAsignation)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getAsignationAgreement(), this.asignationAgreementForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(asignationAgreement: asignationAgreementGetI) {
    this.asignationAgreementForm.reset(asignationAgreement.colaborador)
    this.asignationAgreementForm.patchValue({
      idAsignacion: asignationAgreement.idAsignacion,
      idTipoAcuerdo: asignationAgreement.tipoAcuerdoObj.idTipoAcuerdo,
      acuerdosDuracionId: asignationAgreement.acuerdoDuracion?.id ?? null,
      idColaborador: asignationAgreement.colaborador.idPersona,
      idCargo: asignationAgreement.colaborador.cargo.nombre,
      idRecinto: asignationAgreement.colaborador.recinto.nombre,
      idUnitOrg: this.appHelpers.getUnitOrg(asignationAgreement.colaborador.division, asignationAgreement.colaborador.departamento, asignationAgreement.colaborador.direccion, asignationAgreement.colaborador.viceRectoria)?.nombre
    })
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {
    this.asignationAgreementForm.patchValue({ periodoId: this.systemInformationSevice.activePeriod().idPeriodo })
    this.appHelpers.saveChanges(() => this.postAsignationAgreement(), () => this.putAsignationAgreement(), this.asignationAgreementForm.value.idAsignacion, this.asignationAgreementForm)
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getAsignationAgreement()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getAsignationAgreement()
    }
  }

}
