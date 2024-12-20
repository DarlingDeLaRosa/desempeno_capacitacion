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

@Component({
  selector: 'app-minuta',
  standalone: true,
  imports: [ClassImports,MaterialComponents],
  providers:[IntranetServices,systemInformationService,MinutaService,PeriodsProcessServices],
  templateUrl: './minuta.component.html',
  styleUrl: './minuta.component.css'
})
export class MinutaComponent implements OnInit{

  collaborator!: any;
  usuario!: loggedUserI
  isLoading: boolean = true;
  agreement: Array<AcuerdoI> = []
  colaboradoresMinuta!: MinutaAsistenciaI [];
  formMinuta!: FormGroup;
  periodsProcess!: periodProcessGetI[]



  constructor(
    private fb: FormBuilder,
    private agreementService: agreementService,
    private dialog: MatDialog,
    private periodProcessService: PeriodsProcessServices,
    public systeminformation:systemInformationService,
    private SnackBar: SnackBars,
    private minutaService:MinutaService,
    private appHelpers: HerlperService,
    private router: Router
  ){
    this.formMinuta = fb.group({
      agendaReunion: new FormControl<string>('',[Validators.required]),
      desarrollo: new FormControl<string>('',[Validators.required]),
      conclusiones: new FormControl<string>('',[Validators.required]),
      tipoProcesoId: new FormControl<number>(0,[Validators.required]),
    })
  }

  ngOnInit(): void {
    this.usuario = this.systeminformation.localUser;
    console.log(this.usuario);
    this.getPeriodsProcess()
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
        console.log('Datos actualizados:', this.colaboradoresMinuta);
      }
    });
  }

  getPeriodsProcess() {
    this.periodProcessService.getPeriodProcesses(1, 10)
      .subscribe((res: any) => {
        this.periodsProcess = res.data;
        console.log(this.periodsProcess);
      })
  }

  NavegarAcuerdos(){
    this.router.navigate(['/layout/acuerdos'])
  }

  postMinuta(){
    const Minuta: MinutaI = {
      desarrollo: this.formMinuta.get('desarrollo')?.value,
      conclusion: this.formMinuta.get('desarrollo')?.value,
      agendaReunion: this.formMinuta.get('agendaReunion')?.value,
      periodoAcuerdoId: this.formMinuta.get('tipoProcesoId')?.value,
      supervisorId: Number(this.usuario.idPersona),
      minutaAsistencia: this.colaboradoresMinuta.map((colaborador) => (
        { idColaborador: colaborador.idColaborador,
          ausente: colaborador.ausente,
          motivoAusencia:colaborador.motivoAusencia
        })),
    }

    this.minutaService.postMinuta(Minuta).subscribe((resp: any) => {
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.NavegarAcuerdos())
    })
  }

  save(){
    if (this.formMinuta.invalid) {
      this.SnackBar.snackbarError('Debes completar el formulario para guardar'); return
    }
    if (this.formMinuta.get('tipoProcesoId')?.value == 0 ) {
      this.SnackBar.snackbarError('Debes seleccionar un proseso para guardar'); return
    }
    this.postMinuta()

  }
}
