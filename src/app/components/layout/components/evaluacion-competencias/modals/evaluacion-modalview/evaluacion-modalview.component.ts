import { Component, Inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { gradeCompetencyI, EvaluationBehaviorsI } from '../../interface/evaluacion-competencias.interface';

@Component({
  selector: 'app-evaluacion-modalview',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './evaluacion-modalview.component.html',
  styleUrl: './evaluacion-modalview.component.css'
})
export class EvaluacionModalviewComponent implements OnInit{

  constructor(
    private dialogRef: MatDialogRef<EvaluacionModalviewComponent>,
    @Inject(MAT_DIALOG_DATA) public evaluationData: { colaborador: CollaboratorsGetI, evaluacionCompetencia: EvaluationBehaviorsI[]}
  ) { }

  competency: number = 0

  ngOnInit(): void {
    console.log(this.evaluationData);
  }

  changeCompetency(competency: number){
    this.competency = competency
  }

  closeModal(){
    this.dialogRef.close()
  }
}
