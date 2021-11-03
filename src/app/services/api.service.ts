import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  urlApi: string = 'https://backendmdsb.latamdeveloper.com/api/v1/';

  getQuery(query: string) {
    const url = `${ this.urlApi + query }`;
    return this.httpClient.get(url);
  }

  postQuery(query: string, params: any) {
    const url = `${ this.urlApi + query }`;
    return this.httpClient.post(url, params);
  }

  getDataProceso(data: object) {
    return this.postQuery('mant-proc-deuda', data).pipe(
      map(data => {
        return data;
      })
    );
  }

  getDataListado(data: object) {
    return this.postQuery('list-contrib-proc', data).pipe(
      map(data => {
        return data;
      })
    );
  }

}
