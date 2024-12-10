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
    private baseURL: string;
    private headers: HttpHeaders;
    private header: { headers: HttpHeaders };
    usuario: loggedUserI;

    constructor(
        private http: HttpClient,
        private appHelpers: HerlperService,
        private systemInformation: systemInformationService,
    ) {
        this.token = this.systemInformation.getToken;
        this.baseURL = this.systemInformation.getURL;
        this.headers = new HttpHeaders({ 'Authorization': this.token });
        this.header = { headers: this.headers };
        this.usuario = systemInformation.localUser;
    }


    public getEvaluationCompetencies(collaboratorId: number = this.usuario.idPersona) {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/EvaluacionCompetencia/${this.usuario.idPersona}`, this.header));
    }

    public postEvaluationCompetency( evaluationCompetency : EvaluationCompetencyI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/EvaluacionCompetencia`, evaluationCompetency , this.header))
    }

    // public putEvaluationCompetency( courses : CourseI) {
    //     return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Curso`, courses , this.header))
    // }

    // public deleteCourse(id: number) {
    //     return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Curso/${id}`, this.header))
    // }
}