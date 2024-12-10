import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AsignationCompetencyI } from '../interfaces/asignacion-competencias.interface';

@Injectable({ providedIn: 'root' })

export class AsignationCompetenciesServices {

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
        this.baseURL = this.systemInformation.getURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
    }

    public getAsignationCompetencies(page: number = 1, itemPerPage: number = 1000) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/AsignacionCompetencia?numeroPagina=${page}&tamanoPagina=${itemPerPage}`, this.header));
    }

    public getAsignationCompetencyByIdOcuGroup(ocupationalGroupId: number) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/AsignacionCompetencia/por-grupo-ocupacional/${ocupationalGroupId}`, this.header));
    }

    public postAsignationCompetency( AsignationCompetency : AsignationCompetencyI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/AsignacionCompetencia`, AsignationCompetency , this.header))
    }

    public putAsignationCompetency( AsignationCompetency : AsignationCompetencyI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/AsignacionCompetencia`, AsignationCompetency , this.header))
    }

    public deleteAsignationCompetency(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/AsignacionCompetencia/${id}`, this.header))
    }
}