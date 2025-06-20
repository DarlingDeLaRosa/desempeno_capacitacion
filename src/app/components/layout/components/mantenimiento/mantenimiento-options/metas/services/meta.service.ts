import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoalI } from '../interface/metas.interface';

@Injectable({ providedIn: 'root' })

export class GoalsServices {

    private token: string;
    private baseURL: string;
    private headers: HttpHeaders;
    private header: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
    ) {
      this.token = JSON.parse(sessionStorage.getItem("userToken")!);
        this.baseURL = this.systemInformation.getURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
    }

    public getGoals(page: number = 1, itemPerPage: number = 1000, transversal: boolean = false) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Meta?isTransversal=${transversal}&numeroPagina=${page}&tamanoPagina=${itemPerPage}`, this.header));
    }

    public postGoal(goal: GoalI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Meta`, goal , this.header))
    }

    public putGoal(goal: GoalI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Meta`, goal , this.header))
    }

    public deleteGoal(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Meta/${id}`, this.header))
    }

    //Medios de verificación para las metas

    public getVerificationMethod() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Meta/getall_medio_verificacion`, this.header));
    }
}
