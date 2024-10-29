import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HerlperService } from '../../components/layout/services/appHelpers.service';
import { systemInformationService } from '../../components/layout/services/systemInformationService.service';

@Injectable({ providedIn: 'root' })

export class IntranetServices {

    private token: string;
    private baseURL: string;
    private sigebiURL: string;
    private headers: HttpHeaders;
    private header: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
    ) {
        this.token = this.systemInformation.getToken;
        this.baseURL = this.systemInformation.getIntranetURL;
        this.sigebiURL = this.systemInformation.getSigebiURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
    }

    public getOcupationalGroup() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/get_grupo_ocupacional`, this.header));
    }

    public getPositions() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallcargos`, this.header));
    }

    public getLocations() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallrecintos`, this.header));
    }

    public getDivisions() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldivisiones`, this.header));
    }

    public getDepartments() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldepartamento`, this.header));
    }

    public getDirections() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getalldireccion`, this.header));
    }

    public getViceRectorates() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/GenericService/getallvicerectorias`, this.header));
    }

    // Peticion al API de SIGEBI, obtener catalogo de RNC de todo proveedor en RD

    public findProveedorByRNC(rnc: string) {
        return this.appHelpers.handleRequest(()=> this.http.get(`${this.sigebiURL}/Proveedor/consultaproveedorbyrnc/${rnc}`, this.header))
    }

    public findProveedorByRS(rs: string) {
        return this.appHelpers.handleRequest(()=> this.http.get(`${this.sigebiURL}/Proveedor/consultaproveedorbynombre_pagination/${rs}/1/25`, this.header))
    }
}