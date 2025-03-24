import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../helpers/material.components'
import { ActivatedRoute, Router } from '@angular/router';
import { systemInformationService } from '../../layout/services/systemInformationService.service';
import { IntranetServices } from '../../../helpers/intranet/intranet.service';
import { ClassImports } from '../../../helpers/class.components';
import { SnackBars } from '../../layout/services/snackBars.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  auth: any;
  token: string | null = ''
  tokenSystem: string = ''
  isLoading: boolean = false

  constructor(
    private router: Router,
    private SnackBar: SnackBars,
    private route: ActivatedRoute,
    private intranService: IntranetServices,
    private systeminformation: systemInformationService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');

      if (this.token) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { token: null },
          queryParamsHandling: 'merge',
        });
        sessionStorage.setItem("tokenIntranet", JSON.stringify(this.token));
        this.authGenericService();
      }
    });
  }

  authGenericService() {
    // const token = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
    this.auth = {
      token: JSON.parse(sessionStorage.getItem("tokenIntranet")!),
      idSistema: this.systeminformation.idSystem
    };

    this.intranService.postAutorizacion(this.auth).subscribe((resp: any) => {
      if (resp.success === true) {
        this.systeminformation.userRol.set(resp.data.rol)
        this.systeminformation.userSystem.set(resp.data)
        this.tokenSystem = resp.token;
        // this.systeminformation.setUserToken(this.tokenSystem)
        sessionStorage.setItem("userToken", JSON.stringify(this.tokenSystem));
        this.isLoading = false;
        this.router.navigate(['/layout/acuerdos']);
        // this.systeminformation.Datos()
        // ('Bienvenido');
        // this.systeminformation.laPrueba(this.auth)
      } else {
        this.SnackBar.snackbarError('Usuario no está registado en el sistema.', 4000)
        setTimeout(() => {
          window.location.href = 'https://intranet.isfodosu.edu.do'
        }, 4000);
      }
    })
  }
}
