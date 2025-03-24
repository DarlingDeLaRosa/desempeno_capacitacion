import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { periodProcessI } from '../interface/periodo-procesos.interface';

@Injectable({ providedIn: 'root' })

export class PeriodsProcessServices {

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

    public getPeriodProcesses(page: number = 1, itemPerPage: number = 1000) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/PeriodoAcuerdo?numeroPagina=${page}&tamanoPagina=${itemPerPage}`, this.header));
    }
    
    public getPeriodProcessesActive() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/PeriodoAcuerdo/activo`, this.header));
    }

    public postPeriodProcess(periodProcess: periodProcessI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/PeriodoAcuerdo`, periodProcess, this.header))
    }

    public putPeriodProcess(periodProcess: periodProcessI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/PeriodoAcuerdo`, periodProcess, this.header))
    }

    public deletePeriodProcess(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/PeriodoAcuerdo/${id}`, this.header))
    }
    
    public getPeriodBytypeProcess(id: number) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/PeriodoAcuerdo/tipo-proceso/${id}`, this.header));
    }

    //endpoint tipos de procesos
    public getTypeProcess(agreement: boolean| string = ''  ) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/tipos-procesos?acuerdo=${agreement}`, this.header));
    }

}
