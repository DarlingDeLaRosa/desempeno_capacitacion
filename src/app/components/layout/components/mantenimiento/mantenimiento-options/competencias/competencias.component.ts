import { Component, OnInit } from '@angular/core';
import { SnackBars } from '../../../../services/snackBars.service';
import { CompetencyI } from './interfaces/competencias.interfaces';
import { HerlperService } from '../../../../services/appHelpers.service';
import { CompetencyServices } from './services/competencias.service';
import { MaterialComponents} from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-competencias',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [CompetencyServices],
  templateUrl: './competencias.component.html',
  styleUrl: './competencias.component.css'
})
export class CompetenciasComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private competencyService: CompetencyServices,
  ) {
    this.competencyEvaluationForm = fb.group({
      idCompetencia: 0,
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required)
    })
  }

  competencyEvaluationForm: FormGroup;
  competencies!: CompetencyI[]  

  ngOnInit(): void { 
    this.getCompetencies()    
  }

  // Metodo para obtener todas las competencias
  getCompetencies() {
    this.competencyService.getCompetency()
      .subscribe((res: any) => {
        this.competencies = res.data;
      })
  }

  // Metodo para crear las competencias
  postCompetency() {
    this.competencyService.postCompetency(this.competencyEvaluationForm.value)
      .subscribe((res: any) => { 
        this.appHelpers.handleResponse(res, () => this.getCompetencies(), this.competencyEvaluationForm) })
  }

  // Metodo para editar las competencias
  putCompetency() {
    this.competencyService.putCompetency(this.competencyEvaluationForm.value)
      .subscribe((res: any) => { 
        this.appHelpers.handleResponse(res, () => this.getCompetencies(), this.competencyEvaluationForm) })
  }

  // Metodo para eliminar las competencias y confirmación de la misma
  async deleteCompetency(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmationDelete()
    
    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.competencyService.deleteCompetency(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getCompetencies(), this.competencyEvaluationForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(competency: any) {
    this.competencyEvaluationForm.reset(competency)
  }

  // Metodo para manejar las funciones de editar y crear con el mismo onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postCompetency(), () => this.putCompetency(), this.competencyEvaluationForm.value.idCompetencia ,this.competencyEvaluationForm)
  }
}
