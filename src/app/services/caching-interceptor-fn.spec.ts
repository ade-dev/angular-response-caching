import { TestBed } from '@angular/core/testing';
import { StarwarsApiService } from './starwars-api.service';
import { cachingInterceptor } from './caching-interceptor-fn';
import { CacheStoreService } from './cache-store.service';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Person } from '../models/swapi';

describe('Caching interceptor function', () => {
    let starwarsApiService: StarwarsApiService;
    let cacheStoreService: CacheStoreService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([cachingInterceptor])),
                provideHttpClientTesting()
            ]

        });

        TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        starwarsApiService = TestBed.inject(StarwarsApiService);
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
