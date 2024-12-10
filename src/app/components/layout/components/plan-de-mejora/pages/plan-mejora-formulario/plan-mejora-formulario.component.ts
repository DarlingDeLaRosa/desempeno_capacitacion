import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanMejoraService } from '../../services/plan-mejora.service';
import { ResponseI } from '../../../../../interfaces/generalInteerfaces';
import { GeneralI } from '../../../../../../helpers/intranet/intranet.interface';
import { SnackBars } from '../../../../services/snackBars.service';
import { ActivatedRoute } from '@angular/router';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { PlanMejoraI } from '../../interfaces/plan-mejora.interface';
import { HerlperService } from '../../../../services/appHelpers.service';

@Component({
  selector: 'app-plan-mejora-formulario',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  providers: [PlanMejoraService, systemInformationService],
  templateUrl: './plan-mejora-formulario.component.html',
  styleUrl: './plan-mejora-formulario.component.css'
})
export class PlanMejoraFormularioComponent implements OnInit {
  puntosFuertes: GeneralI[] = [];
  areasMejora: GeneralI[] = [];

  nuevoPuntoFuerte: string = '';
  nuevaAreaMejora: string = '';
  recommenForm: FormGroup;
  planMejoraForm: FormGroup;

  categoriesRecommenList: Array<GeneralI> = []
  trimestresList: Array<GeneralI> = []
  recommendDetails: Array<any> = [];
  idEditarRegistro: number | null = null
  indexEditando: number | null = null
  idColaborador: number | null = null
  idPlanMejora: number | null = null
  planMejoraObtenido!: PlanMejoraI;
  isLoading: boolean = true;


  constructor(
    private fb: FormBuilder,
    private planMejoraService: PlanMejoraService,
    private SnackBar: SnackBars,
    private route: ActivatedRoute,
    private systemInformationSevice: systemInformationService,
    private appHelpers: HerlperService,

  ) {
    this.recommenForm = fb.group({
      idCategoriaRecomendacion: new FormControl<number>(0),
      que: new FormControl<string>('', Validators.required),
      como: new FormControl<string>('', Validators.required),
      porque: new FormControl<string>('', Validators.required),
      comienzoId: new FormControl<string>('', Validators.required),
    })

    this.planMejoraForm = fb.group({
      aspectos: new FormControl<string>(''),
      acciones: new FormControl<string>(''),
      comentarios: new FormControl<string>(''),
    })
  }
  ngOnInit(): void {
    this.idColaborador = Number(this.route.snapshot.paramMap.get('id'));
    this.getCategoriesRecommend();
    this.getTrimestres();
    this.getPlanMejoraByIdCollabo();
  }

  //metodo para agregar item al arreglo de puntos fuertes o areas de mejoras
  addItem(type: string) {
    if (type === 'puntosFuertes' && this.nuevoPuntoFuerte.trim()) {
      this.puntosFuertes.push({
        id: 0, // Generar un ID único
        nombre: this.nuevoPuntoFuerte.trim()
      });
      this.nuevoPuntoFuerte = ''; // Clear the input after adding
    }
    else if (type === 'areasMejora' && this.nuevaAreaMejora.trim()) {
      this.areasMejora.push({
        id: 0, // Generar un ID único
        nombre: this.nuevaAreaMejora.trim(),
      });
      this.nuevaAreaMejora = ''; // Clear the input after adding
    }
  }

  //Eliminar item del arreglo puntosFuertes o areasMejora
  removeItem(type: string, index: number) {
    if (type === 'puntosFuertes') {
      this.puntosFuertes.splice(index, 1); // borrar item del puntosFuertes
    } else if (type === 'areasMejora') {
      this.areasMejora.splice(index, 1); // borrar item del areasMejora
    }
  }

