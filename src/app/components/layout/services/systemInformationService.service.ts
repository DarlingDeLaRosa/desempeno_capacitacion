import { Injectable, computed, signal } from '@angular/core';
import { PeriodI } from '../components/mantenimiento/mantenimiento-options/periodos/interfaces/periodo.interface';
import { HttpClient } from '@angular/common/http';
import { PersonSystemI, RolI } from '../components/mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { periodInitialState, personSystemInitialState, rolInitialState } from './initialStates';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: "root" })

export class systemInformationService {

  public idSystem: number = 31
  public userRol = signal<RolI>(rolInitialState);
  public period = signal<PeriodI>(periodInitialState);
  public userSystem = signal<PersonSystemI>(personSystemInitialState);

  public TokenIntranet: string = "";
  private userToken: string = "";

  private UrlIntranet: string = 'https://intranet.isfodosu.edu.do/api'
  private URLDevelopment: string = 'http://172.25.0.12:4005/api'
  // private URLDevelopment: string = 'https://acuerdos.isfodosu.edu.do/api'
  // private URLDevelopment: string = 'http://172.25.0.12:4005'
  private UrlSIGEBI: string = 'https://sigebi.isfodosu.edu.do/sigebiapi'
  private UrlIsfoplanner: string = 'https://isfoplanner.isfodosu.edu.do/api'

  private systemcredentials: any
  public activeRol = computed(() => this.userRol())
  public activePeriod = computed(() => this.period())
  public currentUserSystem = computed(() => this.userSystem())

  //Roberto
  // private userToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyb2JlcnRvLm1heWkiLCJqdGkiOiI1OTUwMTQ3Ny0zOTVhLTRmYWEtOTAzNC1kZjBiMDZlYmFkNzkiLCJJZCI6IjYiLCJGaXJzdG5hbWUiOiJSb2JlcnRvIiwiTGFzdG5hbWUiOiJNYXlpIiwiVXNlcm5hbWUiOiJyb2JlcnRvLm1heWkiLCJQb3NpdGlvbiI6IlByb2dyYW1hZG9yKGEpIGRlIFNvZnR3YXJlIiwiVW5pZGFkIjoiRElWSVNJT04gREUgREVTQVJST0xMTyBFIElNUExFTUVOVEFDSU9OIERFIFNJU1RFTUFTIFRJQyIsIklkUmVjaW50byI6IjciLCJSZWNpbnRvU2lnbGEiOiJSRUMiLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsImlkU2lzdGVtYSI6IjEiLCJpZFBlcnNvbmEiOiI5IiwiU3VwZXJ2aXNvciI6IlRydWUiLCJJZERlcGFydGFtZW50byI6IjE5IiwiZXhwIjoxNzMzMTUyNjg5LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA3NSJ9.BZmn0czXdgQpIqt98z2GZLJNQZD5pzfkpJvSdRDqdxY"

  //Joel
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2VsLmVuY2FybmFjaW9uIiwianRpIjoiMzc5NzEyY2YtNjExNi00NzcwLTlhZWUtMDcyZGVjZWNhZTdhIiwiSWQiOiIyIiwiRmlyc3RuYW1lIjoiSm9lbCIsIkxhc3RuYW1lIjoiRW5jYXJuYWNpb24iLCJVc2VybmFtZSI6ImpvZWwuZW5jYXJuYWNpb24iLCJQb3NpdGlvbiI6IkFkbWluaXN0cmFkb3IoYSkgZGUgQmFzZSBEZSBEYXRvcyIsIlVuaWRhZCI6IkRJVklTSU9OIERFIERFU0FSUk9MTE8gRSBJTVBMRU1FTlRBQ0lPTiBERSBTSVNURU1BUyBUSUMiLCJJZFJlY2ludG8iOiI3IiwiUmVjaW50b1NpZ2xhIjoiUkVDIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpZFNpc3RlbWEiOiIxIiwiaWRQZXJzb25hIjoiNCIsIlN1cGVydmlzb3IiOiJGYWxzZSIsIklkRGVwYXJ0YW1lbnRvIjoiMTkiLCJleHAiOjE3MzQ1NTU1NzEsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNzUiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1In0.-hYiliqTxp8Hn7YTXkEpLHz9ABOYoBEg-ief7I1dbrI

