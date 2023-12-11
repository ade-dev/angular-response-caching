import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StarwarsApiService } from './starwars-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Person } from '../models/swapi';

describe('StarwarsApiService', () => {
  let httpTestingController: HttpTestingController;
  let starwarsApiService: StarwarsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StarwarsApiService]
    });
    TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    starwarsApiService = TestBed.inject(StarwarsApiService);
  });

  const testCharacters: Person[] = [
    {
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      hair_color: "blond",
      skin_color: "fair",
      eye_color: "blue",
      birth_year: "19BBY",
      gender: "male",
      homeworld: "https://swapi.dev/api/planets/1/",
      films: ["https://swapi.dev/api/films/1/"],
      species: [],
      vehicles: ["https://swapi.dev/api/vehicles/14/"],
      starships: ["https://swapi.dev/api/starships/12/"],
      created: "2014-12-09T13:50:51.644000Z",
      edited: "2014-12-20T21:17:56.891000Z",
      url: "https://swapi.dev/api/people/1/"
    },
    {
      name: "C-3PO",
      height: "167",
      mass: "75",
      hair_color: "n/a",
      skin_color: "gold",
      eye_color: "yellow",
      birth_year: "112BBY",
      gender: "n/a",
      homeworld: "https://swapi.dev/api/planets/1/",
      films: ["https://swapi.dev/api/films/1/"],
      species: ["https://swapi.dev/api/species/2/"],
      vehicles: [],
      starships: [],
      created: "2014-12-10T15:10:51.357000Z",
      edited: "2014-12-20T21:17:50.309000Z",
      url: "https://swapi.dev/api/people/2/"
    }
  ];

  const resourceType = 'people';

  it('should be created', () => {
    expect(starwarsApiService).toBeTruthy();
  });

  it('should return a list of charcters', () => {
    starwarsApiService.getResources(resourceType).subscribe(
      characters => {
        expect(characters.length).toBe(2);
        expect(characters).toEqual(testCharacters);
      }
    );
    const testRequest = httpTestingController.expectOne(`${starwarsApiService.baseUrl}${resourceType}`);
    expect(testRequest.request.method).toEqual('GET');
    httpTestingController.verify();
  });

  it('should test for 404 error', () => {
    const errorMsg = '404 error message';

    starwarsApiService.getResources(resourceType).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).withContext('status').toEqual(404);
        expect(error.error).withContext('message').toEqual(errorMsg);
      }
    });

    const testRequest = httpTestingController.expectOne(`${starwarsApiService.baseUrl}${resourceType}`);
    testRequest.flush(errorMsg, { status: 404, statusText: 'Not Found' });
  });

});
