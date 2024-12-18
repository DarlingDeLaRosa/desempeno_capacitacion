import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GradesI } from '../interfaces/grados.interfaces';

@Injectable({ providedIn: 'root' })

export class GradesServices {

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

    public getGrades(page: number = 1, itemPerPage: number = 1000, isTest: boolean = false) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Grado?numeroPagina=${page}&tamanoPagina=${itemPerPage}&probatorio=${isTest}`, this.header));
    }

    public postGrade(grade: GradesI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Grado`, grade, this.header))
    }

    public putGrade(grade: GradesI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Grado`, grade, this.header))
    }

    public deleteGrade(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Grado/${id}`, this.header))
    }
}