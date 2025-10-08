import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { loggedUserI } from "../../../../../helpers/intranet/intranet.interface";
import { HerlperService } from "../../../services/appHelpers.service";
import { systemInformationService } from "../../../services/systemInformationService.service";
import { ResponseI } from "../../../../interfaces/generalInteerfaces";
import { EvaluationCompetencyI } from "../interface/evaluacion-competencias.interface";

@Injectable({ providedIn: 'root' })

export class EvaluationCompetencyServices {

    private token: string;
    private tokenIntra: string;

    private baseURL: string;

    private headers: HttpHeaders;
    private headersIntra: HttpHeaders;

    private header: { headers: HttpHeaders };
    private headerIntra: { headers: HttpHeaders };
    
    usuario: loggedUserI;

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
    ) {
        this.token = JSON.parse(sessionStorage.getItem("userToken")!);
        this.tokenIntra = JSON.parse(sessionStorage.getItem("tokenIntranet")!);

        this.baseURL = this.systemInformation.getURL;

        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
        
        this.headersIntra = new HttpHeaders({ 'Authorization': this.tokenIntra });
        this.headerIntra = { headers: this.headersIntra };

        this.usuario = systemInformation.localUser;
    }

    public getEvaluationCompetencies(isSup: boolean = false, term: string = '', page: number = 1, pageSize: number = 10, recinto: string = '') {
        let collaboratorId: number = this.usuario.idPersona
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/EvaluacionCompetencia/colaborador/${collaboratorId}?supervisor=${isSup}&Term=${term}&recinto=${recinto}&CurrentPage=${page}&PageSize=${pageSize}`, this.header));
    }

    public getEvaluationCompetenciesBySupInterino( term: string = '', page: number = 1, pageSize: number = 10) {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/EvaluacionCompetencia/para-supervisor-interino?Term=${term}&CurrentPage=${page}&PageSize=${pageSize}`, this.header));
    }

    public postEvaluationCompetency(evaluationCompetency: EvaluationCompetencyI[]) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/EvaluacionCompetencia`, evaluationCompetency, this.header))
    }

    public getEvaluationCompetenciesByIdPerson(collaboratorId: number) {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/EvaluacionCompetencia/colaborador-id/${collaboratorId}`, this.header));
    }

    public putEvaluationCompetency(evaluationCompetency: EvaluationCompetencyI[]) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/EvaluacionCompetencia`, evaluationCompetency, this.header))
    }

    public getMisssingColaborators(page: number, recinto: string = '') {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Colaboradores/sin-evaluar?Term=${recinto}&CurrentPage=${page}&PageSize=10`, this.header));
    }

    public deleteEvaluacion(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/EvaluacionCompetencia/${id}`, this.header))
    }
}
