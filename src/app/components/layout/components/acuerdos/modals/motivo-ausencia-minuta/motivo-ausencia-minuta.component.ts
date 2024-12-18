import { Component,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';

@Component({
  selector: 'app-motivo-ausencia-minuta',
  standalone: true,
  imports: [ClassImports,MaterialComponents],
  templateUrl: './motivo-ausencia-minuta.component.html',
  styleUrl: './motivo-ausencia-minuta.component.css'
})
export class MotivoAusenciaMinutaComponent {
  constructor(

    public dialogRef: MatDialogRef<MotivoAusenciaMinutaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {idAcuerdo: number, fullName: string},
  ){}

  closeModal(): void {
    this.dialogRef.close();
  }
}
