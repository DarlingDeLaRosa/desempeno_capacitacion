import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HerlperService } from '../../components/layout/services/appHelpers.service';
import { systemInformationService } from '../../components/layout/services/systemInformationService.service';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseI } from '../../components/interfaces/generalInteerfaces';
import { SnackBars } from '../../components/layout/services/snackBars.service';

@Injectable({ providedIn: 'root' })

export class IntranetServices {

    private token: string;
    // private tokenSession: string;
    private baseURL: string;
    private sigebiURL: string;
    private isfoplannerURL: string;
    private idSistema: number
    private headers: HttpHeaders;
    private headersIsfo: HttpHeaders;
    private header: { headers: HttpHeaders };
    private headerIsfop: {headers: HttpHeaders}
    // private headersSeccion: HttpHeaders;
    // private headerSeccion: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
        private SnackBar: SnackBars,
    ) {
        this.token = JSON.parse(sessionStorage.getItem("tokenIntranet")!);;
        // this.tokenSession = JSON.parse(sessionStorage.getItem("tokenIntranet")!);;
        this.baseURL = this.systemInformation.getIntranetURL;
        this.idSistema = this.systemInformation.getSistema;
        this.sigebiURL = this.systemInformation.getSigebiURL;
        this.isfoplannerURL = this.systemInformation.getIsfoplannerURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.headersIsfo = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
        this.header = { headers: this.headers };
        this.headerIsfop = { headers: this.headersIsfo };
        // this.headersSeccion = new HttpHeaders({ 'Authorization': this.tokenSession });
        // this.headerSeccion = { headers: this.headersSeccion };
    }

    // Peticion de Grupo ocupacional
    public getOcupationalGroup() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/get_grupo_ocupacional`, this.header));
    }

    // Peticion de cargos
    public getPositions() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallcargos`, this.header));
    }

    // Peticion de cargos
    public getPositionsByName(name: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallcargos/${name}`, this.header));
    }

    // Peticion de recintos
    public getLocations() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallrecintos`, this.header));
    }

    // Peticion de divisiones
    public getDivisions() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldivisiones`, this.header));
    }

    public getDivisionByName(division: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldivisionesfilter/${division}`, this.header));
    }

    // Peticion de departamentos
    public getDepartments() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldepartamento`, this.header));
    }

    public getDepartmentByName(deparment: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldepartamentofilter/${deparment}`, this.header));
    }

    // Peticion de direcciones
    public getDirections() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldireccion`, this.header));
    }

    public getDirectionByName(direction: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldireccionesfilter/${direction}`, this.header));
    }

    // Peticion de rectorias
    public getViceRectorates() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallvicerectorias`, this.header));
    }

    public getViceRectoratesByName(viceRectorate: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallvicerectoriasfilter/${viceRectorate}`, this.header));
    }

    // Peticion de Roles
    public getRoles() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Rol/getrolesbyidsistema/${this.idSistema}`, this.header));
    }

    // Peticion al API de SIGEBI, obtener catalogo de RNC de todo proveedor en RD
    public findProveedorByRNC(rnc: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.sigebiURL}/Proveedor/consultaproveedorbyrnc/${rnc}`, this.header))
    }

    public findProveedorByRS(rs: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.sigebiURL}/Proveedor/consultaproveedorbynombre_pagination/${rs}/1/25`, this.header))
    }

    // Metas Plan Operativo Anual
    public getGoalPOA(meta: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.isfoplannerURL}/IndicadoresGestion?CurrentPage=1&PageSize=10&buscar=${meta}`, this.headerIsfop));
    }

    //Petición de Personas a Intranet
    public findPeopleByUser(user: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/filter/${user}`, this.header))
    }

    public getPeopleById(id: number) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/${id}`, this.header))
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
