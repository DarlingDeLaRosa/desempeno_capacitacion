import { Component, OnInit, Input, input } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { materialize, filter } from 'rxjs';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { AcuerdoI, MinutaAsistenciaI, MinutaI } from '../../interfaces/acuerdo.interface';
import { agreementService } from '../../services/acuerdo.service';
import { MatDialog } from '@angular/material/dialog';
import { MotivoAusenciaMinutaComponent } from '../../modals/motivo-ausencia-minuta/motivo-ausencia-minuta.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { MinutaService } from '../../services/minuta.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { PeriodsProcessServices } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/services/periodo-procesos.service';
import { periodProcessGetI } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/interface/periodo-procesos.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolI } from '../../../mantenimiento/mantenimiento-options/protocolos/interface/protocolos.interface';
import { ProtocolsServices } from '../../../mantenimiento/mantenimiento-options/protocolos/services/protocolo.service';
import { EvaluationCompetencyServices } from '../../../evaluacion-competencias/services/evaluacion-competencia.service';
import { EvaluationCompetencyGetI, EvaluationCompetencySummaryGetI } from '../../../evaluacion-competencias/interface/evaluacion-competencias.interface';

@Component({
  selector: 'app-minuta',
  standalone: true,
  imports: [ClassImports, MaterialComponents],
  providers: [IntranetServices, systemInformationService, MinutaService, PeriodsProcessServices],
  templateUrl: './minuta.component.html',
  styleUrl: './minuta.component.css'
})
export class MinutaComponent implements OnInit {

