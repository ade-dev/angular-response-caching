import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { Planet } from '../models/swapi';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit, OnDestroy {

  constructor(
    private starwarsApiService: StarwarsApiService,
    private helperService: HelperService
  ) { }

  subsribeSearchPlanets!: Subscription;
  subsribeGetPlanets!: Subscription;
  subsribeGetAllPlanets!: Subscription;
  planetsControl = new FormControl<string>('');
  minimumPlanets = 2;
  planetList: Planet[] = [];
  allPlanets: Planet[] = [];
  selectedPlanet: Planet | null = null;
  selectedPlanetName = '';
  showAllPlanets = false;
  isLoading = false;

  getPlanet(endPoint: string) {
    this.subsribeGetPlanets = this.starwarsApiService.getSpecificResource<Planet>(endPoint).subscribe((response: Planet) => {
      this.selectedPlanet = response;
      this.showAllPlanets = false;
    });
  }

  getAllPlanets() {
    this.showAllPlanets = true;
    this.isLoading = true;
    this.subsribeGetAllPlanets = this.starwarsApiService.getAllResources<Planet>('planets/').subscribe((response: Planet[]) => {
      this.allPlanets = response;
      this.isLoading = false;
      this.selectedPlanet = null;
    });
  }

  getPlanetDetails(selectedPlanet: string) {
    const planetId = this.helperService.getId(selectedPlanet);
    this.getPlanet(planetId);
    this.showAllPlanets = false;
  }

  searchPlanets() {
    this.subsribeSearchPlanets = this.planetsControl.valueChanges.pipe(
      filter(value => {
        return value !== null && value.trim() !== '' && value.trim().length >= this.minimumPlanets;
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(value => this.starwarsApiService.searchResources('planets', value))
    )
      .subscribe(
        response => {
          response.count === 0 ? this.planetList = [] : this.planetList = response.results as Planet[];
        });
  }

  ngOnInit(): void {
    this.getAllPlanets();
    this.searchPlanets();
    history.state && history.state.selected ? this.getPlanetDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeSearchPlanets?.unsubscribe();
    this.subsribeGetPlanets?.unsubscribe();
    this.subsribeGetAllPlanets?.unsubscribe();
  }
}
