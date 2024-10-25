import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { CompetencyI } from '../interfaces/competencias.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class CompetencyServices {

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

    public getCompetency() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Competencia`, this.header));
    }

    public getCompetencyById(competencyId: number) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Competencia/${competencyId}`, this.header));
    }

    public postCompetency(competency: CompetencyI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Competencia`, competency, this.header))
    }

    public putCompetency(competency: CompetencyI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Competencia`, competency, this.header))
    }

    public deleteCompetency(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Competencia/${id}`, this.header))
    }
}