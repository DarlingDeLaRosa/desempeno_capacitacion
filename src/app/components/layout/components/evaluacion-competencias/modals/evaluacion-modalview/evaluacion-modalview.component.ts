import { Component, Inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { EvaluationCompetencyByIdI } from '../../interface/evaluacion-competencias.interface';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';

@Component({
  selector: 'app-evaluacion-modalview',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './evaluacion-modalview.component.html',
  styleUrl: './evaluacion-modalview.component.css'
})
export class EvaluacionModalviewComponent implements OnInit {
  
  public evaluationData!: EvaluationCompetencyByIdI[]

  constructor(
    private dialogRef: MatDialogRef<EvaluacionModalviewComponent>,
    private evaluationCompetencyService: EvaluationCompetencyServices,

    @Inject(MAT_DIALOG_DATA) public col: { colaborador: number }
  ) { }

  ngOnInit(): void {
    this.findCollaboratorEvaluation()
  }

  findCollaboratorEvaluation() {
    this.evaluationCompetencyService.getEvaluationCompetenciesByIdPerson(this.col.colaborador).subscribe((res: any) => {
      
      this.evaluationData = res.data.evaluacionCompetencia
    })
  }

  competency: number = 0

  changeCompetency(competency: number): void {
    this.competency = competency;
  }

  closeModal(){
    this.dialogRef.close()
  }
}
