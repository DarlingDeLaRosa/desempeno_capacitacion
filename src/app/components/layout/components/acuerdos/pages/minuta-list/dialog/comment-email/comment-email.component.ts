import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../../../helpers/material.components';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-email',
  standalone: true,
  imports: [ClassImports, MaterialComponents],
  templateUrl: './comment-email.component.html',
  styleUrl: './comment-email.component.css'
})
export class CommentEmailComponent {

  comentario: string = ''

  constructor(
    private dialogRef: MatDialogRef<CommentEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) {
  }

  closeModal(){
    this.dialogRef.close(this.comentario)
  }
}
