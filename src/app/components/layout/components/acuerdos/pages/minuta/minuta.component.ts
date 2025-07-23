import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { materialize } from 'rxjs';
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
import { EvaluationCompetencyGetI } from '../../../evaluacion-competencias/interface/evaluacion-competencias.interface';

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
  formMinuta!: FormGroup;
  isLoading: boolean = true;
  idPeriodsProcessActive!: number
  agreement: Array<AcuerdoI> = []
  periodsProcess!: periodProcessGetI[]
  colaboradoresMinuta!: MinutaAsistenciaI[];
  evaluationsCompetencies: EvaluationCompetencyGetI[] = []

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
      agendaReunion: new FormControl<string>('', [Validators.required, Validators.minLength(40)]),
      desarrollo: new FormControl<string>('', [Validators.required, Validators.minLength(40)]),
      conclusiones: new FormControl<string>('', [Validators.required, Validators.minLength(40)]),
      tipoProcesoId: new FormControl<number>(0),
    })
  } 


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.typeMinuta = params['typeMinuta'];
    });

    this.usuario = this.systeminformation.localUser;
    // this.getPeriodsProcess()
    // this.getPeriodsProcessActive()
    this.getProtocol()
    // this.getAcuerdoByRol()
    this.getSupervisorWithSubordinates()
  }

  getAcuerdoByRol() {
    // this.isLoading = true;

    this.agreementService.getAgreementByRol('', true).subscribe((resp: any) => {
      this.agreement = resp.data;

      this.colaboradoresMinuta = this.agreement.map((acuerdo) => ({
        idColaborador: acuerdo.colaboradorObj.idPersona,
        ausente: false,
        motivoAusencia: null,
      }));

      // this.isLoading = false;
    })
  }

  //metodo para obtener el proceso
  // getPeriodsProcess() {
  //   this.periodProcessService.getPeriodProcesses(1, 10)
  //     .subscribe((res: any) => {
  //       console.log(res);

  //       this.periodsProcess = res.data;
  //     })
  // }

  //metodo para obtener el proceso del acuerdo activo
  // getPeriodsProcessActive() {
  //   this.periodProcessService.getPeriodProcessesActive()
  //     .subscribe((res: any) => {
  //       console.log(res);

  //       this.idPeriodsProcessActive = res.data.idPeriodoAcuerdo;
  //     })
  // }

  getSupervisorWithSubordinates() {
    this.evaluationCompetencyService.getEvaluationCompetencies(true).subscribe((res: any) => {
      if (res.data.colaboradores.length > 0) {
        this.SnackBar.snackbarWarning('Upps! Ha ocurrido un error, al parecer no todos los supervisados fueron evaluados.', 6000)
        this.router.navigate(['/layout/evaluacion-competencias'])
      }

      this.evaluationsCompetencies = res.data.evaluacionesCompetencias;

      this.colaboradoresMinuta = this.evaluationsCompetencies.map((acuerdo) => ({
        ausente: false,
        idColaborador: acuerdo.colaborador.idPersona,
        motivoAusencia: null,
      }));
    })
  }

  getProtocol() {
    this.protocolService.getProtocolByTypeProtocolId(5)
      .subscribe((res: any) => {
        this.protocol = res.data;
        this.docName = this.protocol.documentosObj[0].nombre.split('.')[0]
      })
  }

  openModalMotivoAusencia(id: number): void {
    const colaborador = this.colaboradoresMinuta.find((c) => c.idColaborador === id);

    const dialog = this.dialog.open(MotivoAusenciaMinutaComponent, {
      width: '700px',
      data: colaborador,
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        // Actualizar el arreglo con los datos del modal
        const index = this.colaboradoresMinuta.findIndex((c) => c.idColaborador === result.idColaborador);
        if (index !== -1) {
          this.colaboradoresMinuta[index] = result;
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
      supervisorId: Number(this.usuario.idPersona),
      periodoAcuerdoId: this.idPeriodsProcessActive,
      esUnaEvaluacionCompentencia: this.typeMinuta == 1 ? false : true,
      periodoId: this.systeminformation.activePeriod().idPeriodo,
      desarrollo: this.formMinuta.get('desarrollo')?.value,
      conclusion: this.formMinuta.get('conclusiones')?.value,
      agendaReunion: this.formMinuta.get('agendaReunion')?.value,
      minutaAsistencia: this.colaboradoresMinuta.map((colaborador) => (
        {
          ausente: colaborador.ausente,
          idColaborador: colaborador.idColaborador,
          motivoAusencia: colaborador.motivoAusencia
        })),
    }
    console.log(Minuta);
    

    this.minutaService.postMinuta(Minuta).subscribe((resp: any) => {
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => {}, this.formMinuta)
      if (this.typeMinuta == 1) this.router.navigate(['/layout/acuerdos'])
      else this.router.navigate(['/layout/evaluacion-competencias'])
    })
  }

  //Metodo para guardar minuta
  save() {
    console.log(this.formMinuta.value);
    
    // if (this.formMinuta.invalid) {
    //   this.SnackBar.snackbarError('El formulario es inválido'); return
    // }
    // if (this.formMinuta.get('tipoProcesoId')?.value == 0) {
    //   this.SnackBar.snackbarError('Debes seleccionar un proseso para guardar'); return
    // }
    this.postMinuta()
  }
}

