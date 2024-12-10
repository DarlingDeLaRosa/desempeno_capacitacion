import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { systemInformationService } from '../components/layout/services/systemInformationService.service';
import { loggedUserI } from '../helpers/intranet/intranet.interface';


@Injectable({
  providedIn: 'root'
})
export class SupervisorGuard implements CanActivate {

  usuarioActual!: loggedUserI

  constructor(
    private InformationService: systemInformationService,
     private router: Router)
      {
      this.usuarioActual = InformationService.localUser;
     }

  canActivate(): boolean {
    // Verifica si el usuario es supervisor y lo deja pasar a la ruta, sino lo manda al tablero de cursos
    if (this.usuarioActual && this.usuarioActual.Supervisor == 'True') {
      return true;
    } else {
      this.router.navigate(['/layout/cursos']);
      return false;
    }
  }
}
