import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarshipsComponent } from './starships.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StarwarsApiService } from '../services/starwars-api.service';
import { of } from 'rxjs';
import { Starship } from '../models/swapi';

describe('StarshipsComponent', () => {
  let starshipsComponent: StarshipsComponent;
  let fixture: ComponentFixture<StarshipsComponent>;
  let starwarsApiService: StarwarsApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarshipsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        StarwarsApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StarshipsComponent);
    starshipsComponent = fixture.componentInstance;
    fixture.detectChanges();
    starwarsApiService = TestBed.inject(StarwarsApiService);
  });

  const testStarships: Starship[] = [
    {
      name: "Sentinel-class landing craft",
      model: "Sentinel-class landing craft",
      manufacturer: "Sienar Fleet Systems, Cyngus Spaceworks",
      cost_in_credits: "240000",
      length: "38",
      max_atmosphering_speed: "1000",
      crew: "5",
      passengers: "75",
      cargo_capacity: "180000",
      consumables: "1 month",
      hyperdrive_rating: "1.0",
      MGLT: "70",
      starship_class: "landing craft",
      pilots: [],
      films: ["https://swapi.dev/api/films/1/"],
      created: "2014-12-10T15:48:00.586000Z",
      edited: "2014-12-20T21:23:49.873000Z",
      url: "https://swapi.dev/api/starships/5/"
    },
    {
      name: "Millennium Falcon",
      model: "YT-1300 light freighter",
      manufacturer: "Corellian Engineering Corporation",
      cost_in_credits: "100000",
      length: "34.37",
      max_atmosphering_speed: "1050",
      crew: "4",
      passengers: "6",
      cargo_capacity: "100000",
      consumables: "2 months",
      hyperdrive_rating: "0.5",
      MGLT: "75",
      starship_class: "Light freighter",
      pilots: [
        "https://swapi.dev/api/people/13/"
      ],
      films: [
        "https://swapi.dev/api/films/1/"
      ],
      created: "2014-12-10T16:59:45.094000Z",
      edited: "2014-12-20T21:23:49.880000Z",
      url: "https://swapi.dev/api/starships/10/"
    }
  ];

  it('should be created', () => {
    expect(starshipsComponent).toBeTruthy();
  });

  it('should render page heading in a h2 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Star Wars Starships');
  });

  it(`should call 'getStarships()' OnInit`, () => {
    const serviceSpy = spyOn(starwarsApiService, 'getResources').and.returnValue(of([]));
    const subscribeSpy = spyOn(starwarsApiService.getResources('starships/'), 'subscribe');
    starshipsComponent.ngOnInit();
    expect(serviceSpy).toHaveBeenCalledBefore(subscribeSpy);
    expect(subscribeSpy).toHaveBeenCalled();

  });

  it(`should call 'getStarshipDetails()' OnInit if state.selected`, () => {
    window.history.pushState({ selected: 'some starship' }, '', '');
    const serviceSpy = spyOn(starwarsApiService, 'getResource').and.returnValue(of([]));
    const subscribeSpy = spyOn(starwarsApiService.getResource(testStarships[1].url), 'subscribe');
    starshipsComponent.ngOnInit();
    expect(serviceSpy).toHaveBeenCalledBefore(subscribeSpy);
    expect(subscribeSpy).toHaveBeenCalled();
    window.history.pushState({ selected: null }, '', '');
  });


  it('should get a list of starships OnInit', () => {
    spyOn(starwarsApiService, 'getResources').and.returnValue(of(testStarships));
    starshipsComponent.ngOnInit();
    expect(starshipsComponent.allStarships).toBeDefined();
    expect(starshipsComponent.allStarships.length).toEqual(2);
  });

  it(`should get a starship's details OnInit, if state.selected`, () => {
    window.history.pushState({ selected: 'starships/10' }, '', '');
    spyOn(starwarsApiService, 'getResource').and.returnValue(of(testStarships[1]));
    starshipsComponent.ngOnInit();
    expect(starshipsComponent.selectedStarship).toBeDefined();
    expect(starshipsComponent.selectedStarship).toEqual(testStarships[1]);
    window.history.pushState({ selected: null }, '', '');
  });

});
