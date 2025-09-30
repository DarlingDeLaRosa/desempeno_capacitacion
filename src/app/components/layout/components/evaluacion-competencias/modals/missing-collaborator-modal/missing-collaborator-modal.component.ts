import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { HerlperService } from '../../../../services/appHelpers.service';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';

@Component({
  selector: 'app-missing-collaborator-modal',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './missing-collaborator-modal.component.html',
  styleUrl: './missing-collaborator-modal.component.css'
})
export class MissingCollaboratorModalComponent implements OnInit{

  public missigCollaboratorData!: any[]
  pagination!: PaginationI
  page: number = 1
  recinto: string = '' 

  constructor(
    private dialogRef: MatDialogRef<MissingCollaboratorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appHelper: HerlperService,
    private evaluationCompetencyService: EvaluationCompetencyServices,
    ) { }
  
  ngOnInit(): void {
    this.missingCollaborator()
  }

  missingCollaborator() {
    this.evaluationCompetencyService.getMisssingColaborators(this.recinto).subscribe((res: any) => {
      this.missigCollaboratorData = res.data
      console.log(res);
    })
  }
  
  closeModal(){
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
