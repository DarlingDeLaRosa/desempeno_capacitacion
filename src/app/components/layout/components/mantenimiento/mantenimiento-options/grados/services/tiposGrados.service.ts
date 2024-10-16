import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class TypesGradesServices {

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

    public getTypesGrades() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Grado/get_tipos_grado`, this.header));
    }
}