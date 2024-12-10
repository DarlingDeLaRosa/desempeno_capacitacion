import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HerlperService } from '../../components/layout/services/appHelpers.service';
import { systemInformationService } from '../../components/layout/services/systemInformationService.service';

@Injectable({ providedIn: 'root' })

export class IntranetServices {

    private token: string;
    private baseURL: string;
    private sigebiURL: string;
    private isfoplannerURL: string;
    private headers: HttpHeaders;
    private idSistema: number
    private header: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
    ) {
        this.token = this.systemInformation.getToken;
        this.baseURL = this.systemInformation.getIntranetURL;
        this.idSistema = this.systemInformation.getSistema;
        this.sigebiURL = this.systemInformation.getSigebiURL;
        this.isfoplannerURL = this.systemInformation.getIsfoplannerURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
    }

    // Peticion de Grupo ocupacional
    public getOcupationalGroup() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/get_grupo_ocupacional`, this.header));
    }

    // Peticion de cargos
    public getPositions() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallcargos`, this.header));
    }

    // Peticion de recintos
    public getLocations() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallrecintos`, this.header));
    }

    // Peticion de divisiones
    public getDivisions() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldivisiones`, this.header));
    }

    // Peticion de departamentos
    public getDepartments() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldepartamento`, this.header));
    }

    // Peticion de direcciones
    public getDirections() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldireccion`, this.header));
    }

    // Peticion de rectorias
    public getViceRectorates() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallvicerectorias`, this.header));
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
        return this.appHelpers.handleRequest(() => this.http.get(`${this.isfoplannerURL}/IndicadoresGestion?CurrentPage=1&PageSize=20&buscar=${meta}`, this.header));
    }

    //Petición de Personas a Intranet
    public findPeopleByUser(user: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/filter/${user}`, this.header))
    }

    public getPeopleById(id: number) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/${id}`, this.header))
    }

   //peticion para el loguin a un sistema de intraanet
   public postUserLogin(crendenciales: any) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/User/post/login`, crendenciales , this.header))
    }
}
