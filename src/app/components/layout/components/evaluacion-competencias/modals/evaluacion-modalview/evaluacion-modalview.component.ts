import { Component, Inject } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { EvaluationCompetencyByIdI } from '../../interface/evaluacion-competencias.interface';

@Component({
  selector: 'app-evaluacion-modalview',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './evaluacion-modalview.component.html',
  styleUrl: './evaluacion-modalview.component.css'
})
export class EvaluacionModalviewComponent {

  constructor(
    private dialogRef: MatDialogRef<EvaluacionModalviewComponent>,
    @Inject(MAT_DIALOG_DATA) public evaluationData: { colaborador: CollaboratorsGetI, evaluacionCompetenciasDetalles: EvaluationCompetencyByIdI[]}
  ) { }

  competency: number = 0

  changeCompetency(competency: number): void {
    this.competency = competency;
  }

  closeModal(){
    this.dialogRef.close()
  }
}
