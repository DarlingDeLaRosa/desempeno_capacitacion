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
  // private URLDevelopment: string = 'https://preacuerdos.isfodosu.edu.do/api'


  private UrlSIGEBI: string = 'https://sigebi.isfodosu.edu.do/sigebiapi'
  private UrlIsfoplanner: string = 'https://isfoplanner.isfodosu.edu.do/api'

  private systemcredentials: any
  public activeRol = computed(() => this.userRol())
  public activePeriod = computed(() => this.period())
  public currentUserSystem = computed(() => this.userSystem())


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
        const interval = setInterval(() => {

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

  get getToken(): string { return this.userToken }
  get getSistema(): number { return this.idSystem }
  get getURL(): string { return this.URLDevelopment }
  get getSigebiURL(): string { return this.UrlSIGEBI }
  get getIntranetURL(): string { return this.UrlIntranet }
  get getIsfoplannerURL(): string { return this.UrlIsfoplanner }

  setTokenIntranet() {
    this.TokenIntranet = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
  };

  setUserToken(token: string) {
    this.userToken = token;
  }

  get localUser(): any {
    const tokenUser = sessionStorage.getItem("userToken");
    if (!tokenUser) return null;
    // console.log(jwtDecode(tokenUser));
    return jwtDecode(tokenUser);
  }

  get LocalUserIntranet(): any {
    const tokenUser2 = sessionStorage.getItem("tokenIntranet");
    if (!tokenUser2) return null;

    return jwtDecode(tokenUser2);
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
