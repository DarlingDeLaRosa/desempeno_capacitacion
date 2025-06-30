import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HerlperService } from '../../components/layout/services/appHelpers.service';
import { systemInformationService } from '../../components/layout/services/systemInformationService.service';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseI } from '../../components/interfaces/generalInteerfaces';
import { SnackBars } from '../../components/layout/services/snackBars.service';

@Injectable({ providedIn: 'root' })

export class IntranetServices {
  
    private baseURL: string;
    private sigebiURL: string;
    private isfoplannerURL: string;
    private idSistema: number

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
        private SnackBar: SnackBars,
    ) {
        this.baseURL = this.systemInformation.getIntranetURL;
        this.idSistema = this.systemInformation.getSistema;
        this.sigebiURL = this.systemInformation.getSigebiURL;
        this.isfoplannerURL = this.systemInformation.getIsfoplannerURL;
    }

    //Metodo para para traer el token y construir el Authorization
    getHeaders(): HttpHeaders {
        const token = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
        if (token) {
          return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        } else {
          return new HttpHeaders();
        }
      }

    // Peticion de Grupo ocupacional
    public getOcupationalGroup() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/get_grupo_ocupacional`, { headers }));
    }

    // Peticion de cargos
    public getPositions() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallcargos`, { headers }));
    }

    // Peticion de cargos
    public getPositionsByName(name: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallcargos/${name}`,{ headers }));
    }

    // Peticion de recintos
    public getLocations() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallrecintos`, { headers }));
    }

    // Peticion de divisiones
    public getDivisions() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldivisiones`, { headers }));
    }

    public getDivisionByName(division: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldivisionesfilter/${division}`,{ headers }));
    }

    // Peticion de departamentos
    public getDepartments() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldepartamento`,{ headers }));
    }

    public getDepartmentByName(deparment: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldepartamentofilter/${deparment}`,{ headers }));
    }

    // Peticion de direcciones
    public getDirections() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldireccion`, { headers }));
    }

    public getDirectionByName(direction: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldireccionesfilter/${direction}`, { headers }));
    }

    // Peticion de rectorias
    public getViceRectorates() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallvicerectorias`,{ headers }));
    }

    public getViceRectoratesByName(viceRectorate: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallvicerectoriasfilter/${viceRectorate}`, { headers }));
    }

    // Peticion de Roles
    public getRoles() {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Rol/getrolesbyidsistema/${this.idSistema}`, { headers }));
    }

    // Peticion al API de SIGEBI, obtener catalogo de RNC de todo proveedor en RD
    public findProveedorByRNC(rnc: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.sigebiURL}/Proveedor/consultaproveedorbyrnc/${rnc}`, { headers }))
    }

    public findProveedorByRS(rs: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.sigebiURL}/Proveedor/consultaproveedorbynombre_pagination/${rs}/1/25`, { headers }))
    }

    // Metas Plan Operativo Anual
    public getGoalPOA(meta: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.isfoplannerURL}/IndicadoresGestion?CurrentPage=1&PageSize=10&buscar=${meta}`,  { headers }));
    }

    //Petición de Personas a Intranet
    public findPeopleByUser(user: string) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/filter/${user}`,{ headers }))
    }

    public getPeopleById(id: number) {
        const headers = this.getHeaders();
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/${id}`, { headers }))
    }

    // peticion para el loguin a un sistema de intraanet
    //  public postUserLogin(crendenciales: any) {
    //   return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/User/post/login`, crendenciales , this.header))
    // }

    postAutorizacion(auth: any): Observable<ResponseI> {
        return this.http.post<ResponseI>(`${this.baseURL}/User/post/login`, auth)
            .pipe(catchError((error) => {
                this.authError();
                this.SnackBar.snackbarError('El usuario no está registrado en este sistema');
                setTimeout(() => {
                    window.location.href = 'https://intranet.isfodosu.edu.do/#/login';
                }, 5000);
                return throwError(error)
            }))
    }

    authError() {
        sessionStorage.clear();
    }
}
