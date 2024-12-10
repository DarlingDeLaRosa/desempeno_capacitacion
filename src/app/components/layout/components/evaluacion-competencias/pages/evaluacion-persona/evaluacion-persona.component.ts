import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { ActivatedRoute } from '@angular/router';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { CollaboratorServices } from '../../../mantenimiento/mantenimiento-options/colaboradores/services/colaboradores.service';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { AsignationCompetenciesServices } from '../../../mantenimiento/mantenimiento-options/asignacion-competencias/services/asignacion-competencias.service';
import { AsignationGetCompetencyI } from '../../../mantenimiento/mantenimiento-options/asignacion-competencias/interfaces/asignacion-competencias.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { behaviorsI } from '../../../mantenimiento/mantenimiento-options/grados/interfaces/grados.interfaces';
import { HerlperService } from '../../../../services/appHelpers.service';
import { EvaluationCompetencyGetI, EvaluationCompetencyI } from '../../interface/evaluacion-competencias.interface';

@Component({
  selector: 'app-evaluacion-persona',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './evaluacion-persona.component.html',
  styleUrl: './evaluacion-persona.component.css'
})
export class EvaluacionPersonaComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private appHelpers: HerlperService,
    private collaboratorService: CollaboratorServices,
    public systemInformationSevice: systemInformationService,
    public asignationCompetencySevice: AsignationCompetenciesServices,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {
    this.evaluationCompetencyForm = this.fb.group({
      id: new FormControl(0),
      evaluacionCompetenciasDetalles: this.fb.array([]),
      periodoId: new FormControl(0, Validators.required),
      idColaborador: new FormControl(0, Validators.required),
    })
  }

  collaboratorId!: number;
  person!: CollaboratorsGetI
  evaluationCompetencyForm: FormGroup
  evaluationCompetency: EvaluationCompetencyGetI[] = []

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.collaboratorId = params['colaboradorId'];
      this.findCollaboratorEvaluation()
    });
  }

  findCollaboratorEvaluation() {
    this.evaluationCompetencyService.getEvaluationCompetencies(this.collaboratorId).subscribe((res: any) => {
      this.getCollaborator()
    })
  }

  getCollaborator() {
    this.collaboratorService.getPersonByID(this.collaboratorId).subscribe((res: any) => {
      this.person = res.data
      this.getAsignationCompetencyByIdOcuGroup()
    })
  }

  getAsignationCompetencyByIdOcuGroup() {
    this.asignationCompetencySevice.getAsignationCompetencyByIdOcuGroup(this.person.grupoObj.idGrupo).subscribe((res: any) => {
      console.log(res);
      
      res.data.map((asignationCompetency: AsignationGetCompetencyI) => {

        const behaviorGroup = this.fb.array(
          asignationCompetency.gradoObj.comportamientosObj.map((behavior: behaviorsI) => {
            return this.fb.group({
              // id: 0,
              nombre: behavior.nombre,
              comportamientoId: behavior.idComportamiento,
              calificacionComportamientoId: ['', Validators.required],
            })
          })
        )

        const competency = this.fb.group({
          idGrado: asignationCompetency.gradoObj.idGrado,
          competenciaNombre: asignationCompetency.competenciaObj.nombre,
          competenciaDescripcion: asignationCompetency.competenciaObj.descripcion,
          comportamientos: behaviorGroup
        });

        (this.evaluationCompetencyForm.get('evaluacionCompetenciasDetalles') as FormArray).push(competency)
      })
    });
  }

  postEvaluationPerson(evaluation: EvaluationCompetencyI) {
    this.evaluationCompetencyService.postEvaluationCompetency(evaluation)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => ()=>{}, this.evaluationCompetencyForm)
      })
  }

  putEvaluationPerson() {
  }

  saveChanges() {
    let groupOfCompetency = this.evaluationCompetencyForm.value.evaluacionCompetenciasDetalles
    groupOfCompetency.map((evaluationCompetency: any) => {
      let evaluationCompetencyGroup: EvaluationCompetencyI = {
        id: 0,
        idColaborador: this.person.idPersona,
        periodoId: this.systemInformationSevice.activePeriod().idPeriodo,
        evaluacionCompetenciasDetalles: evaluationCompetency.comportamientos
      }

      this.appHelpers.saveChanges(() => this.postEvaluationPerson(evaluationCompetencyGroup), () => this.putEvaluationPerson(), this.evaluationCompetencyForm.value.id, this.evaluationCompetencyForm)
    })
    // this.evaluationCompetencyForm.get('evaluacionCompetenciasDetalles')?.reset()
  }
}