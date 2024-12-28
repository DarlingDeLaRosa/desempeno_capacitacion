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
import { Router } from '@angular/router';
import { ProtocolI } from '../../../mantenimiento/mantenimiento-options/protocolos/interface/protocolos.interface';
import { ProtocolsServices } from '../../../mantenimiento/mantenimiento-options/protocolos/services/protocolo.service';

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
  usuario!: loggedUserI
  isLoading: boolean = true;
  agreement: Array<AcuerdoI> = []
  colaboradoresMinuta!: MinutaAsistenciaI[];
  formMinuta!: FormGroup;
  periodsProcess!: periodProcessGetI[]
  idPeriodsProcessActive!: number
  protocol!: ProtocolI

  constructor(
    private fb: FormBuilder,
    private agreementService: agreementService,
    private dialog: MatDialog,
    private periodProcessService: PeriodsProcessServices,
    public systeminformation: systemInformationService,
    private SnackBar: SnackBars,
    private minutaService: MinutaService,
    private appHelpers: HerlperService,
    private router: Router,
    private protocolService: ProtocolsServices,
  ) {
    this.formMinuta = fb.group({
      agendaReunion: new FormControl<string>('', [Validators.required,  this.Validator()]),
      desarrollo: new FormControl<string>('', [Validators.required,  this.Validator()]),
      conclusiones: new FormControl<string>('', [Validators.required,  this.Validator()]),
      tipoProcesoId: new FormControl<number>(0, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.usuario = this.systeminformation.localUser;
    this.getPeriodsProcess()
    this.getPeriodsProcessActive()
    this.getProtocol()
    this.getAcuerdoByRol()
  }

  getAcuerdoByRol() {
    this.isLoading = true;
    this.agreementService.getAgreementByRol(this.usuario.idPersona, '').subscribe((resp: any) => {
      this.agreement = resp.data;
      this.colaboradoresMinuta = this.agreement.map((acuerdo) => ({
        idColaborador: acuerdo.colaboradorObj.idPersona,
        ausente: false,
        motivoAusencia: null,
      }));
      this.isLoading = false;
    })
  }

  //metodo para obtener el proceso
  getPeriodsProcess() {
    this.periodProcessService.getPeriodProcesses(1, 10)
      .subscribe((res: any) => {
        this.periodsProcess = res.data;
      })
  }

  //metodo para obtener el proceso del acuerdo activo
  getPeriodsProcessActive() {
    this.periodProcessService.getPeriodProcessesActive()
      .subscribe((res: any) => {
        this.idPeriodsProcessActive = res.data.idPeriodoAcuerdo;
      })
  }

  getProtocol() {
    this.protocolService.getProtocolByTypeProtocolId(5)
      .subscribe((res: any) => {
        this.protocol = res.data;
      })
  }

  openModalMotivoAusencia(id: number): void {
    const colaborador = this.colaboradoresMinuta.find((c) => c.idColaborador === id);

    const dialog = this.dialog.open(MotivoAusenciaMinutaComponent, {
      width: '700px',
      data: colaborador, // Pasar los datos del colaborador al modal
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

  Validator() {
    return (control: any) => {
      const value = control.value || '';
      const errors: any = {};
      // Validar que sea específica (mínimo 10 caracteres como ejemplo)
      if (value.length > 40) {
        errors['Muylargo'] =
          'Has excedido el máximo de caracteres permitidos.';
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  //nevega a la lista de acuerdos
  NavegarAcuerdos() {
    this.router.navigate(['/layout/acuerdos'])
  }

  // metodo para armar objeto de minuta y hacer el post
  postMinuta() {
    const Minuta: MinutaI = {
      desarrollo: this.formMinuta.get('desarrollo')?.value,
      conclusion: this.formMinuta.get('desarrollo')?.value,
      agendaReunion: this.formMinuta.get('agendaReunion')?.value,
      periodoAcuerdoId: this.idPeriodsProcessActive,
      supervisorId: Number(this.usuario.idPersona),
      minutaAsistencia: this.colaboradoresMinuta.map((colaborador) => (
        {
          idColaborador: colaborador.idColaborador,
          ausente: colaborador.ausente,
          motivoAusencia: colaborador.motivoAusencia
        })),
    }

    this.minutaService.postMinuta(Minuta).subscribe((resp: any) => {
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.NavegarAcuerdos())
    })
  }

  //Metodo para guardar minuta
  save() {
    if (this.formMinuta.invalid) {
      this.SnackBar.snackbarError('El formulario es inválido'); return
    }
    // if (this.formMinuta.get('tipoProcesoId')?.value == 0) {
    //   this.SnackBar.snackbarError('Debes seleccionar un proseso para guardar'); return
    // }
    this.postMinuta()

  }
}

