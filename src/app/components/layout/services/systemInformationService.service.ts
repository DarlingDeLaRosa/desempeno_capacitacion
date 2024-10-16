import { Injectable } from '@angular/core';

@Injectable({providedIn: "root"})

export class systemInformationService {
    
    constructor() { }
    
    private  URLProduction: string = ''
    private  URLDevelopment: string = 'http://172.25.0.12'
    private userToken: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYXJsaW5nLmRlbGFyb3NhIiwianRpIjoiM2RiOWIyMTQtYTgxMi00NzhjLTk1NmMtODAxYTRjOTI3NDgzIiwiSWQiOiI0IiwiRmlyc3RuYW1lIjoiRGFybGluZyAiLCJMYXN0bmFtZSI6IkRlIGxhIFJvc2EiLCJVc2VybmFtZSI6ImRhcmxpbmcuZGVsYXJvc2EiLCJQb3NpdGlvbiI6IkFkbWluaXN0cmFkb3IoYSkgZGUgQmFzZSBEZSBEYXRvcyIsIlVuaWRhZCI6IkRFUEFSVEFNRU5UTyBERSBURUNOT0xPR0lBUyBERSBMQSBJTkZPUk1BQ0lPTiBZIENPTVVOSUNBQ0lPTiIsIklkUmVjaW50byI6IjciLCJSZWNpbnRvU2lnbGEiOiJSRUMiLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsImlkU2lzdGVtYSI6IjEiLCJleHAiOjE3MjgzOTI3MjUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNzUiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1In0.v_icgIWbYedMWpqzmKhhrHv1nHdhQP7_momISjTMXig"

    get getURL(): string { return this.URLDevelopment }
    get getToken(): string { return this.userToken }

    set setUserToken(token: string) {
        let tokenT: string = token.replace(/^"(.*)"$/, '$1');
        this.userToken = `Bearer ${tokenT}`
    };
}