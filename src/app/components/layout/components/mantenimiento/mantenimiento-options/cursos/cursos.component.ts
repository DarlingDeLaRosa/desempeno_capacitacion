import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { CoursesServices } from './services/cursos.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { CourseGetI, ModalityI, StateI } from './interfaces/cursos.interface';
import { SuppliersI } from '../../../../../../helpers/intranet/intranet.interface';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';
import { systemInformationService } from '../../../../services/systemInformationService.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosMantenimientoComponent implements OnInit {

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isDragOver = false;
  errorMessage = '';

  formData: FormData;

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private coursesService: CoursesServices,
    private intranetService: IntranetServices,
    private systemInformation: systemInformationService,
  ) {

    this.coursesForm = fb.group({
      idCurso: 0,
      nombre: new FormControl('', Validators.required),
      suplidor: new FormControl('', Validators.required),
      cuposDisponibles: new FormControl(0, Validators.required),
      interno: new FormControl(true, Validators.required),
      rnc: new FormControl('', Validators.required),
      fechaInicioInscripcion: new FormControl('', Validators.required),
      fechaFinInscripcion: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      idModalidad: new FormControl(0, Validators.required),
      costoPersona: new FormControl(0),
      costoTotal: new FormControl(0),
      idEstado: new FormControl(0, Validators.required),
      link: new FormControl(''),
      periodoId: new FormControl(''),
      grupoOcupacional: new FormControl([], Validators.required),
    })
    this.uploadForm = this.fb.group({
      image: [null]
    });

    this.formData = new FormData();
  }

  page: number = 1
  states!: StateI[]
  coursesForm: FormGroup
  courses!: CourseGetI[]
  modalities!: ModalityI[]
  pagination!: PaginationI
  suppliersRs!: SuppliersI[]
  suppliersRnc!: SuppliersI[]

  ngOnInit(): void {
    this.getState()
    this.getCourses()
    this.getModality()
    this.getSuppliersByRs()
  }



  //Metodo para mostrar el nombre en el input
  displayRsName(rs: SuppliersI): string {
    return rs ? rs.razonSocial : '';
  }

  // Metodo para obtener todas los cursos
  getSuppliersByRnc() {
    this.intranetService.findProveedorByRNC(this.coursesForm.value.rnc)
      .subscribe((res: any) => {
        this.suppliersRnc = res.data
        if (this.suppliersRnc) {
          this.coursesForm.patchValue({ suplidor: this.suppliersRnc[0].razonSocial })
        } else {
          this.coursesForm.get('rnc')?.reset()
          this.coursesForm.get('suplidor')?.reset()
          this.snackBar.snackbarError('El RNC no fue encontrado.')
        }
      })
  }

  // Metodo para obtener todos los proveedores por nombre
  getSuppliersByRsFilter() {
    if (this.coursesForm.value.suplidor && this.coursesForm.value.suplidor.length >= 3) {
      this.getSuppliersByRs(this.coursesForm.value.suplidor)
    } else {
      this.suppliersRs = [];
    }
  }

  // Metodo para obtener todos los proveedores
  getSuppliersByRs(rs: any = '') {
    this.intranetService.findProveedorByRS(rs)
      .subscribe((res: any) => {
        this.suppliersRs = res.data;
      });
  }

  // Metodo para completar el campo de RNC en el formulario
  setValueRs(suplier: SuppliersI) {
    this.coursesForm.patchValue({ rnc: suplier.rnc })
  }

  // Metodo para obtener todas las modalidades de cursos
  getModality() {
    this.coursesService.getModality()
      .subscribe((res: any) => {
        this.modalities = res.data;
      })
  }

  // Metodo para obtener todos los estados de los cursos
  getState() {
    this.coursesService.getStates()
      .subscribe((res: any) => {
        this.states = res.data;
      })
  }

  // Metodo para obtener todas los cursos
  getCourses() {
    this.coursesService.getCourses(this.page, 10)
      .subscribe((res: any) => {
        this.courses = res.data;
        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
      })
  }

  // Metodo para crear un curso
  postCourse() {
    if (!this.selectedFile) {
      this.snackBar.snackbarError('Debe seleccionar una imagen para guardar', 5000)
    }
    this.coursesService.postCourse(this.formData)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCourses(), this.coursesForm)
        this.formData = new FormData();
        this.resetForm()
      });

  }

  // Metodo para editar un curso
  putCourse() {
    this.coursesService.putCourse(this.formData)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getCourses(), this.coursesForm)
        this.formData = new FormData();
        this.resetForm()
      })
  }


  // Metodo para eliminar un curso
  async deleteCourse(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.coursesService.deleteCourse(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getCourses(), this.coursesForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(course: CourseGetI) {
    const { grupoOcupacional, ...rest } = course;
    this.snackBar.snackbarLouder(true)
    this.intranetService.findProveedorByRNC(course.rnc).subscribe((res: any) => {
      this.snackBar.snackbarLouder(false)
      this.coursesForm.patchValue({ suplidor: res.data })

    })

    this.coursesForm.reset(rest)
    const gruposString = course.grupoOcupacional || '';
    const gruposArray = gruposString ? gruposString.split(',') : [];

    this.coursesForm.patchValue({
      grupoOcupacional: gruposArray
    });

    this.imagePreview = course.img;
    this.selectedFile = null;
  }

  // Metodo para manejar las funciones de editar y crear en el onSubmit del formulario
  saveChanges() {

    this.coursesForm.value.periodoId = this.systemInformation.activePeriod().idPeriodo
    this.coursesForm.value.suplidor = this.coursesForm.value.suplidor.razonSocial

    if (this.coursesForm.invalid) {
      this.snackBar.snackbarError('Debe completar el formulario antes de guardar', 5000)
      return
    }

    if (this.coursesForm.value.suplidor == undefined) {
      this.snackBar.snackbarError('La razón social es incorrecta, asegurese de seleccionar una de la barra de opciones.', 5000)
    }
    else {
      const gruposSeleccionados = this.coursesForm.value.grupoOcupacional;

      this.formData.append('IdCurso', this.coursesForm.value.idCurso);
      this.formData.append('PeriodoId', this.coursesForm.value.periodoId);
      this.formData.append('Nombre', this.coursesForm.value.nombre);
      this.formData.append('Suplidor', this.coursesForm.value.suplidor);
      this.formData.append('Rnc', this.coursesForm.value.rnc);
      this.formData.append('CuposDisponibles', this.coursesForm.value.cuposDisponibles);

      this.formData.append('FechaInicio', this.transformarFecha(this.coursesForm.value.fechaInicio));
      this.formData.append('FechaFin', this.transformarFecha(this.coursesForm.value.fechaFin));
      this.formData.append('FechaInicioInscripcion', this.transformarFecha(this.coursesForm.value.fechaInicioInscripcion));
      this.formData.append('FechaFinInscripcion', this.transformarFecha(this.coursesForm.value.fechaFinInscripcion));

      this.formData.append('Descripcion', this.coursesForm.value.descripcion);
      this.formData.append('IdModalidad', this.coursesForm.value.idModalidad);
      this.formData.append('CostoPersona', this.coursesForm.value.costoPersona);
      this.formData.append('CostoTotal', this.coursesForm.value.costoTotal);
      this.formData.append('Link', this.coursesForm.value.link);
      this.formData.append('IdEstado', this.coursesForm.value.idEstado);
      this.formData.append('Interno', this.coursesForm.value.interno);
      this.formData.append('GrupoOcupacional', gruposSeleccionados.join(','));

      if (this.selectedFile) {
        this.formData.append('File', this.selectedFile);
      }

      this.formData.forEach((valor, clave) => {
      });
      this.appHelpers.saveChanges(() => this.postCourse(), () => this.putCourse(), this.coursesForm.value.idCurso, this.coursesForm)
      this.formData = new FormData();
    }

  }

  private transformarFecha(fechaInput: any): string {
    if (!fechaInput) return ''; // evita error si viene null/undefined

    const fecha = new Date(fechaInput);

    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const hh = String(fecha.getHours()).padStart(2, '0');
    const min = String(fecha.getMinutes()).padStart(2, '0');
    const ss = String(fecha.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }



  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getCourses()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getCourses()
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }


  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Por favor selecciona solo archivos de imagen';
      return;
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage = 'El archivo es demasiado grande. Máximo 10MB';
      return;
    }

    this.errorMessage = '';
    this.selectedFile = file;
    this.uploadForm.patchValue({ image: file });

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadForm.patchValue({ image: null });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit() {


    // Puedes agregar más campos al FormData si necesitas
    // formData.append('title', 'Mi imagen');
    // formData.append('description', 'Descripción de la imagen');

    // this.http.post('tu-endpoint-aqui', formData, {
    //   reportProgress: true,
    //   observe: 'events'
    // }).subscribe({
    //   next: (event) => {
    //     if (event.type === HttpEventType.UploadProgress) {
    //       this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
    //     } else if (event.type === HttpEventType.Response) {
    //       this.resetForm();
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Upload failed:', error);
    //     this.errorMessage = 'Error al subir la imagen. Inténtalo de nuevo.';
    //     this.isUploading = false;
    //     this.uploadProgress = 0;
    //   },
    //   complete: () => {
    //     this.isUploading = false;
    //   }
    // });
  }

  resetForm() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadForm.reset();
    this.errorMessage = '';
  }
}
