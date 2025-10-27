import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../helpers/class.components';
import { MaterialComponents } from '../../../../helpers/material.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MinutaService } from '../../components/acuerdos/services/minuta.service';
import { MinutaAsistenciaTemplateGetI, MinutaCollaboratorTemplateI, MinutaGetI } from '../../components/acuerdos/interfaces/acuerdo.interface';
import { HerlperService } from '../../services/appHelpers.service';

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
    public appHelper: HerlperService,
    private dialogRef: MatDialogRef<MinutaEvaluacionCompetenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idMinuta: number, esSupInterino: boolean, typeEvaluation: number }
  ) {
  }

  ngOnInit(): void {
    if (this.data.idMinuta == 0) this.getMinuta()
    else this.getMinutaId()
  }

  getTrimestre(fechaFin: Date): string {
    const fecha = new Date(fechaFin);

    // Verifica si es una fecha válida
    if (isNaN(fecha.getTime())) { return 'Fecha inválida' }

    const mes = fecha.getMonth() + 1;

    if (mes >= 1 && mes <= 3) return 'Enero - Marzo';
    if (mes >= 4 && mes <= 6) return 'Abril - Junio';
    if (mes >= 7 && mes <= 9) return 'Julio - Septiembre';
    if (mes >= 10 && mes <= 12) return 'Octubre - Diciembre';

    return 'Mes inválido';
  }

  getMinuta() {
    let esi: boolean = false
    if (this.data.esSupInterino) { esi = true }

    let type = this.data.typeEvaluation == 1 ? 'acuerdo' : 'evaluacion'

    this.minutaservice.getMinutaEvaluacion(esi, type, 1, 500).subscribe((resp: any) => {
      this.minuta = resp.data[0]
      console.log(this.minuta);

      this.presentes.push({
        nombre: this.minuta.supervisorIntranet.nombre,
        apellido: this.minuta.supervisorIntranet.apellidos,
        cargo: this.minuta.supervisorIntranet.cargo.nombre,
        motivoAusencia: ''
      })

      resp.data[0].minutaAsistencia.map((participantes: MinutaAsistenciaTemplateGetI) => {
        if (participantes.ausente) {
          this.ausentes.push({
            nombre: participantes.colaboradorIntranet.nombre,
            apellido: participantes.colaboradorIntranet.apellidos,
            cargo: participantes.colaboradorIntranet.cargo.nombre,
            motivoAusencia: participantes.motivoAusencia != null ? participantes.motivoAusencia : ''
          })
        } else {
          this.presentes.push({
            nombre: participantes.colaboradorIntranet.nombre,
            apellido: participantes.colaboradorIntranet.apellidos,
            cargo: participantes.colaboradorIntranet.cargo.nombre,
            motivoAusencia: ''
          })
        }
      })
    })
  }

  getMinutaId() {
    this.minutaservice.getMinutaById(this.data.idMinuta).subscribe((resp: any) => {
      this.minuta = resp.data

      this.presentes.push({
        nombre: this.minuta.supervisorIntranet.nombre,
        apellido: this.minuta.supervisorIntranet.apellidos,
        cargo: this.minuta.supervisorIntranet.cargo.nombre,
        motivoAusencia: ''
      })

      resp.data.minutaAsistencia.map((participantes: MinutaAsistenciaTemplateGetI) => {
        if (participantes.ausente) {
          this.ausentes.push({
            nombre: participantes.colaboradorIntranet.nombre,
            apellido: participantes.colaboradorIntranet.apellidos,
            cargo: participantes.colaboradorIntranet.cargo.nombre,
            motivoAusencia: participantes.motivoAusencia != null ? participantes.motivoAusencia : ''
          })
        } else {
          this.presentes.push({
            nombre: participantes.colaboradorIntranet.nombre,
            apellido: participantes.colaboradorIntranet.apellidos,
            cargo: participantes.colaboradorIntranet.cargo.nombre,
            motivoAusencia: ''
          })
        }
      })
    })
  }

  closeModal() {
    this.dialogRef.close()
  }
}
