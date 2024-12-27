import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HerlperService } from '../../../services/appHelpers.service';
import { systemInformationService } from '../../../services/systemInformationService.service';
import { loggedUserI } from '../../../../../helpers/intranet/intranet.interface';
import { ResponseI } from '../../../../interfaces/generalInteerfaces';
import { GoalI } from '../../mantenimiento/mantenimiento-options/metas/interface/metas.interface';
import { MinutaI, postCommentI } from '../interfaces/acuerdo.interface';
import { EvaluationCompetencyTestI } from '../../evaluacion-competencias/interface/evaluacion-competencias.interface';

@Injectable({ providedIn: 'root' })
export class MinutaService {
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

  //peticion para traer todos las minutas
  public getMinuta(term:string | null) {
    return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Minutas?Term=${term}`, this.header));
  }

 //peticion para hacer el post de una minuta
  public postMinuta(Minuta: MinutaI) {
    return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Minutas`, Minuta, this.header));
  }

}