  //Metodo para obtener el acuerdo por el id del collaborador
  getPlanMejoraByIdCollabo() {
    //resetear los arreglos
    this.recommendDetails.length = 0
    this.areasMejora.length = 0
    this.puntosFuertes.length = 0

    this.planMejoraService.getPlanMejoraByIdCollabo(this.idColaborador!).subscribe((resp: any) => {
      this.planMejoraObtenido = resp.data;
      console.log(this.planMejoraObtenido);

      if (resp.statusCode == 200) {
        this.planMejoraObtenido.recomendacionesFormativas.map((recomendacion) => {
          this.recommendDetails.push({
            idCategoriaRecomendacion: recomendacion.categoriaRecomendacion!.id,
            nombreCategoria: recomendacion.categoriaRecomendacion!.nombre,
            nombreTrimestre: recomendacion.comienzo!.nombre,
            que: recomendacion.que.trim(),
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

  //metodo para obtener las categorias-recomendaciones
  getCategoriesRecommend() {
    this.planMejoraService.getCategoriesRecommen().subscribe((resp: any) => {
      this.categoriesRecommenList = resp.data;
      console.log(this.categoriesRecommenList);
    })
  }

  //metodo para obtner la lista de trimestres
  getTrimestres() {
    this.planMejoraService.getTrimestres().subscribe((resp: any) => {
      this.trimestresList = resp.data;
    })
  }

  //metodo para agregar detalle a la recomendaciones de formacion
  addRecommendDetails() {
    //valida si el arreglo de recomendaciones tiene menos de dos registro, y si tiene dos ya no agrega mas
    if (this.recommendDetails.length == 2) {
      this.SnackBar.snackbarError('No puede haber mas de 2 recomendaciones de formación');
      this.recommenForm.reset();
      return;
    }

    const detalle = this.recommenForm.getRawValue();
    const categoriaSeleccionada = this.categoriesRecommenList.find(m => m.id === detalle.idCategoriaRecomendacion);
    const trimestreSeleccionado = this.trimestresList.find(m => m.id === detalle.comienzoId);

    //Esto asigna el valor del formulario al arreglo del detalle
    this.recommendDetails.push({
      idCategoriaRecomendacion: detalle.idCategoriaRecomendacion,
      nombreCategoria: categoriaSeleccionada ? categoriaSeleccionada.nombre : '',
      nombreTrimestre: trimestreSeleccionado ? trimestreSeleccionado.nombre : '',
      que: detalle.que.trim(),
      como: detalle.como.trim(),
      porque: detalle.porque.trim(),
      comienzoId: detalle.comienzoId,
    });
    this.recommenForm.reset();
    console.log(this.recommendDetails);
  }

  //este metodo agrega los datos que contiene el formulario al arrego de detalle
  cargarDetalleEnFormularioIndex(index: number, ideditarRegistro: number) {
    console.log(index, ideditarRegistro);

    if (ideditarRegistro) {
      this.idEditarRegistro = ideditarRegistro;
    }

    if (index > -1 && index < this.recommendDetails.length) {
      const detalle = this.recommendDetails[index];
      this.recommenForm.patchValue({
        idCategoriaRecomendacion: detalle.idCategoriaRecomendacion,
        que: detalle.que.trim(),
        como: detalle.como.trim(),
        porque: detalle.porque.trim(),
        comienzoId: detalle.comienzoId,
      });
      this.indexEditando = index;
    }
  }

  //este metodo es para editar el registro seleccionado del arreglo del detalle
  EditarDetalle() {
    if (this.indexEditando !== null) {
      console.log(this.indexEditando);
      this.recommendDetails[this.indexEditando] = {
        ...this.recommendDetails[this.indexEditando],
        ...this.recommenForm.value // Sobreescribimos los valores editados
      };
      this.indexEditando = null;
      this.recommenForm.reset();
    }
  }

  async deletedetalle(index: number) {
    if (index > -1 && index < this.recommendDetails.length) {
      let removeDecision: boolean = await this.SnackBar.snackbarConfirmation()
      if (removeDecision) {
        this.recommendDetails.splice(index, 1);
      }
    }
  }

  //metodo para guardar o editar el detalle
  add() {
    //Validar que el formulario sea valido antes de agregarlo al detalle
    if (this.recommenForm.invalid){
      this.SnackBar.snackbarError('Debe completar todos los campos para agregar');
      return;
    }

    if (this.indexEditando != null || this.idEditarRegistro != null) {
      this.EditarDetalle()
    } else {
      this.addRecommendDetails()
    }
  }

  save() {
    const planMejora: PlanMejoraI = {
      idColaborador: this.idColaborador!,
      periodoId: this.systemInformationSevice.activePeriod().idPeriodo,
      accionMotivacional: this.planMejoraForm.get('acciones')?.value || '',
      aspectoDesempeno: this.planMejoraForm.get('aspectos')?.value || '',
      comentario: this.planMejoraForm.get('comentarios')?.value || '',
      areaMejoras: this.areasMejora.map((area) => ({ id: area.id, nombre: area.nombre })), // Limpia espacios
      puntosFuertes: this.puntosFuertes.map((punto) => ({ id: punto.id, nombre: punto.nombre })), // Limpia espacios
      recomendacionesFormativas: this.recommendDetails.map((recomendacion) => ({
        idCategoriaRecomendacion: recomendacion.idCategoriaRecomendacion || 0,
        que: recomendacion.que.trim(),
        como: recomendacion.como.trim(),
        porque: recomendacion.porque.trim(),
        comienzoId: recomendacion.comienzoId || 0,
      })),
    }

    console.log('Plan enviado', planMejora);

    this.planMejoraService.postPlanMejora(planMejora).subscribe((resp: any) => {
      this.SnackBar.snackbarLouder(true)
      this.appHelpers.handleResponse(resp, () => this.getPlanMejoraByIdCollabo())
    })
  }
}



