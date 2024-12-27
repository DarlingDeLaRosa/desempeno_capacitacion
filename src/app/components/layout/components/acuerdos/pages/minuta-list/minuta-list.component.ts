import { Component, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { MinutaService } from '../../services/minuta.service';
import { MinutaI } from '../../interfaces/acuerdo.interface';
import { HerlperService } from '../../../../services/appHelpers.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { MatDialog } from '@angular/material/dialog';
import { VerMinutaComponent } from '../../modals/ver-minuta/ver-minuta.component';

@Component({
  selector: 'app-minuta-list',
  standalone: true,
  imports: [ClassImports,MaterialComponents],
  providers:[MinutaService],
  templateUrl: './minuta-list.component.html',
  styleUrl: './minuta-list.component.css'
})
export class MinutaListComponent implements OnInit{

minutaList!: MinutaI []
searchTerm: string = '';

constructor(
  private minutaService:MinutaService,
  public appHelper: HerlperService,
  public systemInformation:systemInformationService,
  private dialog: MatDialog,
){}

  ngOnInit(): void {
    this.getMinutas(null)
  }
  getMinutas(term: string | null) {
    this.minutaService.getMinuta(term).subscribe((resp: any) => {
      this.minutaList = resp.data;
    })
  }
    //buscar los por departamento y nombre del colaborador
    Buscar() {
      if (this.searchTerm.length > 2) {
        this.getMinutas(this.searchTerm)
      } else {
        if (this.searchTerm.length < 1) {
          this.getMinutas(null);
        }
      }
    }

    // openModalVer(minuta:MinutaI): void {
    //   const dialogRef = this.dialog.open(VerMinutaComponent, {
    //     width: '80%',
    //     data: { minuta }
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //   });
    // }

}
