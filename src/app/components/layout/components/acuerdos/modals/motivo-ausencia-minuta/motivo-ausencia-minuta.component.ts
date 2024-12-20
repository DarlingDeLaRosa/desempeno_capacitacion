import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { MinutaAsistenciaI } from '../../interfaces/acuerdo.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-motivo-ausencia-minuta',
  standalone: true,
  imports: [ClassImports,MaterialComponents],
  templateUrl: './motivo-ausencia-minuta.component.html',
  styleUrl: './motivo-ausencia-minuta.component.css'
})
export class MotivoAusenciaMinutaComponent implements OnInit {

  idColaborador!: number;
  ausente: boolean = false;
  motivoAusencia: string | null = null;

  formMotivo!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MotivoAusenciaMinutaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: MinutaAsistenciaI
  ){
    this.formMotivo = fb.group({
      motivoAusencia: new FormControl<string>(''),
    })

    this.idColaborador = data.idColaborador;
    this.ausente = data.ausente;
    this.motivoAusencia = data.motivoAusencia;
  }


  ngOnInit(): void {
    if (this.motivoAusencia?.length != 0) {
      this.formMotivo.patchValue({
        motivoAusencia:  this.motivoAusencia
      });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    if ( this.formMotivo.get('motivoAusencia')?.value != null && this.formMotivo.get('motivoAusencia')?.value != '') {
      this.ausente = true
    }else{
      this.ausente = false
    }
    // Enviar los datos actualizados al componente principal
    this.dialogRef.close({
      idColaborador: this.data.idColaborador,
      ausente: this.ausente,
      motivoAusencia:   this.formMotivo.get('motivoAusencia')?.value,
    });
  }
}
