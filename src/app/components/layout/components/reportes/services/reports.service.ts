import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HerlperService } from "../../../services/appHelpers.service";
import { systemInformationService } from "../../../services/systemInformationService.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })

export class ReportServices {

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

    public getCreationAgreementReport(periodId: number, processTypeId: number, isDiff: boolean | undefined) {
        return this.appHelpers.handleRequest(() => this.http.get(`${this.baseURL}/reporte-acuerdo?periodoId=${periodId}&tipoProcesoId=${processTypeId}&isInconsitente=${isDiff ?? ''}`, this.header));
    }
}
