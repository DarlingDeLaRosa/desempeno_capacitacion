import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../helpers/material.components'
import { ActivatedRoute, Router } from '@angular/router';
import { systemInformationService } from '../../layout/services/systemInformationService.service';
import { IntranetServices } from '../../../helpers/intranet/intranet.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialComponents,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  isLoading:boolean = false
  token:string = ''
  tokenSystem: string = ''

  constructor(
    private  router: Router,
    private route: ActivatedRoute,
    private systeminformation:systemInformationService,
    private intranService:IntranetServices
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      setTimeout(() => {
      }, 2000);
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

  authGenericService(){
    const token = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
    const auth = {
      token: token,
      idSistema: this.systeminformation.idSystem
    };
      this.intranService.postAutorizacion(auth).subscribe((resp: any) => {
        if (resp.success === true) {
          this.systeminformation.userRol.set(resp.data.rol)
          this.systeminformation.userSystem.set(resp.data)
          this.tokenSystem= resp.token;
          // this.systeminformation.setUserToken(this.tokenSystem)
          sessionStorage.setItem("userToken", JSON.stringify(this.tokenSystem));
          this.isLoading = false;
          this.router.navigate(['/layout/acuerdos']);
          // this.systeminformation.Datos()
          ('Bienvenido');
        }else {
          console.log('Este usuario no está registado en el sistema');
        }
      })
  }

}
