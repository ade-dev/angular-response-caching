import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchService } from './search.service';
import { StarwarsApiService } from './starwars-api.service';
import { Swapi, Person } from '../models/swapi';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

describe('SearchService', () => {
  let searchService: SearchService<Person>;
  let starwarsApiService: StarwarsApiService;
  const searchInput = new FormControl<string | null>(null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      teardown: { destroyAfterEach: false }
    });

    searchService = TestBed.inject(SearchService);
    starwarsApiService = TestBed.inject(StarwarsApiService);
  });

  const testResult: Swapi = {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        name: "Leia Organa",
        height: "150",
        mass: "49",
        hair_color: "brown",
        skin_color: "light",
        eye_color: "brown",
        birth_year: "19BBY",
        gender: "female",
        homeworld: "https://swapi.dev/api/planets/2/",
        films: [
          "https://swapi.dev/api/films/1/"
        ],
        species: [],
        vehicles: [
          "https://swapi.dev/api/vehicles/30/"
        ],
        starships: [],
        created: "2014-12-10T15:20:09.791000Z",
        edited: "2014-12-20T21:17:50.315000Z",
        url: "https://swapi.dev/api/people/5/"
      }
    ]
  };

  it('should be created', () => {
    expect(searchService).toBeTruthy();
  });

  it('should execute search for characters', fakeAsync(() => {
    spyOn(starwarsApiService, 'searchResources').and.callThrough();
    searchService.search(searchInput, 'people');
    searchInput.setValue('i');
    tick(1000);
    expect(starwarsApiService.searchResources).toHaveBeenCalledWith('people', "i");
  }));

  it('should return search result', fakeAsync(() => {
    spyOn(starwarsApiService, 'searchResources').and.returnValue(of(testResult));
    searchService.search(searchInput, 'people');
    searchInput.setValue('i');
    tick(1000);
    expect(searchService.searchResult.length).toBe(1);
    expect(searchService.searchResult).toEqual(testResult.results as Person[]);
  }));
});
