import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { ActivatedRoute } from '@angular/router';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { GoalsServices } from '../../../mantenimiento/mantenimiento-options/metas/services/meta.service';
import { GoalI, VerificationMethodI } from '../../../mantenimiento/mantenimiento-options/metas/interface/metas.interface';
import { ResponseI } from '../../../../../interfaces/generalInteerfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBar } from '../../../../../../helpers/components/snackBar/snackBar.component';
import { SnackbarError } from '../../../../../../helpers/components/snackBarError/snackbarError.component';
import { SnackBars } from '../../../../services/snackBars.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI } from '../../interfaces/acuerdo.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { PeriodI } from '../../../mantenimiento/mantenimiento-options/periodos/interfaces/periodo.interface';

@Component({
  selector: 'app-acuerdo-editar',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './acuerdo-editar.component.html',
  styleUrl: './acuerdo-editar.component.css'
})
export class AcuerdoEditarComponent implements OnInit{

  idRegistro!:number
  idEditarRegistro:number| null = null;
  collaborator!:CollaboratorsGetI;
  agreement!:AcuerdoI;
  verificacionMethodList: Array<VerificationMethodI> = [];
  goalForm:FormGroup;
  idSavedGoal: number = 0;
  usuarioActual!: loggedUserI
  goalDetails: Array<any>= [];
  totalValor: number = 0
  indexEditando: number | null = null;
  textboton:string = ''
  goalsPoa!: VerificationMethodI[]
  period!: PeriodI;
  activateSave:boolean = false;
  isLoading:boolean = true
  isLoading2:boolean = true

  constructor(
    private route:ActivatedRoute,
    private intranetService: IntranetServices,
    private goalsServices:GoalsServices,
    private agreementservice: agreementService,
    private fb:FormBuilder,
    private SnackBar:SnackBars,
    private appHelpers: HerlperService,
    private informationService: systemInformationService,
    ){
      // informationService.getActivePeriod().subscribe((period: PeriodI| null)=>{
      //   if (period) period = period
      // });
    this.usuarioActual = informationService.localUser;
    this.goalForm = fb.group({
    idMeta: new FormControl<number>(0),
    idMedio: new FormControl<number>(0, Validators.required),
    metaPoa: new FormControl<string>(''),
    nombre: new FormControl<string>('', Validators.required),
    valor: new FormControl<number>(0, Validators.required),
    isTranversal: new FormControl<boolean>(false, Validators.required),
  })
}

ngOnInit(): void {
  this.idRegistro = Number(this.route.snapshot.paramMap.get('id'));
    this.getPeopleById();
    this.getVerificationMethod();
    this.getGoalPOA()
  }

  //metodo para obtener los datos del colaborador segun el id para y podermos mostrar los datos del colaborador
  getPeopleById(){
    this.intranetService.getPeopleById(this.idRegistro).subscribe((resp:any)=>{
      this.collaborator = resp.data;
      this.isLoading2 = false;
      this.getAgreementByIdCollaborator();
    })
  }

//metodo para filtra; la lista de metas segun el nivel
  getGoalPOAFiltered() {
    const goalPOAValue = this.goalForm.value.metaPoa;
    if (goalPOAValue && goalPOAValue.length >= 3) this.getGoalPOA(goalPOAValue)
    else this.goalsPoa = [];
  }

  //metodo para obtener la lista de metas del poa
  getGoalPOA(nombre: string = ''){
    this.intranetService.getGoalPOA(nombre)
    .subscribe((res: any) => {
      this.goalsPoa = res.data;
    });
  }

  //metodo para buscar el acuerdo por el id del colaborador y asignarle el detalle del acuerdo al arreglo de detalle
  getAgreementByIdCollaborator(){
    this.agreementservice.getAgreementByCollaborator(this.collaborator.idPersona, this.collaborator.grupoObj.idGrupo).subscribe((resp:any)=>{
      this.agreement = resp.data;
      console.log(this.agreement);
      //hace un map a los detalles del acuerdo y lo agrega al arreglo del detalle que tenemos
      this.goalDetails = this.agreement.detalles.map((detalle: any) => {
        return {
          idMeta: detalle.idMeta,
          idAcuerdoDetalle: detalle.idAcuerdoDetalle,
          nombre: detalle.metaObj.nombre,
          metaPoa: detalle.metaObj.metaPoa,
          idMedio: detalle.metaObj.idMedio,
          nombreMedio: detalle.metaObj.medioVerificacionObj.nombre,
          valor: detalle.metaObj.valor,
          calificacion: detalle.calificacion,
          isTranversal: detalle.metaObj.isTranversal,
        };
      });
      this.isLoading = false;
      this.calcularTotalValor()
    })
  }

