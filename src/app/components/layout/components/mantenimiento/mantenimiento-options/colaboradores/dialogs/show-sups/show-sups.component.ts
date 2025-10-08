import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HerlperService } from '../../../../../../services/appHelpers.service';
import { CollaboratorServices } from '../../services/colaboradores.service';
import { MaterialComponents } from '../../../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../../../helpers/class.components';

@Component({
  selector: 'app-show-sups',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './show-sups.component.html',
  styleUrl: './show-sups.component.css'
})
export class ShowSupsComponent implements OnInit {

  public collaboratorData!: any[]

  constructor(
    private dialogRef: MatDialogRef<ShowSupsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number, name: string},
    public appHelper: HerlperService,
    public collaboratorService: CollaboratorServices,
  ) { }

  ngOnInit(): void {
    this.supervisados()
  }

  supervisados() {
    this.collaboratorService.getCollaboratorByIdSup(this.data.id).subscribe((res: any) => {
      this.collaboratorData = res.data
    })
  }

  closeModal() {
    this.dialogRef.close()
  }
}
