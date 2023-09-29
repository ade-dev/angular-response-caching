import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, expand, reduce, EMPTY } from 'rxjs';
import { Swapi, Person, Planet, Starship } from '../models/swapi';


@Injectable({
  providedIn: 'root'
})
export class StarwarsApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private baseUrl = 'https://swapi.dev/api/';

  searchResources(group: string, endPoint: string | null): Observable<Swapi> {
    const searchUrl = `${this.baseUrl}${group}/?search=${endPoint}`;
    return this.httpClient.get<Swapi>(searchUrl);
  }

  getSpecificResource<T>(endPoint: string): Observable<T> {
    const getUrl = `${this.baseUrl}/${endPoint}`;
    return this.httpClient.get<T>(getUrl);
  }

  getAllResources<T extends Person | Planet | Starship>(endPoint: string): Observable<T[]> {
    const getAllUrl = `${this.baseUrl}${endPoint}`;
    return this.httpClient.get<Swapi>(getAllUrl).pipe(
      expand((response) =>
        // Checking response for next url
        // And limiting response to 3 pages
        response.next && response.next.slice(-1) !== '4' ? this.httpClient.get<Swapi>(response.next) : EMPTY),
      reduce((acc: T[], { results }) => acc.concat(results as T[]), [])
    );
  }
}
