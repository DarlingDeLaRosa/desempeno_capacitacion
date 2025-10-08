import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { HerlperService } from '../../../../services/appHelpers.service';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';

@Component({
  selector: 'app-missing-collaborator-modal',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './missing-collaborator-modal.component.html',
  styleUrl: './missing-collaborator-modal.component.css'
})
export class MissingCollaboratorModalComponent implements OnInit {

  public missigCollaboratorData!: any[]
  pagination!: PaginationI
  page: number = 1
  userLogged!: loggedUserI
  recinto: string = ''

  constructor(
    private dialogRef: MatDialogRef<MissingCollaboratorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appHelper: HerlperService,
    public systemInformation: systemInformationService,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {
    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.missingCollaborator()
  }

  filterByRecinto() {
    this.page = 1
    this.missingCollaborator()
  }

  missingCollaborator() {
    this.evaluationCompetencyService.getMisssingColaborators(this.page, this.recinto).subscribe((res: any) => {
      this.missigCollaboratorData = res.data

      let { currentPage, totalItem, totalPage } = res
      this.pagination = { currentPage, totalItem, totalPage }
    })
  }

  closeModal() {
    this.dialogRef.close()
  }

  //Metodo para llamar a la siguiente pagina 
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.missingCollaborator()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.missingCollaborator()
    }
  }
}
