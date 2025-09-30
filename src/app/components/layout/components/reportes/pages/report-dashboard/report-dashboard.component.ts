import { Component } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { LoaderComponent } from '../../../../../../helpers/components/loader/loader.component';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [ClassImports, MaterialComponents, LoaderComponent],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.css'
})
export class ReportDashboardComponent {

}
