import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { MinutaService } from '../../services/minuta.service';
import { MinutaI } from '../../interfaces/acuerdo.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { MatDialog } from '@angular/material/dialog';
import { VerMinutaComponent } from '../../modals/ver-minuta/ver-minuta.component';
import { ListadoDocumentoComponent } from '../../modals/listado-documento/listado-documento.component';
import { PaginationI } from '../../../../../interfaces/generalInteerfaces';

@Component({
  selector: 'app-minuta-list',
  standalone: true,
  imports: [ClassImports, MaterialComponents],
  providers: [MinutaService],
  templateUrl: './minuta-list.component.html',
  styleUrl: './minuta-list.component.css'
})
export class MinutaListComponent implements OnInit {

  minutaList!: MinutaI[]
  searchTerm: string = '';
  typeMinuta: string = ''
  pagination!: PaginationI
  page: number = 1

  constructor(
    private minutaService: MinutaService,
    public appHelper: HerlperService,
    public systemInformation: systemInformationService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMinutas('')
  }

  getMinutas(term: string) {
    this.minutaService.getMinuta(term, this.typeMinuta, false).subscribe((resp: any) => {
      this.minutaList = resp.data;
    })
  }

  //buscar los por departamento y nombre del colaborador
  Buscar() {
    if (this.searchTerm.length > 2) {
      this.getMinutas(this.searchTerm)
    } else {
      if (this.searchTerm.length < 1) {
        this.getMinutas('');
      }
    }
  }

  openModalListadoDocumentos(nombre: string, apellido: string, idPersona: number): void {
    const nombreCompleto = nombre + ' ' + apellido;
    const dialog = this.dialog.open(ListadoDocumentoComponent, {
      // width: '750px',
      // height: '490px',
      data: {
        type: 2,
        idCollaborator: idPersona,
        nombreCompleto,
      }
    })
    dialog.afterClosed().subscribe(result => {
      this.getMinutas('')
    });
  }

  // openModalVer(minuta:MinutaI): void {
  //   const dialogRef = this.dialog.open(VerMinutaComponent, {
  //     width: '80%',
  //     data: { minuta }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }


//Metodo para llamar a la siguiente pagina
  nextPage() {
    if (this.page < this.pagination.totalPage) {
      this.page += 1
      this.getMinutas('')
    }
  }

  //Metodo para llamar a la pagina anterior
  previousPage() {
    if (this.page > 1) {
      this.page -= 1
        ; this.getMinutas('')
    }
  }
}