  //Metodo para preparar y guardar el detalle de las metas
  postGoalDetails(){
    const acuerdoParaPost = this.goalDetails.map(detalle => ({
      idAcuerdo: this.agreement.idAcuerdo,
      metaObj: {
        idMeta: detalle.idMeta,
        idMedio: detalle.idMedio,
        nombre: detalle.nombre,
        valor: detalle.valor,
        metaPoa: detalle.metaPoa,
        isTranversal: detalle.isTranversal
      }
    }));
    this.agreementservice.postAgreementGoalDetails(acuerdoParaPost).subscribe((resp:any)=>{
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.getAgreementByIdCollaborator())
      this.activateSave= false;
    })
  }

  //metodo para obtener la lista de metodos de verificacion
  getVerificationMethod(){
    this.goalsServices.getVerificationMethod().subscribe((resp:any)=>{
      this.verificacionMethodList = resp.data;
    })
  }

  //metodo para eliminar una meta de la base de datos
  async deleteGoaDetail(id: number) {
    let removeDecision: boolean = await this.SnackBar.snackbarConfirmation()
    if (removeDecision) {
      this.SnackBar.snackbarLouder(true)
      this.agreementservice.deleteGoalDetail(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () =>
          this.getAgreementByIdCollaborator(), this.goalForm)
        })
    }
  }

//metodo para editar metas en la base de datos
  updateGoal(){
    this.goalsServices.putGoal(this.goalForm.value).subscribe((resp:any)=>{
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.getAgreementByIdCollaborator())
     this.cancelEdition();
    })
  }

  /*Este metodo es para agregar el las metas al arreglo de detalle y a la vez permite agregar el nombre
  del medio de verificacion para poderlo mostrar en la tabla de detalles.*/
  addGoalDetails(){
    const detalle = this.goalForm.getRawValue();
    const medioSeleccionado = this.verificacionMethodList.find(m => m.idMedio === detalle.idMedio);

    this.goalDetails.push({
      idMeta: detalle.idMeta || null,
      idMedio: detalle.idMedio,
      nombreMedio: medioSeleccionado ? medioSeleccionado.nombre : '',
      nombre: detalle.nombre,
      metaPoa: detalle.metaPoa,
      valor: detalle.valor,
      isTranversal: detalle.isTranversal ?? false
    });
    this.goalForm.reset();
    console.log(this.goalDetails);
    this.calcularTotalValor()
    this.activateSave= true;
  }

  //calcula el valor total de las metas agregadas
  calcularTotalValor() {
    this.totalValor = this.goalDetails.reduce((acc, item) => acc + (item.valor || 0), 0);
  }

  //metodo para agregar detalles al arreglo
  add(){
    this.goalForm.get('isTranversal')?.setValue(false);

    if ( this.goalForm.get('valor')?.value <= 0) {
      this.SnackBar.snackbarError('El valor de la meta debe ser mayor a 0'); return;
    }
    if (this.goalForm.invalid) {
      this.SnackBar.snackbarError('Debes completar todos los campos para guardar'); return;
    }else{
      if (this.indexEditando || this.idEditarRegistro) {
        this.EditarMetas()
      }else{
        this.addGoalDetails();
      }
    }
  }

  //Carga los detos al formulario
  cargarDetalleEnFormularioIndex(index: number, ideditarRegistro:number) {
    if (ideditarRegistro) {
      this.idEditarRegistro = ideditarRegistro;
    }

    if (index > -1 && index < this.goalDetails.length) {
      const detalle = this.goalDetails[index];
      this.goalForm.patchValue({
        idMeta: detalle.idMeta,
        idMedio: detalle.idMedio,
        nombre: detalle.nombre,
        metaPoa: detalle.metaPoa,
        valor: detalle.valor,
      });
      this.indexEditando = index;
    }
  }

  //Metodo para editar los detalles de la tabla por index
  EditarMetas() {
    if (this.idEditarRegistro) {
      this.updateGoal();
      return;
    }else{
      if (this.indexEditando !== null) {
        this.goalDetails[this.indexEditando] = {
          ...this.goalDetails[this.indexEditando],
          ...this.goalForm.value // Sobreescribimos los valores editados
        };
        this.indexEditando = null;
        this.goalForm.reset();
      }
    }
  }

  //metodo para eliminar un elemento de goalDetails
  async deletedetalle(index: number,idDetalle:number) {
  if (idDetalle) {
    this.deleteGoaDetail(idDetalle)
    return;
  }else{
    if (index > -1 && index < this.goalDetails.length) {
      let removeDecision: boolean = await this.SnackBar.snackbarConfirmation()
      if (removeDecision) {
        this.goalDetails.splice(index, 1);
      }
    }
  }
  this.calcularTotalValor();
}

//Limpia los ids de editar el regitro
cancelEdition(){
this.idEditarRegistro = null;
this.indexEditando = null;
this.goalForm.reset();
}

//metodo para guardar
save(){
  if (this.totalValor != this.agreement.puntos) {
    this.SnackBar.snackbarError('El valor total debe ser igual a ' + this.agreement.puntos)
    return
  }
 this.postGoalDetails();
}
}
