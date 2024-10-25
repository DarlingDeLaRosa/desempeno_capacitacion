import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { systemInformationService } from './components/layout/services/systemInformationService.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'desempeño y capacitación';

  constructor(
    private systemInformation: systemInformationService
  ) { }

  ngOnInit(): void {
    this.systemInformation.decodeAndStoreToken()
  }
}
