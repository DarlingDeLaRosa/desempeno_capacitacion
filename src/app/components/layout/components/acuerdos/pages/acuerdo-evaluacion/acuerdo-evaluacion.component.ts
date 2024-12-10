import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { ClassImports } from '../../../../../../helpers/class.components';
import { IntranetServices } from '../../../../../../helpers/intranet/intranet.service';
import { CollaboratorsGetI } from '../../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { agreementService } from '../../services/acuerdo.service';
import { AcuerdoI } from '../../interfaces/acuerdo.interface';
import { MatDialog } from '@angular/material/dialog';
import { AcuerdoCalificacionComponent } from '../../modals/acuerdo-calificacion/acuerdo-calificacion.component';
import { GoalGetI } from '../../../mantenimiento/mantenimiento-options/metas/interface/metas.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackBars } from '../../../../services/snackBars.service';
import { HerlperService } from '../../../../services/appHelpers.service';

@Component({
  selector: 'app-acuerdo-evaluacion',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './acuerdo-evaluacion.component.html',
  styleUrl: './acuerdo-evaluacion.component.css'
})
export class AcuerdoEvaluacionComponent implements OnInit{

  idpersona!:number;
  collaborator!:CollaboratorsGetI;
  goalDetails: Array<any>= [];
  agreement!:AcuerdoI;
  totalValor: number = 0;
  totalCalificacion:number = 0;
  nameCollaborator:string ='';
  isLoading:boolean = true;
  constructor(
    private route:ActivatedRoute,
    private dialog: MatDialog,
    private intranetService: IntranetServices,
    private agreementservice: agreementService,
    private SnackBar:SnackBars,
    private appHelpers: HerlperService,
    ){}

  ngOnInit(): void {
    this.idpersona = Number(this.route.snapshot.paramMap.get('id'));
    this.getAgreementByIdCollaborator();
  }
//Metodo para obtener el acuerdo del colaborador
  getAgreementByIdCollaborator(){
    this.agreementservice.getAgreementByIdCollaborator(this.idpersona).subscribe((resp:any)=>{
      this.agreement = resp.data;
      console.log(this.agreement);
      //hace un map a los detalles del acuerdo y lo agrega al arreglo del detalle que tenemos
      this.goalDetails = this.agreement.detalles.map((detalle: any) => {
        return {
          idMeta: detalle.idMeta,
          idAcuerdoDetalle: detalle.idAcuerdoDetalle,
          nombre: detalle.metaObj.nombre,
          nombreMedio: detalle.metaObj.medioVerificacionObj.nombre,
          valor: detalle.metaObj.valor,
          calificacion: detalle.calificacion,
          enlaceDoc: detalle.documentosObj[0]?.enlace || null,
          nombreDoc: detalle.documentosObj[0]?.nombre || null
        };
      });
      this.isLoading = false;
      console.log(this.goalDetails);
      this.calcularTotalValor()
    })
  }

  calcularTotalValor() {
    this.totalValor = this.goalDetails.reduce((acc, item) => acc + (item.valor || 0), 0);
    this.totalCalificacion = this.goalDetails.reduce((acc, item) => acc + (item.calificacion || 0), 0);
  }

  openModalCalificacion(goal:GoalGetI):void{
    const dialog = this.dialog.open(AcuerdoCalificacionComponent,{
      width: '700px',
      data: {
        meta: goal,
        nombre: this.nameCollaborator,
      },
    })

    dialog.afterClosed().subscribe(result => {
      this.getAgreementByIdCollaborator();
    });
  }
}
