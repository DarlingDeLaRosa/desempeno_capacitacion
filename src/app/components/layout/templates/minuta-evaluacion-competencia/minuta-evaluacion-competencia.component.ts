import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../helpers/class.components';
import { MaterialComponents } from '../../../../helpers/material.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MinutaService } from '../../components/acuerdos/services/minuta.service';
import { MinutaAsistenciaTemplateGetI, MinutaCollaboratorTemplateI, MinutaGetI } from '../../components/acuerdos/interfaces/acuerdo.interface';

@Component({
  selector: 'app-minuta-evaluacion-competencia',
  standalone: true,
  imports: [ClassImports, MaterialComponents],
  templateUrl: './minuta-evaluacion-competencia.component.html',
  styleUrl: './minuta-evaluacion-competencia.component.css'
})
export class MinutaEvaluacionCompetenciaComponent implements OnInit {

  minuta!: MinutaGetI;
  presentes: MinutaCollaboratorTemplateI[] = [];
  ausentes: MinutaCollaboratorTemplateI[] = [];

  constructor(
    private minutaservice: MinutaService,
    private dialogRef: MatDialogRef<MinutaEvaluacionCompetenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {idMinuta: number}
  ) {

  }

  ngOnInit(): void {
    if (this.data.idMinuta == 0) {
      this.getMinuta()
    }else{
      this.getMinutaId()
    }
  }

  getMinuta() {
    this.minutaservice.getMinuta('', "evaluacion", true, 1, 5).subscribe((resp: any) => {
      this.minuta = resp.data[0]
      
      this.presentes.push({
        nombre: this.minuta.supervisor.nombre,
        apellido: this.minuta.supervisor.apellidos,
        cargo: this.minuta.supervisor.cargo.nombre,
        motivoAusencia: ''
      })

      resp.data[0].minutaAsistencia.map((participantes: MinutaAsistenciaTemplateGetI) => {
        if (participantes.ausente) {
          this.ausentes.push({
            nombre: participantes.colaborador.nombre,
            apellido: participantes.colaborador.apellidos,
            cargo: participantes.colaborador.cargo.nombre,
            motivoAusencia: participantes.motivoAusencia != null ? participantes.motivoAusencia : ''
          })
        }else{
          this.presentes.push({
            nombre: participantes.colaborador.nombre,
            apellido: participantes.colaborador.apellidos,
            cargo: participantes.colaborador.cargo.nombre,
            motivoAusencia: ''
          }) 
        }
      })
    })
  }

  getMinutaId(){
    this.minutaservice.getMinutaById(this.data.idMinuta).subscribe((resp: any) => {
      this.minuta = resp.data
      
      this.presentes.push({
        nombre: this.minuta.supervisor.nombre,
        apellido: this.minuta.supervisor.apellidos,
        cargo: this.minuta.supervisor.cargo.nombre,
        motivoAusencia: ''
      })

      resp.data.minutaAsistencia.map((participantes: MinutaAsistenciaTemplateGetI) => {
        if (participantes.ausente) {
          this.ausentes.push({
            nombre: participantes.colaborador.nombre,
            apellido: participantes.colaborador.apellidos,
            cargo: participantes.colaborador.cargo.nombre,
            motivoAusencia: participantes.motivoAusencia != null ? participantes.motivoAusencia : ''
          })
        }else{
          this.presentes.push({
            nombre: participantes.colaborador.nombre,
            apellido: participantes.colaborador.apellidos,
            cargo: participantes.colaborador.cargo.nombre,
            motivoAusencia: ''
          }) 
        }
      })
    })
  }

  closeModal(){
    this.dialogRef.close()
  }
}
