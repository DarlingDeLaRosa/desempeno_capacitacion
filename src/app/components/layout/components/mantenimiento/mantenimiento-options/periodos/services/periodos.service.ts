import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PeriodI } from '../interfaces/periodo.interface';

@Injectable({ providedIn: 'root' })

export class PeriodsServices {

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

    public getPeriods(page: number = 1, itemPerPage: number = 1000) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Periodo?numeroPagina=${page}&tamanoPagina=${itemPerPage}`, this.header));
    }

    public getPeriodsActive() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Periodo/get_periodo_activo`, this.header));
    }

    public postPeriod(period: PeriodI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Periodo`, period , this.header))
    }

    public putPeriod(period: PeriodI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Periodo`, period , this.header))
    }

    public deletePeriod(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Periodo/${id}`, this.header))
    }

    // Activar Periodo

    public putActivatePeriod(idPerido: number) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Periodo/update_periodo?idPeriodo=${idPerido}` , this.header))
    }
}
