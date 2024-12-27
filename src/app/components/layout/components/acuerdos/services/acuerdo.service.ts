import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HerlperService } from '../../../services/appHelpers.service';
import { systemInformationService } from '../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../helpers/intranet/intranet.interface';
import { ResponseI } from '../../../../interfaces/generalInteerfaces';
import { GoalI } from '../../mantenimiento/mantenimiento-options/metas/interface/metas.interface';
import { postCommentI } from '../interfaces/acuerdo.interface';
import { EvaluationCompetencyTestI } from '../../evaluacion-competencias/interface/evaluacion-competencias.interface';

@Injectable({ providedIn: 'root' })
export class agreementService {
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
    this.token = JSON.parse(sessionStorage.getItem("userToken")!);
    this.baseURL = this.systemInformation.getURL;
    this.headers = new HttpHeaders({ 'Authorization': this.token });
    this.header = { headers: this.headers };
    this.usuario = systemInformation.localUser;
  }

  //peticion para traer todos los acuerdos
  public getAgreement() {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Acuerdo`, this.header));
  }

  //peticion para traer el acuerdo segun el id del colaborador
  public getAgreementByCollaborator(idCollaborator: number, idGroup: number) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Acuerdo/get_by_idcolaborador/${idCollaborator}/${idGroup}`, this.header));
  }

  public getAgreementByRol(idCollaborator: number, term:string) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Acuerdo/colaborador/${idCollaborator}?term=${term}`, this.header));
  }

  public getAgreementByIdCollaborator(idCollaborator: number) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Acuerdo/get_acuerdo_by_idcolaborador/${idCollaborator}`, this.header));
  }

  public getAgreementById(idAgreement: number) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Acuerdo/${idAgreement}`, this.header));
  }

  public postAgreementGoalDetails(detalleMeta: any) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Acuerdo/insert_details`, detalleMeta, this.header));
  }

  public postGoalCalificacion(Calificacion: any) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Acuerdo/calificar_meta`, Calificacion, this.header));
  }

  public postFileAcuerdo(formData: any) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Acuerdo/upload_file_acuerdo`, formData, this.header));
  }

  public deleteGoalDetail(id: number) {
    return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Acuerdo/delete_detalle_acuerdo/${id}`, this.header))
  }

  public deleteDocumentAcuerdo(id: number) {
    return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Acuerdo/delete_document/${id}`, this.header))
  }

  //Commets
  public getComments(idAcuerdo: number) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Acuerdo/${idAcuerdo}/comentarios`, this.header));
  }

  public postComment(comment: postCommentI) {
    return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Acuerdo/agregar-comentario`, comment, this.header));
  }

  //Flujo

  public updateFlow(flow: {acuerdoId: number, flujoId: number}) {
    return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Acuerdo/actualizar-flujo`, flow, this.header));
  }

  // procesos

  public updateProcess(process: {acuerdoId: number, procesoId: number}) {
    return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Acuerdo/actualizar-proceso`, process, this.header));
  }

  // Comportamientos Probatorios 

  public getBehaviorTest() {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/EvaluacionesAcuerdosProbatorios`, this.header));
  }

  public postBehaviorTest(behaviorsTest: EvaluationCompetencyTestI) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/EvaluacionesAcuerdosProbatorios`, behaviorsTest, this.header));
  }

  public putBehaviorTest(behaviorsTest: EvaluationCompetencyTestI) {
    return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/EvaluacionesAcuerdosProbatorios`, behaviorsTest, this.header));
  }

}