  //Francisco
  // private userToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY2lzY29qLm1lZGluYSIsImp0aSI6IjZkOTEwYjk4LTQ5ZGItNDc1Yi1hNTc3LTU5YmY5ZjFjMDM1MCIsIklkIjoiNSIsIkZpcnN0bmFtZSI6IkZyYW5jaXNjbyBKYXZpZXIiLCJMYXN0bmFtZSI6Ik1lZGluYSBNYXRvcyIsIlVzZXJuYW1lIjoiZnJhbmNpc2Nvai5tZWRpbmEiLCJQb3NpdGlvbiI6IkFkbWluaXN0cmFkb3IoYSkgZGUgQmFzZSBEZSBEYXRvcyIsIlVuaWRhZCI6IkRJVklTSU9OIERFIERFU0FSUk9MTE8gRSBJTVBMRU1FTlRBQ0lPTiBERSBTSVNURU1BUyBUSUMiLCJJZFJlY2ludG8iOiI3IiwiUmVjaW50b1NpZ2xhIjoiUkVDIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpZFNpc3RlbWEiOiIxIiwiaWRQZXJzb25hIjoiOCIsIlN1cGVydmlzb3IiOiJGYWxzZSIsIklkRGVwYXJ0YW1lbnRvIjoiMTkiLCJleHAiOjE3MzMxNTM4OTEsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNzUiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1In0.P5v0AWAHDj3mCkcrCeb3awqaPVIoP5y0aXC6BIQ8ADc"

  constructor(private http: HttpClient) {
    this.checkToken().then(() => {
      this.makeRequests();
    });
  }

  private checkToken(): Promise<void> {
    return new Promise((resolve) => {
      this.TokenIntranet = sessionStorage.getItem("tokenIntranet") ?? '';
      if (this.TokenIntranet) {
        this.systemcredentials = {
          token: JSON.parse(this.TokenIntranet),
          idSistema: this.idSystem,
        };
        resolve();
      } else {
        // Contador para las revisiones
        // let attempts = 0;
        // Esperar a que se configure el token manualmente
        const interval = setInterval(() => {
          // attempts++;

          this.TokenIntranet = sessionStorage.getItem("tokenIntranet") ?? '';
          if (this.TokenIntranet) {
            clearInterval(interval);
            this.systemcredentials = {
              token: JSON.parse(this.TokenIntranet),
              idSistema: this.idSystem,
            };
            resolve();
          }
        }, 100); 
      }
    });
  }


  public makeRequests(): void {
    this.http
      .get(`${this.URLDevelopment}/Periodo/get_periodo_activo`)
      .subscribe((res: any) => {
        this.period.set(res.data);
      });

    this.http
      .post(`${this.UrlIntranet}/User/post/login`, this.systemcredentials)
      .subscribe((res: any) => {
        if (res.data) {
          this.userRol.set(res.data.rol);
          this.userSystem.set(res.data);
        }
      });
  }


  // constructor(private http: HttpClient) {
  //   this.initializeToken().then(() => {
  //     this.makeRequests();
  //   });
  // }

  // private async initializeToken(): Promise<void> {
  //   if (!sessionStorage.getItem("tokenIntranet")) {
  //     // Si el token no existe, realiza una solicitud o acción para obtenerlo
  //     const credentials = { username: "user", password: "pass" }; // Ejemplo de credenciales
  //     const tokenResponse: any = await this.http
  //       .post(`${this.UrlIntranet}/auth/login`, credentials)
  //       .toPromise();

  //     sessionStorage.setItem("tokenIntranet", JSON.stringify(tokenResponse.token));
  //   }

