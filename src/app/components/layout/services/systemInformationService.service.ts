import { Injectable } from '@angular/core';

@Injectable({ providedIn: "root" })

export class systemInformationService {

  constructor() { }

  private URLProduction: string = ''
  private URLDevelopment: string = 'http://172.25.4.24'
  private UrlIntranet: string = 'https://intranet.isfodosu.edu.do/api'

  private UrlSIGEBI: string = 'https://sigebi.isfodosu.edu.do/sigebiapi'
  private userToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb25hcy5kaWF6IiwianRpIjoiNWMyODZmY2UtNTczMS00MDhlLTk2OTAtYTMyZDNmYzIyMGFiIiwiSWQiOiIxIiwiRmlyc3RuYW1lIjoiSm9uYXMiLCJMYXN0bmFtZSI6IkRpYXoiLCJVc2VybmFtZSI6ImpvbmFzLmRpYXoiLCJQb3NpdGlvbiI6IlByb2dyYW1hZG9yKGEpIGRlIFNvZnR3YXJlIiwiVW5pZGFkIjoiRElWSVNJT04gREUgREVTQVJST0xMTyBFIElNUExFTUVOVEFDSU9OIERFIFNJU1RFTUFTIiwiSWRSZWNpbnRvIjoiNyIsIlJlY2ludG9TaWdsYSI6IlJFQyIsInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwiaWRTaXN0ZW1hIjoiMSIsImlkUGVyc29uYSI6IjMiLCJleHAiOjE3Mjk4Njg3MDMsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNzUiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDc1In0.__G6ytM70bhMWtWJz1IYT42iJTD4RaIVma1baXWzk-E"




  get getURL(): string { return this.URLDevelopment }
  get getIntranetURL(): string { return this.UrlIntranet }
  get getSigebiURL(): string { return this.UrlSIGEBI }
  get getToken(): string { return this.userToken }

  set setUserToken(token: string) {
    let tokenT: string = token.replace(/^"(.*)"$/, '$1');
    this.userToken = `Bearer ${tokenT}`
  };

  decodeAndStoreToken(): void {
    try {
      const payloadPart = this.userToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      localStorage.setItem('usuario', JSON.stringify(decodedPayload));
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  get localUser() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      return usuarioObj;
    } else {
      return null;
    }
  }
}
