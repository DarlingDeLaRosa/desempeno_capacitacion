import { Component } from '@angular/core';
import { MaterialComponents } from '../../../helpers/material.components'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialComponents,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  seePass: string = 'password'
  
  // Función para ver o bloquear constraseña 
  togglePasswordVisibility() {
    this.seePass = (this.seePass === 'password') ? 'text' : 'password'
  }
  
}
