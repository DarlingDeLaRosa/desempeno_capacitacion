import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationCompetencyServices } from '../../services/evaluacion-competencia.service';
import { CollaboratorServices } from '../../../mantenimiento/mantenimiento-options/colaboradores/services/colaboradores.service';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { AsignationCompetenciesServices } from '../../../mantenimiento/mantenimiento-options/asignacion-competencias/services/asignacion-competencias.service';
import { AsignationGetCompetencyI } from '../../../mantenimiento/mantenimiento-options/asignacion-competencias/interfaces/asignacion-competencias.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { behaviorsI } from '../../../mantenimiento/mantenimiento-options/grados/interfaces/grados.interfaces';
import { HerlperService } from '../../../../services/appHelpers.service';
import { EvaluationBehaviorsI, EvaluationCompetencyByIdI, EvaluationCompetencyGetI, EvaluationCompetencyI, getEvaluationCompetencyByIdI } from '../../interface/evaluacion-competencias.interface';
import { LoaderBoxComponent } from '../../../../../../helpers/components/loader-box/loader-box.component';
import { SnackBars } from '../../../../services/snackBars.service';

@Component({
  selector: 'app-evaluacion-persona',
  standalone: true,
  imports: [MaterialComponents, ClassImports, LoaderBoxComponent],
  templateUrl: './evaluacion-persona.component.html',
  styleUrl: './evaluacion-persona.component.css'
})
export class EvaluacionPersonaComponent implements OnInit {

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private route: ActivatedRoute,
    private appHelpers: HerlperService,
    private collaboratorService: CollaboratorServices,
    public systemInformationSevice: systemInformationService,
    public asignationCompetencySevice: AsignationCompetenciesServices,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {
    this.evaluationCompetencyForm = this.fb.group({
      id: new FormControl(0),
      gradoId: new FormControl(0, Validators.required),
      evaluacionCompetenciasDetalles: this.fb.array([]),
      periodoId: new FormControl(0, Validators.required),
      idColaborador: new FormControl(0, Validators.required),
    })
  }

  collaboratorId!: number;
  saved: boolean = false
  person!: CollaboratorsGetI
  loading: boolean = true
  evaluationCompetencyForm: FormGroup
  evaluationCompetency: EvaluationCompetencyGetI[] = []

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.collaboratorId = params['colaboradorId'];
      this.findCollaboratorEvaluation()
    });
  }

  findCollaboratorEvaluation() {
    this.evaluationCompetencyService.getEvaluationCompetenciesByIdPerson(this.collaboratorId).subscribe((res: any) => {
      this.person = res.data.colaborador
      if (res.data.evaluacionCompetencia.length == 0) {
        this.getAsignationCompetencyByIdOcuGroup()
      } else {
        this.setDataEditEvaluationCompetency(res.data)
      }
    })
  }

  getAsignationCompetencyByIdOcuGroup() {
    this.asignationCompetencySevice.getAsignationCompetencyByIdOcuGroup(this.person.grupoObj.idGrupo).subscribe((res: any) => {

      res.data.map((asignationCompetency: AsignationGetCompetencyI) => {
        const behaviorGroup = this.fb.array(
          asignationCompetency.gradoObj.comportamientosObj.map((behavior: behaviorsI) => {
            return this.fb.group({
              nombre: behavior.nombre,
              comportamientoId: behavior.idComportamiento,
              calificacionComportamientoId: ['', Validators.required],
            })
          })
        )

        const competency = this.fb.group({
          idGrado: asignationCompetency.gradoObj.idGrado,
          grado: asignationCompetency.gradoObj.tipoGradoObj.nombre,
          competenciaNombre: asignationCompetency.competenciaObj.nombre,
          competenciaDescripcion: asignationCompetency.competenciaObj.descripcion,
          comportamientos: behaviorGroup
        });

        (this.evaluationCompetencyForm.get('evaluacionCompetenciasDetalles') as FormArray).push(competency)
      })
      this.loading = false
    });
  }

  postEvaluationPerson(evaluation: EvaluationCompetencyI[]) {
    this.evaluationCompetencyService.postEvaluationCompetency(evaluation)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => { this.router.navigate(['layout/evaluacion-competencias']) }, this.evaluationCompetencyForm)
      })
  }

  putEvaluationPerson(evaluation: EvaluationCompetencyI[]) {
    this.evaluationCompetencyService.putEvaluationCompetency(evaluation)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => { this.router.navigate(['layout/evaluacion-competencias']) }, this.evaluationCompetencyForm)
      })
  }

  setDataEditEvaluationCompetency(evaluations: getEvaluationCompetencyByIdI) {
    evaluations.evaluacionCompetencia.map((asignationCompetency: EvaluationCompetencyByIdI) => {
      const behaviorGroup = this.fb.array(
        asignationCompetency.evaluacionCompetenciasDetalles.map((behavior: EvaluationBehaviorsI) => {
          return this.fb.group({
            id: behavior.id,
            nombre: behavior.comportamiento.nombre,
            comportamientoId: behavior.comportamiento.idComportamiento,
            calificacionComportamientoId: [behavior.calificacionComportamiento.id, Validators.required],
          })
        })
      )

      const competency = this.fb.group({
        id: asignationCompetency.id,
        grado: asignationCompetency.grado.tipoGrado.nombre,
        idGrado: asignationCompetency.grado.id,
        competenciaNombre: asignationCompetency.grado.competencia.nombre,
        competenciaDescripcion: asignationCompetency.grado.competencia.descripcion,
        comportamientos: behaviorGroup
      });

      (this.evaluationCompetencyForm.get('evaluacionCompetenciasDetalles') as FormArray).push(competency)
      this.loading = false
    })
  }

  async saveChanges() {
    let groupOfCompetency = this.evaluationCompetencyForm.value.evaluacionCompetenciasDetalles

    const hasInvalidScore = groupOfCompetency.some((evaluationCompetency: any) =>
      evaluationCompetency.comportamientos.some((comportamiento: any) => {
        const value = comportamiento.calificacionComportamientoId;
        return value === null || value === undefined || value === '' || isNaN(Number(value));
      })
    );

    if (hasInvalidScore) {
      this.snackBar.snackbarError('Completa los campos requeridos para realizar la acción.');
      return;

    } else {

      let evaluationGroup: EvaluationCompetencyI[] = []

      await groupOfCompetency.map((evaluationCompetency: any) => {
        evaluationGroup.push({
          id: evaluationCompetency.id,
          gradoId: evaluationCompetency.idGrado,
          idColaborador: this.person.idPersona,
          periodoId: this.systemInformationSevice.activePeriod().idPeriodo,
          evaluacionCompetenciasDetalles: evaluationCompetency.comportamientos
        })
      })

      this.appHelpers.saveChanges(() => this.postEvaluationPerson(evaluationGroup), () => this.putEvaluationPerson(evaluationGroup), evaluationGroup[1].id, this.evaluationCompetencyForm)

    }
  }
}
