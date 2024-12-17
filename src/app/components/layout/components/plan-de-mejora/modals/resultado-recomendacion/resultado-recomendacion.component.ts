import { MatDialogRef,MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { Component,Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';

@Component({
  selector: 'app-resultado-recomendacion',
  standalone: true,
  imports: [ClassImports, MaterialComponents],
  templateUrl: './resultado-recomendacion.component.html',
  styleUrl: './resultado-recomendacion.component.css'
})
export class ResultadoRecomendacionComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<ResultadoRecomendacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
  ngOnInit(): void {
    console.log(this.data);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
