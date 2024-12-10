import { systemInformationService } from './../../../services/systemInformationService.service';
import { HerlperService } from './../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlanMejoraI } from '../interfaces/plan-mejora.interface';

@Injectable({providedIn: 'root'})
export class PlanMejoraService {

  private token: string;
  private baseURL: string;
  private systemId: number;
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders };

  constructor(
      private http: HttpClient,
      private appHelpers: HerlperService,
      private systemInformation: systemInformationService,
  ) {
      this.token = this.systemInformation.getToken;
      this.systemId = this.systemInformation.getSistema;
      this.baseURL = this.systemInformation.getURL;
      this.headers = new HttpHeaders({ 'Authorization': this.token });
      this.header = { headers: this.headers };
  }


public getCategoriesRecommen() {
  return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/categoria-recomendaciones`, this.header));
}
public getTrimestres() {
  return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/trimestres`, this.header));
}

public postPlanMejora( planMejora : PlanMejoraI) {
  return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/PlanMejora`, planMejora , this.header))
}

public getPlanMejoraByIdCollabo(id:number) {
  return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/PlanMejora/colaborador/${id}`, this.header));
}

// public putCourse( courses : CourseI) {
//   return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Curso`, courses , this.header))
// }

// public deleteCourse(id: number) {
//   return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Curso/${id}`, this.header))
// }

}
