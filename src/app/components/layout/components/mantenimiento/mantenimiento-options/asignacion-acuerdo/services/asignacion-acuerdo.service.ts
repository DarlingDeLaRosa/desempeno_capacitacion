import { Injectable } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { asignationAgreementI } from '../interfaces/asignacion-acuerdo.interface';

@Injectable({ providedIn: 'root' })

export class AsignationAgreementServices {

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

    public getAsignationAgreements(page: number = 1, itemPerPage: number = 1000) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/AsignacionAcuerdo?numeroPagina=${page}&tamanoPagina=${itemPerPage}`, this.header));
    }

    public postAsignationAgreement( asignationAgreement : asignationAgreementI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/AsignacionAcuerdo`, asignationAgreement , this.header))
    }

    public putAsignationAgreement( asignationAgreement : asignationAgreementI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/AsignacionAcuerdo`, asignationAgreement , this.header))
    }

    public deleteAsignationAgreement(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/AsignacionAcuerdo/${id}`, this.header))
    }

    //endpoint para eliminar asignacion de acuerdo con el id del colaborador
    public deleteAsignationAgreementByIdCollaborador(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/AsignacionAcuerdo/colaborador/${id}`, this.header))
    }

    //endpoint tipos de acuerdos
    public getTypeAgreement() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/tipos-acuerdos`, this.header));
    }

    // endpoint para obtener asignaciones por la cedula del colaborador
    public getAsignationAgreementsByDNI(dni: string) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/AsignacionAcuerdo/colaborador/${dni}`, this.header));
    }

    //duracion del acuerdo
    public getAgreementDurations() {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/duracion-acuerdos`, this.header));
    }
}
