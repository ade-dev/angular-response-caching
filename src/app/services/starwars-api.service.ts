import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, expand, reduce, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarwarsApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private baseUrl = 'https://swapi.dev/api/';

  searchResources(group: string, endPoint: string): Observable<any[]> {
    const searchUrl = `${this.baseUrl}${group}/?search=${endPoint}`;
    return this.httpClient.get<any>(searchUrl);
  };

  getSpecificResource(endPoint: string): Observable<any[]> {
    const getUrl = `${this.baseUrl}/${endPoint}`;
    return this.httpClient.get<any>(getUrl);
  };

  getAllResources(endPoint: string): Observable<any[]> {
    const getAllUrl = `${this.baseUrl}${endPoint}`;
    return this.httpClient.get<any>(getAllUrl).pipe(
      expand(response => response.next ? this.httpClient.get<any>(response.next) : of()),
      reduce((acc, current) => acc.concat(current.results), [])
    );
  }
}