  //   this.TokenIntranet = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
  //   this.systemcredentials = {
  //     token: this.TokenIntranet,
  //     idSistema: this.idSystem,
  //   };
  // }

  // private makeRequests(): void {
  //   this.http
  //     .get(`${this.URLDevelopment}/Periodo/get_periodo_activo`)
  //     .subscribe((res: any) => {
  //       this.period.set(res.data);
  //     });

  //   this.http
  //     .post(`${this.UrlIntranet}/User/post/login`, this.systemcredentials)
  //     .subscribe((res: any) => {
  //       if (res.data) {
  //         this.userRol.set(res.data.rol);
  //         this.userSystem.set(res.data);
  //       }
  //     });
  // }


  // constructor(private http: HttpClient) {

  //   this.userToken = JSON.parse(sessionStorage.getItem("userToken")!);
  //   this.TokenIntranet = JSON.parse(sessionStorage.getItem("tokenIntranet")!);

  //   this.systemcredentials = { token: this.TokenIntranet, idSistema: this.idSystem }

  //   this.http.get(`${this.URLDevelopment}/Periodo/get_periodo_activo`).subscribe((res: any) => {
  //     this.period.set(res.data);
  //   });

  //   this.http.post(`${this.UrlIntranet}/User/post/login`, this.systemcredentials).subscribe((res: any) => {
  //     if (res.data) {
  //       this.userRol.set(res.data.rol)
  //       this.userSystem.set(res.data)
  //     }
  //   });
  // }

  // laPrueba(auth: {token:string, idSistema: number}){

  //   this.http.get(`${this.URLDevelopment}/Periodo/get_periodo_activo`).subscribe((res: any) => {
  //     this.period.set(res.data);
  //   });

  //   this.http.post(`${this.UrlIntranet}/User/post/login`, auth).subscribe((res: any) => {
  //     if (res.data) {
  //       this.userRol.set(res.data.rol)
  //       this.userSystem.set(res.data)
  //     }
  //   });
  // }

  get getToken(): string { return this.userToken }
  get getSistema(): number { return this.idSystem }
  get getURL(): string { return this.URLDevelopment }
  get getSigebiURL(): string { return this.UrlSIGEBI }
  get getIntranetURL(): string { return this.UrlIntranet }
  get getIsfoplannerURL(): string { return this.UrlIsfoplanner }

  setTokenIntranet() {
    this.TokenIntranet = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
  };

  // setUserToken() {
  //   this.userToken = JSON.parse(sessionStorage.getItem("userToken")!);
  // };

  setUserToken(token: string) {
    this.userToken = token;
  }



  // Datos(){
  //   this.http.get(`${this.URLDevelopment}/Periodo/get_periodo_activo`).subscribe((res: any) => {
  //     this.period.set(res.data);
  //   });


  //   this.http.post(`${this.UrlIntranet}/User/post/login`, this.systemcredentials).subscribe((res: any) => {
  //     if (res.data) {
  //       this.userRol.set(res.data.rol)
  //       this.userSystem.set(res.data)
  //     }
  //   });
  // }


  //Este metodo decodifica el token y lo guarda en el localStorage
  // get localUser(): any {
  //   const tokenUser = JSON.parse(sessionStorage.getItem("userToken")!);
  //   try {
  //     const payloadPart = tokenUser.split('.')[1];
  //     const decodedPayload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
  //     if (decodedPayload) {
  //       return decodedPayload;
  //     } else {
  //       return null;
  //     }
  //   } catch (error) { console.error('Error al decodificar el token:', error) }
  // }


  get localUser(): any {
    const tokenUser = sessionStorage.getItem("userToken");
    if (!tokenUser) return null;
    return jwtDecode(tokenUser);
  }

  getMonths(month: number): string {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[month]
  }


  logout() {
    // Eliminar la información del usuario
    sessionStorage.clear();
  }
}
