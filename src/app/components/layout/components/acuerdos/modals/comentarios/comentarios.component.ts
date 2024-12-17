import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { comentarioI } from '../../interfaces/acuerdo.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HerlperService } from '../../../../services/appHelpers.service';
import { agreementService } from '../../services/acuerdo.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {

  constructor(
    public fb: FormBuilder,
    public appHelper: HerlperService,
    private agreementservice: agreementService,
    public dialogRef: MatDialogRef<ComentariosComponent>,
    public systemInformation: systemInformationService,
    @Inject(MAT_DIALOG_DATA)
    public data: {comentario: comentarioI[], idAcuerdo: number},
  ){
    this.commentsForm = fb.group({
      acuerdoId: 0,
      descripcion: new FormControl(''),
    })
  }
  commentsForm: FormGroup
  
  postComment(){
    this.commentsForm.patchValue({acuerdoId: this.data.idAcuerdo})
    this.agreementservice.postComment(this.commentsForm.value).subscribe((res: any) => {
      if (res.status) {
        this.appHelper.handleResponse(res, () => this.closeModal() , this.commentsForm)
      }
    })
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
