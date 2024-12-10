import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AsignationGoalI } from '../interfaces/asignacion-metas.interface';

@Injectable({ providedIn: 'root' })

export class AsignationGoalsServices {

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

    public getAsignationGoals(page: number = 1, itemPerPage: number = 1000) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/AsignacionMeta?numeroPagina=${page}&tamanoPagina=${itemPerPage}`, this.header));
    }

    public postAsignationGoal(AsignationGoal: AsignationGoalI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/AsignacionMeta`, AsignationGoal, this.header))
    }

    public putAsignationGoal(AsignationGoal: AsignationGoalI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/AsignacionMeta`, AsignationGoal, this.header))
    }

    public deleteAsignationGoal(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/AsignacionMeta/${id}`, this.header))
    }
}