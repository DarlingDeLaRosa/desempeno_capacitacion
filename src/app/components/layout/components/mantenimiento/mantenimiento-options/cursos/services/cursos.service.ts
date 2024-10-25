import { Injectable, getNgModuleById } from '@angular/core';
import { systemInformationService } from '../../../../../services/systemInformationService.service';
import { HerlperService } from '../../../../../services/appHelpers.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseI, InscriptionI } from '../interfaces/cursos.interface';
import { loggedUserI } from '../../../../../../../helpers/intranet/intranet.interface';
import { ResponseI } from '../../../../../../interfaces/generalInteerfaces';

@Injectable({ providedIn: 'root' })

export class CoursesServices {

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


    public getCourses() {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Curso`, this.header));
    }

    public getCoursesDashboard() {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Curso/get_cursos_byidcolaborador/${this.usuario.idPersona}`, this.header));
    }

    public postCourse( courses : CourseI) {
        return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Curso`, courses , this.header))
    }

    public putCourse( courses : CourseI) {
        return this.appHelpers.handleRequest(() => this.http.put(`${this.baseURL}/Curso`, courses , this.header))
    }

    public deleteCourse(id: number) {
        return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Curso/${id}`, this.header))
    }

    // Modalidad

    public getModality() {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Curso/get_modalidades`, this.header));
    }

    public getStates() {
        return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Curso/getestadocurso`, this.header));
    }

    //incripciones Curso

    public postIncripcion( inscripcion : InscriptionI) {
      return this.appHelpers.handleRequest(() => this.http.post(`${this.baseURL}/Curso/inscribir_curso`, inscripcion , this.header))
    }

    public getInscripcionesColaborador() {
      return this.appHelpers.handleRequest(() => this.http.get<ResponseI>(`${this.baseURL}/Curso/get_inscripcion_byidcolaborador/${this.usuario.idPersona}`, this.header));
    }

    public deleteInscripcion(id: number) {
      return this.appHelpers.handleRequest(() => this.http.delete(`${this.baseURL}/Curso/delete_inscripcion/${id}`, this.header))
    }

}