import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { CollaboratorsI } from '../interfaces/colaboradores.interface';

@Injectable({ providedIn: 'root' })

export class CollaboratorServices {

    private token: string;
    private baseURL: string;
    private headers: HttpHeaders;
    private header: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
    ) {
        this.token = this.systemInformation.getToken;
        this.baseURL = this.systemInformation.getIntranetURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
    }

    public getCollaborators() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Persona?numeroPagina=1&tamanoPagina=10`, this.header));
    }
    
    public postCollaborator( collaborator : CollaboratorsI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Persona`, collaborator, this.header))
    }

    public putCollaborator( collaborator : CollaboratorsI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Persona`, collaborator , this.header))
    }

    public deleteCollaborator(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Persona/${id}`, this.header))
    }

}