  collaborator!: any;
  docName: string = ''
  protocol!: ProtocolI
  usuario!: loggedUserI
  typeMinuta: number = 0
  interino: boolean = false
  formMinuta!: FormGroup;
  isLoading: boolean = true;
  idPeriodsProcessActive!: periodProcessGetI
  agreement: Array<AcuerdoI> = []
  periodsProcess!: periodProcessGetI[]
  colaboradoresMinuta: MinutaAsistenciaI[] = [];
  colaboradoresMinutaToSend: MinutaAsistenciaI[] = [];
  evaluationsCompetencies: EvaluationCompetencySummaryGetI[] = []

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private SnackBar: SnackBars,
    private route: ActivatedRoute,
    private appHelpers: HerlperService,
    private minutaService: MinutaService,
    private protocolService: ProtocolsServices,
    private agreementService: agreementService,
    public systeminformation: systemInformationService,
    private periodProcessService: PeriodsProcessServices,
    private evaluationCompetencyService: EvaluationCompetencyServices,
  ) {
    this.formMinuta = this.fb.group({
      agendaReunion: new FormControl<string>('', [Validators.maxLength(3000)]),
      desarrollo: new FormControl<string>('', [Validators.required, Validators.maxLength(5000)]),
      conclusiones: new FormControl<string>('', [Validators.maxLength(12000)]),
      tipoProcesoId: new FormControl<number>(0),
      unidadOrg: new FormControl(''),
    })
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.typeMinuta = Number(this.route.snapshot.queryParamMap.get('typeMinuta'));
      this.interino = this.route.snapshot.queryParamMap.get('interino') === 'true';
    });

    this.usuario = this.systeminformation.localUser;
    this.getProtocol()

    if (Number(this.typeMinuta) == 1) {
      this.getPeriodsProcessActive()
    } else {
      this.getSupervisorWithSubordinates()
    }
    
    // this.getPeriodsProcess()
  }

  getAcuerdoByRol() {
    const request = this.interino
      ? this.agreementService.getAgreementProbative('', '', '', '', 1, 100)
      : this.agreementService.getAgreementByRol('', '', '', '', true);

    request.subscribe((resp: any) => {
      
      this.agreement = resp.data.filter((item:AcuerdoI)=> {
        const fechaIngreso = new Date(item.colaboradorObj.fechaIngreso);
        const fechaActual = new Date();
      
        // Diferencia en milisegundos
        const diferenciaMs = fechaActual.getTime() - fechaIngreso.getTime();
      
        // Convertir la diferencia a días
        const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
      
        return (
          item.tipoProceso.id === this.idPeriodsProcessActive.tipoProceso.id ||
          diferenciaDias >= 30
        );
      });

      this.colaboradoresMinuta = this.agreement.map((acuerdo) => ({
        idColaborador: acuerdo.colaboradorObj.idPersona,
        colaborador: acuerdo,
        ausente: false,
        motivoAusencia: null,
      }));

      this.colaboradoresMinutaToSend = this.colaboradoresMinuta
    });
  }

  //metodo para obtener el proceso
  // getPeriodsProcess() {
  //   this.periodProcessService.getPeriodProcesses(1, 10)
  //     .subscribe((res: any) => {

  //       this.periodsProcess = res.data;
  //     })
  // }

  // metodo para obtener el proceso del acuerdo activo
  getPeriodsProcessActive() {
    this.periodProcessService.getPeriodProcessesActive(true)
      .subscribe((res: any) => {

        this.idPeriodsProcessActive = res.data;
        this.getAcuerdoByRol()
      })
  }

  getSupervisorWithSubordinates() {
    this.evaluationCompetencyService.getEvaluationCompetencies(true).subscribe((res: any) => {
      if (res.data.colaboradores.length > 0) {
        this.SnackBar.snackbarWarning('Upps! Ha ocurrido un error, al parecer no todos los supervisados fueron evaluados.', 6000)
        this.router.navigate(['/layout/evaluacion-competencias'])
      }

      this.evaluationsCompetencies = res.data.evaluacionesCompetencias;

      this.colaboradoresMinuta = this.evaluationsCompetencies.map((acuerdo) => ({
        ausente: false,
        colaborador: null,
        idColaborador: acuerdo.colaborador.personaIntranetId,
        motivoAusencia: null,
      }));

    })
  }

  getProtocol() {
    this.protocolService.getProtocolByTypeProtocolId(5)
      .subscribe((res: any) => {
        this.protocol = res.data;
        if (res.data) {
          this.docName = this.protocol.documentosObj[0].nombre.split('.')[0]
        }
      })
  }

  openModalMotivoAusencia(id: number): void {
    const colaborador = this.colaboradoresMinutaToSend.find((c) => c.idColaborador === id);
    const dialog = this.dialog.open(MotivoAusenciaMinutaComponent, { width: '700px', data: colaborador,});

    dialog.afterClosed().subscribe((result) => {
      if(result.ausente){
        this.colaboradoresMinuta = this.colaboradoresMinuta.map(colab =>
          colab.idColaborador === id
            ? { ...colab, ausente: true }
            : colab
        );
      }
      
      if (result) {
        const index = this.colaboradoresMinutaToSend.findIndex((c) => c.idColaborador === result.idColaborador);
        if (index !== -1) {
          this.colaboradoresMinutaToSend[index] = result;
        }
      }
    });
  }

  // Validator() {
  //   return (control: any) => {
  //     const value = control.value || '';
  //     const errors: any = {};
  //     // Validar que sea específica (mínimo 10 caracteres como ejemplo)
  //     if (value.length > 40) {
  //       errors['Muylargo'] =
  //         'Has excedido el máximo de caracteres permitidos.';
  //     }

  //     return Object.keys(errors).length ? errors : null;
  //   };
  // }

  // metodo para armar objeto de minuta y hacer el post
  postMinuta() {
    const Minuta: MinutaI = {
      // supervisorId: Number(this.usuario.idPersona),
      periodoAcuerdoId: this.idPeriodsProcessActive.idPeriodoAcuerdo,
      esUnaEvaluacionCompentencia: Number(this.typeMinuta) == 1 ? false : true,
      // periodoId: this.systeminformation.activePeriod().idPeriodo,
      desarrollo: this.formMinuta.get('desarrollo')?.value,
      conclusion: this.formMinuta.get('conclusiones')?.value,
      agendaReunion: this.formMinuta.get('agendaReunion')?.value,
      unidadOrg: this.usuario.Unidad,
      minutaAsistencia: this.colaboradoresMinutaToSend.map((colaborador) => (
        {
          ausente: colaborador.ausente,
          colaborador: null,
          idColaborador: colaborador.idColaborador,
          motivoAusencia: colaborador.motivoAusencia
        })),
    }

    this.minutaService.postMinuta(Minuta).subscribe((resp: any) => {
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => { }, this.formMinuta)

      if (Number(this.typeMinuta) == 1) {
        if (this.interino == false) this.router.navigate(['/layout/acuerdos'])
        else this.router.navigate(['/layout/acuerdos-provisional'])
      }
      else this.router.navigate(['/layout/evaluacion-competencias'])
    })
  }

  //Metodo para guardar minuta
  save() {
    // if (this.formMinuta.invalid) {
    //   this.SnackBar.snackbarError('El formulario es inválido'); return
    // }
    // if (this.formMinuta.get('tipoProcesoId')?.value == 0) {
    //   this.SnackBar.snackbarError('Debes seleccionar un proseso para guardar'); return
    // }
    this.postMinuta()
  }
}

