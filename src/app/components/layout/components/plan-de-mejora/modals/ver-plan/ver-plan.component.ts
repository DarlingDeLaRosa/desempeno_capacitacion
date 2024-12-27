import { CursosInscribirComponent } from './../../../cursos/modals/cursos-inscribir/cursos-inscribir.component';
import { Component,Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralI } from '../../../../../../helpers/intranet/intranet.interface';
import { PlanMejoraI } from '../../interfaces/plan-mejora.interface';
import { PlanMejoraService } from '../../services/plan-mejora.service';
import { provideRouter } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ver-plan',
  standalone: true,
  imports: [ClassImports,MaterialComponents],
  providers:[PlanMejoraService],
  templateUrl: './ver-plan.component.html',
  styleUrl: './ver-plan.component.css'
})
export class VerPlanComponent implements OnInit{

  puntosFuertes: GeneralI[] = [];
  areasMejora: GeneralI[] = [];

  categoriesRecommenList: Array<GeneralI> = []
  trimestresList: Array<GeneralI> = []
  recommendDetails: Array<any> = [];
  planMejoraObtenido!: PlanMejoraI;
  planMejoraForm: FormGroup;
  isLoading: boolean = true

  constructor(
    private planMejoraService:PlanMejoraService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CursosInscribirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

    this.planMejoraForm = fb.group({
      aspectos: new FormControl<string>(''),
      acciones: new FormControl<string>(''),
      comentarios: new FormControl<string>(''),
    })
  }


  ngOnInit(): void {
    this.getPlanMejoraByIdCollabo();
  }

  getPlanMejoraByIdCollabo() {
    //resetear los arreglos
    this.recommendDetails.length = 0
    this.areasMejora.length = 0
    this.puntosFuertes.length = 0

    this.planMejoraService.getPlanMejoraByIdCollabo(this.data.idCollaborator!).subscribe((resp: any) => {
      this.planMejoraObtenido = resp.data;
      this.isLoading = false

      if (resp.data != null) {
        this.planMejoraObtenido.recomendacionesFormativas.map((recomendacion) => {
          this.recommendDetails.push({
            idCategoriaRecomendacion: recomendacion.categoriaRecomendacion!.id,
            nombreCategoria: recomendacion.categoriaRecomendacion!.nombre,
            nombreTrimestre: recomendacion.comienzo!.nombre,
            que: {
                 nombre: recomendacion.que.nombre.trim()
            },
            como: recomendacion.como.trim(),
            porque: recomendacion.porque.trim(),
            comienzoId: recomendacion.comienzo!.id,
          });
        })

        this.planMejoraObtenido.areaMejoras.map((area) => {
          this.areasMejora.push({
            id: area.id,
            nombre: area.nombre
          })
        })

        this.planMejoraObtenido.puntosFuertes.map((punto) => {
          this.puntosFuertes.push({
            id: punto.id,
            nombre: punto.nombre
          })
        })

        this.planMejoraForm.get('comentarios')?.setValue(this.planMejoraObtenido.comentario);
        this.planMejoraForm.get('acciones')?.setValue(this.planMejoraObtenido.accionMotivacional);
        this.planMejoraForm.get('aspectos')?.setValue(this.planMejoraObtenido.aspectoDesempeno);

      }
    })

  }


  cerrar(): void {
    this.dialogRef.close();
  }
}
