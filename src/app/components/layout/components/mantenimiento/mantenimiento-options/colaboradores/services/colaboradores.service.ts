import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { CollaboratorsI } from '../interfaces/colaboradores.interface';

@Injectable({ providedIn: 'root' })

export class CollaboratorServices {

    private token: string;
    private baseURL: string;
    private systemId: number;
    private headers: HttpHeaders;
    private userLogged: number | null;
    private header: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
    ) {
        this.token = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
        this.systemId = this.systemInformation.getSistema;
        this.baseURL = this.systemInformation.getIntranetURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
        this.userLogged = Number(systemInformation.localUser.IdRecinto)
    }

    public getCollaborators(page: number = 1, itemPerPage: number = 10, name: string = '') {
        let recinto: any = null
        
        if (this.userLogged != 7) { recinto = this.userLogged }
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/User/getusuariossistema/${this.systemId}?filter=${name}&recinto=${recinto ?? ''}&currentPage=${page}&totalItem=${itemPerPage}`, this.header));
    }

    public postCollaborator( collaborator : CollaboratorsI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/User`, collaborator, this.header))
    }

    public putCollaborator( collaborator : CollaboratorsI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/User`, collaborator , this.header))
    }

    public deleteCollaborator(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/User/${id}`, this.header))
    }

    public getCollaboratorByDNI(identification: string) { //page: number = 1, itemPerPage: number = 1000
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/User/getusuario_by_cedula/${this.systemId}/${identification}`, this.header));
    }

    // Get de personas
    public getPersonByID(id: number) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/${id}`, this.header));
    }

    public putChangePersonStatus(statusObj: {idPersona: number, idEstado: number}) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Persona/change_status`, statusObj, this.header));
    }

    public getPersonFilterByName(name: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona/filter/${name}`, this.header));
    }
}
