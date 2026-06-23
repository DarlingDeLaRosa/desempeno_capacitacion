import { Component } from '@angular/core';
import { ClassImports } from '../../class.components';

@Component({
  selector: 'app-loader-stepper-box',
  standalone: true,
  imports: [ClassImports],
  templateUrl: './loader-stepper-box.component.html',
  styleUrls: ['./loader-stepper-box.component.css', '../loader/loader.component.css']
})
export class LoaderStepperBoxComponent {

}
