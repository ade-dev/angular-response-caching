import { TestBed } from '@angular/core/testing';
import { StarwarsApiService } from './starwars-api.service';
import { HttpInterceptorService } from './http-interceptor.service';
import { CacheStoreService } from './cache-store.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Person } from '../models/swapi';

describe('CacheInterceptorService', () => {
  let starwarsApiService: StarwarsApiService;
  let httpInterceptorService: HttpInterceptorService;
  let cacheStoreService: CacheStoreService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptorService,
          multi: true
        }
      ]

    });

    TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    starwarsApiService = TestBed.inject(StarwarsApiService);
    httpInterceptorService = TestBed.inject(HttpInterceptorService);
    cacheStoreService = TestBed.inject(CacheStoreService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const apiUrl = 'https://swapi.dev/api/peoples/10';

  const testCharacter: Person = {
    name: "Obi-Wan Kenobi",
    height: "182",
    mass: "77",
    hair_color: "auburn, white",
    skin_color: "fair",
    eye_color: "blue-gray",
    birth_year: "57BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/20/",
    films: [
      "https://swapi.dev/api/films/1/"
    ],
    species: [],
    vehicles: [
      "https://swapi.dev/api/vehicles/38/"
    ],
    starships: [
      "https://swapi.dev/api/starships/48/"
    ],
    created: "2014-12-10T16:16:29.192000Z",
    edited: "2014-12-20T21:17:50.325000Z",
    url: "https://swapi.dev/api/people/10/"
  };

  it('should be created', () => {
    expect(httpInterceptorService).toBeTruthy();
  });

  it(`should cache HTTP 'GET' requests`, () => {
    starwarsApiService.getResource(apiUrl).subscribe({
      next: (response) => {
        expect(response).toBeTruthy;
      }
    });

    const testRequest = httpTestingController.expectOne(apiUrl);

    testRequest.flush(testCharacter);

    expect(testRequest.request.method).toEqual('GET');
    expect(cacheStoreService.cachedResponses.size).toBe(1);
    expect(cacheStoreService.cachedResponses.has(apiUrl)).toBe(true);
  });

});
