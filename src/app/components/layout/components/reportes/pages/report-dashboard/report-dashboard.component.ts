import { Component } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { LoaderComponent } from '../../../../../../helpers/components/loader/loader.component';
import * as XLSX from 'xlsx';
import { ReportServices } from '../../services/reports.service';
import { systemInformationService } from '../../../../services/systemInformationService.service';
import { periodProcessGetI } from '../../../mantenimiento/mantenimiento-options/periodo-procesos/interface/periodo-procesos.interface';
import { PeriodsServices } from '../../../mantenimiento/mantenimiento-options/periodos/services/periodos.service';
import { PeriodI } from '../../../mantenimiento/mantenimiento-options/periodos/interfaces/periodo.interface';
import { SnackBars } from '../../../../services/snackBars.service';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [ClassImports, MaterialComponents, LoaderComponent],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.css'
})
export class ReportDashboardComponent {

  dataReport!: any
  activePeriod!: PeriodI

  public reports = [
    {
      name: 'Reporte de todos los acuerdos de desempeño',
      descripcion: 'Este reporte contiene la informacion de los Acuerdos de Desempeño elaborados durante todo el año.',
      logo: 'group',
      type: 1,
      diff: undefined
    },
    {
      name: 'Reporte de elaboración de acuerdo de desempeño',
      descripcion: 'Este reporte contiene la información de los Acuerdos elaborados en enero. Elaboración masiva de Acuerdos para todo el personal activo correspondiente al periodo enero - diciembre',
      logo: 'handshake',
      type: 1,
      diff: false
    },
    {
      name: 'Reporte de nuevos acuerdos de desempeño',
      descripcion: 'Este reporte contiene la informacion de los Acuerdos de Desempeño elaborados durante todo el año, luego de la elaboracion masiva de enero. Estos nuevos Acuerdos pueden deberse a cambios de cargo o nuevos ingresos.',
      logo: 'add',
      type: 1,
      diff: true
    },
    {
      name: 'Reporte de evaluación de competencias',
      descripcion: 'Este reporte contiene los resultados obtenidos en la evaluación de competencias del año.',
      logo: 'description',
      type: 2
    },
    {
      name: 'Reporte de evaluación de desempeño',
      descripcion: 'Este reporte contiene la calificación de los colaboradores evaluados en el mes de diciembre y durante todo el año',
      logo: 'done_outline',
      type: 2
    },
  ]

  constructor(
    private SnackBar: SnackBars,
    private reportsService: ReportServices,
    private periodService: PeriodsServices,
    public systemInformationSevice: systemInformationService,
  ) {
    this.getActivePeriod()
  }

  getActivePeriod() {
    this.periodService.getPeriodsActive()
      .subscribe((res: any) => {
        if (res.data != null) { this.activePeriod = res.data }
      })
  }

  exportExcel(name: string, stage: number, isDiff: boolean | undefined = undefined) {
    let data: any[] = []

    this.SnackBar.snackbarLouder(true)
    this.reportsService.getCreationAgreementReport(this.activePeriod.idPeriodo, stage, isDiff)
      .subscribe((res: any) => {
        res.servidoresConAcuerdo.map((detalles: any) => {
          data.push({
            Nombre: detalles.nombreApellido.toUpperCase(),
            Cedula: detalles.cedula,
            Cargo: detalles.cargo,
            Grupo_Ocupacional: detalles.grupoOcupacional,
            Unidad_Organizativa: detalles.unidadOrganizativa,
          })
        })

        data.reverse()

        const today = new Date();

        const date =
          today.getDate().toString().padStart(2, '0') + '/' +
          (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
          today.getFullYear();

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte Acuerdo')
        XLSX.writeFile(wb, name + ' ' + date + '.xlsx');

        this.SnackBar.snackbarLouder(false)
      })
  }
}
