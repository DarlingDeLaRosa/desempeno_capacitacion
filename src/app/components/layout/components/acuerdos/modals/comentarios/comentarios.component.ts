import { AfterViewChecked, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { commentsI } from '../../interfaces/acuerdo.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HerlperService } from '../../../../services/appHelpers.service';
import { agreementService } from '../../services/acuerdo.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../../helpers/intranet/intranet.interface';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit, AfterViewChecked {

  @ViewChild('commentsContainer', { static: false }) commentsContainer!: ElementRef;
  comments!: commentsI[]
  commentsForm: FormGroup
  userLogged!: loggedUserI

  constructor(
    public fb: FormBuilder,
    public appHelper: HerlperService,
    private agreementservice: agreementService,
    public dialogRef: MatDialogRef<ComentariosComponent>,
    public systemInformation: systemInformationService,
    @Inject(MAT_DIALOG_DATA)
    public data: { idAcuerdo: number, fullName: string, estado: number, user: string },
  ) {
    this.commentsForm = fb.group({
      acuerdoId: 0,
      descripcion: new FormControl(''),
    })

    this.userLogged = systemInformation.localUser
  }

  ngOnInit(): void {
    this.getComments()
    this.scrollToBottom()
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom()
  }

  getComments() {
    this.agreementservice.getComments(this.data.idAcuerdo).subscribe((res: any) => {
      this.comments = res.data
      let commentsCounts = res.data.length - 1
      
      if (this.userLogged.Username != this.comments[commentsCounts].creadoPorUsuario && this.comments.some(comment => comment.leido == false)) {
        this.agreementservice.putCommentsReaded(this.data.idAcuerdo).subscribe(() => { })
      }
    })
  }

  postComment() {
    if (this.commentsForm.value.descripcion.length == 0) return
    this.commentsForm.patchValue({ acuerdoId: this.data.idAcuerdo })
    this.agreementservice.postComment(this.commentsForm.value).subscribe((res: any) => {
      if (res.status) {
        this.getComments()
        this.commentsForm.reset()
      }
    })
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  private scrollToBottom(): void {
    try {
      this.commentsContainer.nativeElement.scrollTop =
        this.commentsContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error haciendo scroll:', err);
    }
  }
}
