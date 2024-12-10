import { Injectable, Signal, computed, signal } from '@angular/core';
import { PeriodI } from '../components/mantenimiento/mantenimiento-options/periodos/interfaces/periodo.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { PeriodsServices } from '../components/mantenimiento/mantenimiento-options/periodos/services/periodos.service';
import { HttpClient } from '@angular/common/http';
import { PersonSystemI, RolI } from '../components/mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { periodInitialState, personSystemInitialState, rolInitialState } from './initialStates';

@Injectable({ providedIn: "root" })

export class systemInformationService {

  private idSystem: number = 31
  private userRol = signal<RolI>(rolInitialState);
  private period = signal<PeriodI>(periodInitialState);
  private userSystem = signal<PersonSystemI>(personSystemInitialState);

  private systemToken: string = '';
  private URLProduction: string = '';
  private UrlIntranet: string = 'http://172.25.0.12:3003'
  private URLDevelopment: string = 'http://172.25.0.12:4005'
  private UrlSIGEBI: string = 'https://sigebi.isfodosu.edu.do/sigebiapi'
  private UrlIsfoplanner: string = 'https://isfoplanner.isfodosu.edu.do/api'

  //Francisco
  private userToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY2lzY29qLm1lZGluYSIsImp0aSI6IjhiY2EyYTBmLWZkOTEtNDhiYi04MDU2LWI0OWE4Zjc0NDM5MCIsIklkIjoiNSIsIkZpcnN0bmFtZSI6IkZyYW5jaXNjbyBKYXZpZXIiLCJMYXN0bmFtZSI6Ik1lZGluYSBNYXRvcyIsIlVzZXJuYW1lIjoiZnJhbmNpc2Nvai5tZWRpbmEiLCJQb3NpdGlvbiI6IkFkbWluaXN0cmFkb3IoYSkgZGUgQmFzZSBEZSBEYXRvcyIsIlVuaWRhZCI6IkRJVklTSU9OIERFIERFU0FSUk9MTE8gRSBJTVBMRU1FTlRBQ0lPTiBERSBTSVNURU1BUyBUSUMiLCJJZFJlY2ludG8iOiI3IiwiUmVjaW50b1NpZ2xhIjoiUkVDIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpZFNpc3RlbWEiOiIxIiwiaWRQZXJzb25hIjoiOCIsIlN1cGVydmlzb3IiOiJGYWxzZSIsIklkRGVwYXJ0YW1lbnRvIjoiMTkiLCJleHAiOjE3MzI1NjQxMzcsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNzUiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1In0.Z-JE84RdjSTlg6cfup-v5kdysYH4y6dXrnPPn9qmaqU"

  //Roberto
  // private userToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyb2JlcnRvLm1heWkiLCJqdGkiOiI1OTUwMTQ3Ny0zOTVhLTRmYWEtOTAzNC1kZjBiMDZlYmFkNzkiLCJJZCI6IjYiLCJGaXJzdG5hbWUiOiJSb2JlcnRvIiwiTGFzdG5hbWUiOiJNYXlpIiwiVXNlcm5hbWUiOiJyb2JlcnRvLm1heWkiLCJQb3NpdGlvbiI6IlByb2dyYW1hZG9yKGEpIGRlIFNvZnR3YXJlIiwiVW5pZGFkIjoiRElWSVNJT04gREUgREVTQVJST0xMTyBFIElNUExFTUVOVEFDSU9OIERFIFNJU1RFTUFTIFRJQyIsIklkUmVjaW50byI6IjciLCJSZWNpbnRvU2lnbGEiOiJSRUMiLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsImlkU2lzdGVtYSI6IjEiLCJpZFBlcnNvbmEiOiI5IiwiU3VwZXJ2aXNvciI6IlRydWUiLCJJZERlcGFydGFtZW50byI6IjE5IiwiZXhwIjoxNzMzMTUyNjg5LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA3NSJ9.BZmn0czXdgQpIqt98z2GZLJNQZD5pzfkpJvSdRDqdxY"


  // private userToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY2lzY29qLm1lZGluYSIsImp0aSI6IjZkOTEwYjk4LTQ5ZGItNDc1Yi1hNTc3LTU5YmY5ZjFjMDM1MCIsIklkIjoiNSIsIkZpcnN0bmFtZSI6IkZyYW5jaXNjbyBKYXZpZXIiLCJMYXN0bmFtZSI6Ik1lZGluYSBNYXRvcyIsIlVzZXJuYW1lIjoiZnJhbmNpc2Nvai5tZWRpbmEiLCJQb3NpdGlvbiI6IkFkbWluaXN0cmFkb3IoYSkgZGUgQmFzZSBEZSBEYXRvcyIsIlVuaWRhZCI6IkRJVklTSU9OIERFIERFU0FSUk9MTE8gRSBJTVBMRU1FTlRBQ0lPTiBERSBTSVNURU1BUyBUSUMiLCJJZFJlY2ludG8iOiI3IiwiUmVjaW50b1NpZ2xhIjoiUkVDIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpZFNpc3RlbWEiOiIxIiwiaWRQZXJzb25hIjoiOCIsIlN1cGVydmlzb3IiOiJGYWxzZSIsIklkRGVwYXJ0YW1lbnRvIjoiMTkiLCJleHAiOjE3MzMxNTM4OTEsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNzUiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1In0.P5v0AWAHDj3mCkcrCeb3awqaPVIoP5y0aXC6BIQ8ADc"
  private systemcredentials = { token: this.userToken, idSistema: this.idSystem }

  public activeRol = computed(() => this.userRol())
  public currentUserSystem = computed(() => this.userSystem())
  public activePeriod = computed(() => this.period())

  constructor(private http: HttpClient) {
    this.http.get(`${this.URLDevelopment}/Periodo`).subscribe((res: any) => {
      this.period.set(res.data[0]);
    });

    this.http.post(`${this.UrlIntranet}/User/post/login`, this.systemcredentials).subscribe((res: any) => {
      if (res.data) {
        this.userRol.set(res.data.rol)
        this.userSystem.set(res.data)
      }
    });
  }

  get getToken(): string { return this.userToken }
  get getSistema(): number { return this.idSystem }
  get getURL(): string { return this.URLDevelopment }
  get getSigebiURL(): string { return this.UrlSIGEBI }
  get getIntranetURL(): string { return this.UrlIntranet }
  get getIsfoplannerURL(): string { return this.UrlIsfoplanner }
  get getSystemToken(): string { return this.systemToken }


  set setUserToken(token: string) {
    let tokenT: string = token.replace(/^"(.*)"$/, '$1');
    // localStorage.setItem('token', tokenT);
    this.userToken = `Bearer ${tokenT}`
  };

  //Este metodo decodifica el token y lo guarda en el localStorage
  get localUser(): any {
    try {
      const payloadPart = this.userToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      if (decodedPayload) {
        return decodedPayload;
      } else {
        return null;
      }
    } catch (error) { console.error('Error al decodificar el token:', error) }
  }

  getMonths(month: number): string{
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[month]
  }
}
