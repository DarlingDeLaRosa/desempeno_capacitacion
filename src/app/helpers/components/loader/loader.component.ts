import { LoaderService } from './../../service/loader.service';
import { Component, Input, OnInit, input } from '@angular/core';
import { MaterialComponents } from '../../material.components';
import { ClassImports } from '../../class.components';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent  implements OnInit {

  type = input<number>()
  supp = input<number>()

  quatityRow: number[] = [0,1,2]
  quatityColunm: number[] = [0,1,2,3]
  
  isLoading = false;
  
  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    if (this.type() != undefined || this.supp() != undefined ) {
      this.quatityRow = [0]
      this.quatityColunm = [0]
    }
  
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
