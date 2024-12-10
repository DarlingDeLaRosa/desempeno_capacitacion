import { LoaderService } from './../../service/loader.service';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialComponents } from '../../material.components';
import { ClassImports } from '../../class.components';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MaterialComponents,ClassImports],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent  implements OnInit{
  isLoading = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
