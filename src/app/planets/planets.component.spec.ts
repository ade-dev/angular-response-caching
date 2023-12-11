import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetsComponent } from './planets.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StarwarsApiService } from '../services/starwars-api.service';
import { of } from 'rxjs';
import { Planet } from '../models/swapi';

describe('PlanetsComponent', () => {
  let planetsComponent: PlanetsComponent;
  let fixture: ComponentFixture<PlanetsComponent>;
  let starwarsApiService: StarwarsApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetsComponent);
    planetsComponent = fixture.componentInstance;
    starwarsApiService = TestBed.inject(StarwarsApiService);
    fixture.detectChanges();
  });

  const testPlanets: Planet[] = [
    {
      name: "Dagobah",
      rotation_period: "23",
      orbital_period: "341",
      diameter: "8900",
      climate: "murky",
      gravity: "N/A",
      terrain: "swamp, jungles",
      surface_water: "8",
      population: "unknown",
      residents: [],
      films: [
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/"
      ],
      created: "2014-12-10T11:42:22.590000Z",
      edited: "2014-12-20T20:58:18.425000Z",
      url: "https://swapi.dev/api/planets/5/"
    },
    {
      name: "Endor",
      rotation_period: "18",
      orbital_period: "402",
      diameter: "4900",
      climate: "temperate",
      gravity: "0.85 standard",
      terrain: "forests, mountains, lakes",
      surface_water: "8",
      population: "30000000",
      residents: [
        "https://swapi.dev/api/people/30/"
      ],
      films: [
        "https://swapi.dev/api/films/3/"
      ],
      created: "2014-12-10T11:50:29.349000Z",
      edited: "2014-12-20T20:58:18.429000Z",
      url: "https://swapi.dev/api/planets/7/"
    },
  ];

  it('should be created', () => {
    expect(planetsComponent).toBeTruthy();
  });

  it('should render page heading in a h2 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Star Wars Planets');
  });

  it(`should call 'getPlanets()' OnInit`, () => {
    const serviceSpy = spyOn(starwarsApiService, 'getResources').and.returnValue(of([]));
    const subscribeSpy = spyOn(starwarsApiService.getResources('planets/'), 'subscribe');
    planetsComponent.ngOnInit();
    expect(serviceSpy).toHaveBeenCalledBefore(subscribeSpy);
    expect(subscribeSpy).toHaveBeenCalled();

  });

  it(`should call 'getPlanetDetails()' OnInit if state.selected`, () => {
    window.history.pushState({ selected: 'some planet' }, '', '');
    const serviceSpy = spyOn(starwarsApiService, 'getResource').and.returnValue(of([]));
    const subscribeSpy = spyOn(starwarsApiService.getResource(testPlanets[1].url), 'subscribe');
    planetsComponent.ngOnInit();
    expect(serviceSpy).toHaveBeenCalledBefore(subscribeSpy);
    expect(subscribeSpy).toHaveBeenCalled();
    window.history.pushState({ selected: null }, '', '');
  });


  it('should get a list of planets OnInit', () => {
    spyOn(starwarsApiService, 'getResources').and.returnValue(of(testPlanets));
    planetsComponent.ngOnInit();
    expect(planetsComponent.allPlanets).toBeDefined();
    expect(planetsComponent.allPlanets.length).toEqual(2);
  });

  it(`should get a planet's details OnInit, if state.selected`, () => {
    window.history.pushState({ selected: 'planets/7' }, '', '');
    spyOn(starwarsApiService, 'getResource').and.returnValue(of(testPlanets[1]));
    planetsComponent.ngOnInit();
    expect(planetsComponent.selectedPlanet).toBeDefined();
    expect(planetsComponent.selectedPlanet).toEqual(testPlanets[1]);
    window.history.pushState({ selected: null }, '', '');
  });

});
