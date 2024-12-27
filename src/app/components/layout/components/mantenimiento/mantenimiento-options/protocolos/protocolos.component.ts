import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ProtocolsServices } from './services/protocolo.service';
import { ProtocolI, TypeProtocolI } from './interface/protocolos.interface';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';

@Component({
  selector: 'app-protocolos',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './protocolos.component.html',
  styleUrl: './protocolos.component.css'
})
export class ProtocolosComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public snackBar: SnackBars,
    private appHelpers: HerlperService,
    private protocolService: ProtocolsServices,
  ) {

    this.protocolForm = fb.group({
      idProtocolo: 0,
      idTipoProtocolo: new FormControl('', Validators.required)
    })
  }

  page: number = 1
  protocols!: ProtocolI[]
  protocolForm: FormGroup
  pagination!: PaginationI
  typesProtocols!: TypeProtocolI[]

  selectedFile: File | null = null;
  selectedFileName: string | undefined;

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  ngOnInit(): void {
    this.getProtocol()
    this.getTypeProtocol()
  }

  // Metodo para obtener todos los tipos de protocolos
  getTypeProtocol() {
    this.protocolService.getTypeProtocols()
      .subscribe((res: any) => {
        this.typesProtocols = res.data;
      })
  }

  // Metodo para obtener todos los protocolos
  getProtocol() {
    this.protocolService.getProtocols(this.page, 10)
      .subscribe((res: any) => {
        this.protocols = res.data;
        const { currentPage, totalItem, totalPage } = res
        this.pagination = { currentPage, totalItem, totalPage }
      })
  }

  // Metodo para crear los protocolos utilizando FormData
  postProtocol() {
    const formData = new FormData();

    formData.append('idProtocolo', this.protocolForm.get('idProtocolo')?.value);
    formData.append('idTipoProtocolo', this.protocolForm.get('idTipoProtocolo')?.value);

    if (this.selectedFile) {
      formData.append('DocumentosObjs', this.selectedFile, this.selectedFileName);
    }

    this.protocolService.postProtocol(formData)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getProtocol(), this.protocolForm)
        this.selectedFile = null;
        this.selectedFileName = undefined;
      })
  }

  // Metodo para editar los protocolos utilizando FormData
  putProtocol() {
    const formData = new FormData();

    formData.append('idProtocolo', this.protocolForm.get('idProtocolo')?.value);
    formData.append('idTipoProtocolo', this.protocolForm.get('idTipoProtocolo')?.value);

    if (this.selectedFile) {
      formData.append('DocumentosObjs', this.selectedFile, this.selectedFileName);
    }

    this.protocolService.putProtocol(formData)
      .subscribe((res: any) => {
        this.appHelpers.handleResponse(res, () => this.getProtocol(), this.protocolForm)
        this.selectedFile = null;
        this.selectedFileName = undefined;
      })
  }

  // Metodo para eliminar los protocolos y confirmación de la misma
  async deleteProtocol(id: number) {
    let removeDecision: boolean = await this.snackBar.snackbarConfirmation()

    if (removeDecision) {
      this.snackBar.snackbarLouder(true)
      this.protocolService.deleteProtocol(id)
        .subscribe((res: any) => { this.appHelpers.handleResponse(res, () => this.getProtocol(), this.protocolForm) })
    }
  }

  // Metodo asignar valores y habilitar la edición de un registro
  setValueToEdit(protocol: ProtocolI) {
    this.protocolForm.patchValue({
      idProtocolo: protocol.idProtocolo,
      idTipoProtocolo: protocol.tipoProtocoloObj.idTipoProtocolo
    })
    this.snackBar.snackbarWarning('El documento a subir debe ser seleccionado nueva vez.', 5000)

  }

  // Metodo para manejar las funciones de editar y crear con el mismo onSubmit del formulario
  saveChanges() {
    this.appHelpers.saveChanges(() => this.postProtocol(), () => this.putProtocol(), this.protocolForm.value.idProtocolo, this.protocolForm)
  }

  //Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getProtocol()
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getProtocol()
    }
  }
}
