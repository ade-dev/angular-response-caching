import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StarwarsApiService } from '../services/starwars-api.service';
import { of } from 'rxjs';
import { Person } from '../models/swapi';

describe('CharactersComponent', () => {
  let charactersComponent: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;
  let starwarsApiService: StarwarsApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersComponent);
    charactersComponent = fixture.componentInstance;
    starwarsApiService = TestBed.inject(StarwarsApiService);
    fixture.detectChanges();
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
    }
  ];

  it('should be created', () => {
    expect(charactersComponent).toBeTruthy();
  });

  it('should render page heading in a h2 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Star Wars Characters');
  });

  it(`should call 'getCharacters()' OnInit`, () => {
    const serviceSpy = spyOn(starwarsApiService, 'getResources').and.returnValue(of([]));
    const subscribeSpy = spyOn(starwarsApiService.getResources('people/'), 'subscribe');
    charactersComponent.ngOnInit();
    expect(serviceSpy).toHaveBeenCalledBefore(subscribeSpy);
    expect(subscribeSpy).toHaveBeenCalled();
  });

  it(`should call 'getResource()', if state.selected`, () => {
    window.history.pushState({ selected: 'some character' }, '', '');
    const serviceSpy = spyOn(starwarsApiService, 'getResource').and.returnValue(of([]));
    const subscribeSpy = spyOn(starwarsApiService.getResource(testCharacters[1].url), 'subscribe');
    charactersComponent.ngOnInit();
    expect(serviceSpy).toHaveBeenCalledBefore(subscribeSpy);
    expect(subscribeSpy).toHaveBeenCalled();
    window.history.pushState({ selected: null }, '', '');
  });


  it('should get a list of characters OnInit', () => {
    spyOn(starwarsApiService, 'getResources').and.returnValue(of(testCharacters));
    charactersComponent.ngOnInit();
    expect(charactersComponent.allCharacters).toBeDefined();
    expect(charactersComponent.allCharacters.length).toEqual(2);
  });

  it(`should get a character's details OnInit, if state.selected`, () => {
    window.history.pushState({ selected: 'people/10' }, '', '');
    spyOn(starwarsApiService, 'getResource').and.returnValue(of(testCharacters[1]));
    charactersComponent.ngOnInit();
    expect(charactersComponent.selectedCharacter).toBeDefined();
    expect(charactersComponent.selectedCharacter).toEqual(testCharacters[1]);
    window.history.pushState({ selected: null }, '', '');
  });

});
