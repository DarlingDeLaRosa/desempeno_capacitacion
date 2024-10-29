import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';

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
  ) {

    this.asignationGoalForm = fb.group({
      idAsignacion: 0,
      idGrupo: new FormControl('', Validators.required),
      idMeta: new FormControl('', Validators.required),
    })
  }

  goals!: any[]
  asignationGoalForm: FormGroup
  ocupationalGroup!: any[]
  asignationGoals!: any[]

  ngOnInit(): void {
 
  }


}
