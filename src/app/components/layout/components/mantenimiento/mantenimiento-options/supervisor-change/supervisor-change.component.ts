import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { CollaboratorServices } from '../colaboradores/services/colaboradores.service';
import { CollaboratorsGetI, CollaboratorSummaryGetI, PersonI, PersonSystemI } from '../colaboradores/interfaces/colaboradores.interface';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';

@Component({
  selector: 'app-supervisor-change',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './supervisor-change.component.html',
  styleUrl: './supervisor-change.component.css'
})
export class SupervisorChangeComponent implements OnInit {

  supervisors!: CollaboratorsGetI[]
  colabs: PersonI[] = []
  newSup: any = ''
  oldSup: any = ''
  colab: string = ''

  hijos: PersonSystemI[] = []
  newHijos: PersonSystemI[] = []
  colChanges: PersonI[] = []

  typeOfChange: boolean = false

  constructor(
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private collaboratorService: CollaboratorServices,
  ) { }

  ngOnInit(): void {
    this.getSupervisorByName('')
  }

  onTypeChange() {
    this.hijos = this.colabs = this.newHijos = this.colChanges = []
    this.colab = this.oldSup = this.newSup = ''
  }

  displaySUPName(sup: CollaboratorsGetI): string {
    return sup ? `${sup.nombre} ${sup.apellidos}` : '';
  }

  displayCOLName(sup: PersonI): string {
    return sup ? `${sup.persona.nombre} ${sup.persona.apellidos}` : '';
  }

  getSupervisorByName(name: string) {
    this.collaboratorService.getSupFilterByName(name)
      .subscribe((res: any) => {
        this.supervisors = res.data
      })
  }

  getCollaborators() {
    this.collaboratorService.getCollaborators(1, 10, this.colab)
      .subscribe((res: any) => {
        this.colabs = res.data;
      })
  }

  postSupervisorChange(supervisors: { newSupervisorId: number, currentSupervisorId: number }) {
    this.collaboratorService.postChangeSup(supervisors)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.onTypeChange())
      })
  }

  postSupervisedChange(supervised: { newSupervisorId: number, supervisadosId: number[] }) {
    this.collaboratorService.postChangeSupervised(supervised)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.onTypeChange())
      })
  }

  selectSup(collaborator: CollaboratorsGetI) {
    this.hijos = collaborator.hijos
  }

  selectSecondSup(collaborator: CollaboratorsGetI) {
    this.newHijos = collaborator.hijos
  }

  selectCol(collaborator: PersonI) {
    this.colab = ''

    if (this.colChanges.length > 0 && this.colChanges.some((item) => item.idPersona == collaborator.idPersona)) {
      this.snackBar.snackbarError('Este usuario ya fue agregado');
      return
    }

    this.colChanges.push(collaborator)
  }

  removeFronColab(index: number) {
    this.colChanges.splice(index, 1);
  }

  async saveChanges() {
    if (this.typeOfChange) {

      if (this.oldSup == undefined || this.newSup == undefined) {
        this.snackBar.snackbarError('El supervisor actual y el nuevo deben ser seleccionados antes de continuar.');
        return
      }

      if (this.oldSup.idPersona == this.newSup.idPersona) {
        this.snackBar.snackbarError('El supervisor nuevo y actual no puede ser la misma persona.');
        return
      }

      if (this.hijos.length == 0 || this.hijos[0].nombre == undefined) {
        this.snackBar.snackbarError('No se encontraron supervisados para ser transferidos.');
        return
      }

      let removeDecision = await this.snackBar.snackbarConfirmation(`¿Está seguro de completar el cambio de supervisor?`, ` Esta acción actualizará la relación de supervisión.`)

      if (removeDecision) {
        this.appHelpers.saveFuctionChange(() => this.postSupervisorChange({ currentSupervisorId: this.oldSup.idPersona, newSupervisorId: this.newSup.idPersona }))
      }


    } else {
      let supervised: number[]

      if (this.colChanges.length == 0 || this.colChanges[0].persona.nombre == undefined) {
        this.snackBar.snackbarError('No se encontraron supervisados para ser transferidos.');
        return
      }

      if (this.newSup == undefined) {
        this.snackBar.snackbarError('El nuevo supervisor debe ser seleccionado antes de continuar.',);
        return
      }

      if (this.colChanges.some(item => item.idPersona) == this.newSup.idPersona) {
        this.snackBar.snackbarError('El supervisor seleccionado no puede estar bajo su propia supervisión. El nuevo supervisor forma parte del listado de supervisados.',);
        return
      }

      const existe = this.colChanges.some(col =>
        this.newHijos.some(hijo => hijo.idPersona === col.idPersona)
      );

      if (existe) {
        this.snackBar.snackbarError('La persona seleccionada ya se encuentra en el listado de supervisados.');
        return
      }

      let removeDecision = await this.snackBar.snackbarConfirmation(`¿Está seguro de que desea reasignar los colaboradores seleccionados al nuevo supervisor?`, ` Esta acción actualizará la relación de supervisión.`)

      if (removeDecision) {
        supervised = this.colChanges.map(item => item.idPersona)
        this.appHelpers.saveFuctionChange(() => this.postSupervisedChange({ supervisadosId: supervised, newSupervisorId: this.newSup.idPersona }))
      }
    }
  }
}
