import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI } from '../../interfaces/acuerdo.interface';
import { MatDialog } from '@angular/material/dialog';
import { AcuerdoCalificacionComponent } from '../../modals/acuerdo-calificacion/acuerdo-calificacion.component';
import { GoalGetI } from '../../../mantenimiento/mantenimiento-options/metas/interface/metas.interface';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { GradesServices } from '../../../mantenimiento/mantenimiento-options/grados/services/grados.service';
import { GradesGetI, behaviorsI } from '../../../mantenimiento/mantenimiento-options/grados/interfaces/grados.interfaces';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EvaluationCompetencyTestI, evaluationAgreementCalificationI } from '../../../evaluacion-competencias/interface/evaluacion-competencias.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { LoaderBoxComponent } from '../../../../../../helpers/components/loader-box/loader-box.component';
import { ProtocolsServices } from '../../../mantenimiento/mantenimiento-options/protocolos/services/protocolo.service';
import { ProtocolI } from '../../../mantenimiento/mantenimiento-options/protocolos/interface/protocolos.interface';

@Component({
  selector: 'app-acuerdo-evaluacion',
  standalone: true,
  imports: [MaterialComponents, ClassImports, LoaderBoxComponent],
  templateUrl: './acuerdo-evaluacion.component.html',
  styleUrl: './acuerdo-evaluacion.component.css'
})
export class AcuerdoEvaluacionComponent implements OnInit {

  idpersona!: number;
  grade!: GradesGetI[]
  agreement!: AcuerdoI;
  totalValor: number = 0;
  isLoading: boolean = true;
  goalDetails: Array<any> = [];
  totalCalificacion: number = 0;
  collaborator!: CollaboratorsGetI;
  evaluationCompetencyForm: FormGroup
  protocol!: ProtocolI

  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    private SnackBar: SnackBars,
    private route: ActivatedRoute,
    private appHelpers: HerlperService,
    private gradeService: GradesServices,
    private intranetService: IntranetServices,
    private protocolService: ProtocolsServices,
    private agreementservice: agreementService,
    public systemInformationSevice: systemInformationService,
  ) {
    this.evaluationCompetencyForm = this.fb.group({
      id: new FormControl(0),
      acuerdoId: new FormControl(0),
      gradoId: new FormControl(0, Validators.required),
      evaluacionCompetenciasDetalles: this.fb.array([]),
      periodoId: new FormControl(0, Validators.required),
    })
  }

  ngOnInit(): void {
    this.idpersona = Number(this.route.snapshot.paramMap.get('id'));
    this.getAgreementByIdCollaborator();
    this.getProtocol()
  }

  //Metodo para obtener grado de los comportamientos probatorios
  getGrades() {
    this.gradeService.getGrades(1, 10, true)
      .subscribe((res: any) => {
        this.grade = res.data;
        this.setPostBehaviors(this.grade[0])
      })
  }

  getProtocol() {
    this.protocolService.getProtocolById(22)
      .subscribe((res: any) => {
        this.protocol = res.data;
      })
  }

  getBehaviorsTested() {
    this.agreementservice.getBehaviorTest()
      .subscribe((res: any) => {
        if (res.data.length > 1 && res.data[1].evaluacionesAcuerdosProbatoriosDetalles.length == 10) {
          this.evaluationCompetencyForm.patchValue({
            id: res.data[1].id
          })
          this.setPutBehaviors(res.data[1].evaluacionesAcuerdosProbatoriosDetalles)
        } else {
          this.getGrades()
        }
      })
  }

  setPostBehaviors(behaviors: EvaluationCompetencyTestI) {
    behaviors.comportamientosObj.map((behavior: behaviorsI) => {
      const behaviorGroup = this.fb.group({
        comportamientoId: behavior.idComportamiento,
        comportamientoNombre: behavior.nombre,
        calificacionComportamientoId: new FormControl('', Validators.required),
      });

      (this.evaluationCompetencyForm.get('evaluacionCompetenciasDetalles') as FormArray).push(behaviorGroup)
    })
  }

  setPutBehaviors(behaviors: evaluationAgreementCalificationI[]) {

    behaviors.map((behavior: evaluationAgreementCalificationI) => {
      const behaviorGroup = this.fb.group({
        comportamientoId: behavior.comportamiento.idComportamiento,
        comportamientoNombre: behavior.comportamiento.nombre,
        calificacionComportamientoId: behavior.calificacionComportamiento.id,
      });

      (this.evaluationCompetencyForm.get('evaluacionCompetenciasDetalles') as FormArray).push(behaviorGroup)
    })
  }

  //Metodo para obtener el acuerdo del colaborador
  getAgreementByIdCollaborator() {
    this.agreementservice.getAgreementByIdCollaborator(this.idpersona).subscribe((resp: any) => {
      this.agreement = resp.data;
      //hace un map a los detalles del acuerdo y lo agrega al arreglo del detalle que tenemos
      this.goalDetails = this.agreement.detalles.map((detalle: any) => {
        return {
          idMeta: detalle.idMeta,
          idAcuerdoDetalle: detalle.idAcuerdoDetalle,
          nombre: detalle.metaObj.nombre,
          nombreMedio: detalle.metaObj.medioVerificacionObj.nombre,
          valor: detalle.metaObj.valor,
          observacion: detalle.observaciones,
          calificacion: detalle.calificacion,
          enlaceDoc: detalle.documentosObj[0]?.enlace || null,
          nombreDoc: detalle.documentosObj[0]?.nombre || null
        };
      });
      this.isLoading = false;
      if (this.agreement.tipoAcuerdoObj.idTipoAcuerdo == 2) {
        this.getBehaviorsTested()
      }
      this.calcularTotalValor()
    })
  }

  postEvaluationBehaviorTest() {
    this.agreementservice.postBehaviorTest(this.evaluationCompetencyForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getAgreementByIdCollaborator(), this.evaluationCompetencyForm)
      })
  }

  putEvaluationBehaviorTest() {
    this.agreementservice.putBehaviorTest(this.evaluationCompetencyForm.value)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getAgreementByIdCollaborator(), this.evaluationCompetencyForm)
      })
  }

  calcularTotalValor() {
    this.totalValor = this.goalDetails.reduce((acc, item) => acc + (item.valor || 0), 0);
    this.totalCalificacion = this.goalDetails.reduce((acc, item) => acc + (item.calificacion || 0), 0);
  }

  openModalCalificacion(goal: GoalGetI): void {
    const dialog = this.dialog.open(AcuerdoCalificacionComponent, {
      width: '700px',
      data: {
        meta: goal,
        nombre: `${this.agreement.colaboradorObj.nombre} ${this.agreement.colaboradorObj.apellidos}`,
      },
    })

    dialog.afterClosed().subscribe(result => {
      this.getAgreementByIdCollaborator();
    });
  }

  saveChanges() {
    this.evaluationCompetencyForm.patchValue({
      acuerdoId: this.agreement.idAcuerdo,
      gradoId: this.grade[0].idGrado,
      periodoId: this.systemInformationSevice.activePeriod().idPeriodo,
    })


    this.appHelpers.saveChanges(() => this.postEvaluationBehaviorTest(), () => this.putEvaluationBehaviorTest(), this.evaluationCompetencyForm.value.id, this.evaluationCompetencyForm)
  }
}
