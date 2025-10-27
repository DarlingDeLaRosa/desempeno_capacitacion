import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HerlperService } from '../../../services/appHelpers.service';
import { systemInformationService } from '../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../helpers/intranet/intranet.interface';
import { ResponseI } from '../../../../interfaces/generalInteerfaces';
import { GoalI } from '../../mantenimiento/mantenimiento-options/metas/interface/metas.interface';
import { MinutaI, postCommentI, validationMinutaI } from '../interfaces/acuerdo.interface';
import { EvaluationCompetencyTestI } from '../../evaluacion-competencias/interface/evaluacion-competencias.interface';

@Injectable({ providedIn: 'root' })
export class MinutaService {
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
    this.headersIntra = new HttpHeaders({ 'Authorization': this.tokenIntra });
    
    this.header = { headers: this.headers };
    this.headerIntra = { headers: this.headersIntra };

    this.usuario = systemInformation.localUser;
  }

  //peticion para traer todos las minutas
  public getMinuta(term: string, typeMinuta: string = 'Acuerdo', sup: boolean = true, page: number = 1, totalPage: number = 10, esSupervisorInterino: boolean = false,) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Minutas?tipo=${typeMinuta}&esSupervisorInterino=${esSupervisorInterino}&esSupervisor=${sup}&Term=${term}&CurrentPage=${page}&PageSize=${totalPage}`, this.header));
  }
  
  // public getMinutaProvisional(term: string, typeMinuta: string = 'Acuerdo', sup: boolean = true, page: number = 1, totalPage: number = 10) {
  //   return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Minutas?tipo=${typeMinuta}&esSupervisor=${sup}&Term=${term}&CurrentPage=${page}&PageSize=${totalPage}`, this.headerIntra));
  // }
  
  public getMinutaEvaluacion(esSupIn: boolean = false, type: string, page: number = 1, totalPage: number = 10) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Minutas/por-supervisor?tipo=${type}&esSupervisorInterino=${esSupIn}&CurrentPage=${page}&PageSize=${totalPage}`, this.header));
  }

  public getMinutaById(minutaId: number) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Minutas/${minutaId}`, this.header));
  }

  public getMinutaExistente(period: number, isEvaluation: boolean, periodProcessId: number = 0) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Minutas/validar-existencia?periodoId=${period}&supervisorId=${Number(this.usuario.idPersona)}&esUnaEvaluacion=${isEvaluation}&periodoAcuerdoId=${periodProcessId}`, this.header));
  }

  public getMinutaExistenteByPerson(userId: number, period: number, isEvaluation: boolean, periodProcessId: number = 0) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Minutas/validar-existencia?periodoId=${period}&supervisorId=${userId}&esUnaEvaluacion=${isEvaluation}&periodoAcuerdoId=${periodProcessId}`, this.header));
  }

  //peticion para hacer el post de una minuta
  public postMinuta(Minuta: MinutaI) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Minutas`, Minuta, this.header));
  }

  public postValidarMinuta(minutaId: number, validation: validationMinutaI) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Minutas/${minutaId}/validar`, validation, this.header));
  }

  //peticion para hacer el post de una minuta
  public postDocMinuta(IdMinuta: number, formData: FormData) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Minutas/${IdMinuta}/cargar-minuta`, formData, this.header));
  }

  public deleteMinuta(idMinuta: number) {
    return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Minutas/${idMinuta}`, this.header))
  }

  public deleteDocMinuta(idMinuta: number, comment: string) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Minutas/${idMinuta}/eliminar-minuta`, {comentario: comment} , this.header))
  }
}
