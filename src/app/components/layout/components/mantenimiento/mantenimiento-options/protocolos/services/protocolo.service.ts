import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProtocolI } from '../interface/protocolos.interface';

@Injectable({ providedIn: 'root' })

export class ProtocolsServices {

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

    public getProtocols(page: number = 1, itemPerPage: number = 1000) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Protocolo?numeroPagina=${page}&tamanoPagina=${itemPerPage}`, this.header));
    }

    public postProtocol(formData: FormData) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Protocolo`, formData, this.header))
    }

    public putProtocol(formData: FormData) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Protocolo`, formData , this.header))
    }

    public deleteProtocol(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Protocolo/${id}`, this.header))
    }

    public getProtocolById(id: number) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Protocolo/${id}`, this.header));
    }

    // Medoto para obtener todos los tipos de protocolos 

    public getTypeProtocols() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/Protocolo/getall_tipo_protocolo`, this.header));
    }
}