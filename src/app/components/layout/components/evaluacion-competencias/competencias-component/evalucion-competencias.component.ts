import { Component } from '@angular/core';
import { MaterialComponents} from '../../../../../helpers/material.components';
import { MatDialog } from '@angular/material/dialog';
import { EvaluacionModalviewComponent } from '../modals/evaluacion-modalview/evaluacion-modalview.component';
import { ClassImports } from '../../../../../helpers/class.components';

@Component({
  selector: 'app-evalucion-competencias',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './evalucion-competencias.component.html',
  styleUrl: './evalucion-competencias.component.css'
})
export class EvalucionCompetenciasComponent {
  
  constructor(
    public dialog: MatDialog,
  ){}


  openModalviewEvaluation(){
    let dialogRef = this.dialog.open(EvaluacionModalviewComponent)// { data: indicador }
    dialogRef.afterClosed().subscribe(() => { })
  }
}
