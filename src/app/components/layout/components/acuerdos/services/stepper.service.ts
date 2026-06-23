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
export class    stepperService {
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
  public getStepByIdProcess(idProcess: number, interm: boolean = false) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/AcuerdoSteps/${idProcess}?interino=${interm}`, this.header));
  }

  public postCompleteStep(idProcess: number, interm: boolean = false) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/AcuerdoSteps/${idProcess}/completar-paso?interino=${interm}`, '', this.header));
  }

//   public putCommentsReaded(idAcuerdo: number) {
//     return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Acuerdo/${idAcuerdo}/comentarios-leidos`, '',this.header));
//   }

//   public deleteGoalDetail(id: number) {
//     return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Acuerdo/delete_detalle_acuerdo/${id}`, this.header))
//   }


}
