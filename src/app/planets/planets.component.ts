import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { Planet } from '../models/planet';
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
  minimumPlanets: number = 2;
  planetList: Planet[] = [];
  allPlanets: Planet[] = [];
  selectedPlanet: Planet | null = null;
  selectedPlanetName: string = '';
  showAllPlanets: boolean = false;
  isLoading: boolean = false;

  getPlanet(endPoint: string) {
    this.subsribeGetPlanets = this.starwarsApiService.getSpecificResource(endPoint).subscribe((response: any) => {
      this.selectedPlanet = response;
    });
  }

  getAllPlanets() {
    this.isLoading = true;
    this.subsribeGetAllPlanets = this.starwarsApiService.getAllResources('planets/').subscribe((response: any) => {
      this.allPlanets = response;
      this.isLoading = false;
      this.showAllPlanets = true;
      this.selectedPlanet = null;
    });
  }

  getPlanetDetails(selectedPlanet: string) {
    const planetId = this.helperService.getId(selectedPlanet);
    this.getPlanet(planetId);
  }

  searchPlanets() {
    this.subsribeSearchPlanets = this.planetsControl.valueChanges.pipe(
      filter(value => {
        return value !== null && value.trim() !== '' && value.trim().length >= this.minimumPlanets;
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(value => this.starwarsApiService.searchResources('planets', value!))
    )
      .subscribe((response: any) => {
        if (response.count === 0) {
          this.planetList = [];
        } else {
          this.planetList = response.results;
        }
        this.planetList = response.results;
      });
  }

  ngOnInit(): void {
    this.searchPlanets();
    history.state && history.state.selected ? this.getPlanetDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeSearchPlanets?.unsubscribe();
    this.subsribeGetPlanets?.unsubscribe();
    this.subsribeGetAllPlanets?.unsubscribe();
  };
}
