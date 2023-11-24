import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Stage, Planet } from '../models/swapi';
import { HelperService } from '../services/helper.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planets',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchFormComponent],
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit, OnDestroy {

  constructor(
    private starwarsApiService: StarwarsApiService,
    private helperService: HelperService
  ) { }

  subsribeGetPlanets!: Subscription;
  subsribeGetPlanet!: Subscription;
  planetList: Planet[] = [];
  allPlanets: Planet[] = [];
  selectedPlanet: Planet | null = null;
  selectedPlanetName = '';
  showAllPlanets = false;
  isLoading = false;

  getPlanet(endPoint: string) {
    this.subsribeGetPlanet = this.starwarsApiService.getSpecificResource<Planet>(endPoint).subscribe((response: Planet) => {
      this.isLoading = false;
      this.showAllPlanets = false;
      this.selectedPlanet = response;
    });
  }

  getPlanets() {
    this.showAllPlanets = true;
    this.isLoading = true;
    this.subsribeGetPlanets = this.starwarsApiService.getResources('planets/').subscribe((response) => {
      this.isLoading = false;
      this.allPlanets = response as Planet[];
      this.selectedPlanet = null;
    });
  }

  getPlanetDetails(selectedPlanet: string) {
    const planetId = this.helperService.getId(selectedPlanet);
    this.getPlanet(planetId);
    this.showAllPlanets = false;
  }

  getSelectedPlanet(item: Stage) {
    this.selectedPlanet = item as Planet;
  }

  ngOnInit(): void {
    this.getPlanets();
    history.state && history.state.selected ? this.getPlanetDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeGetPlanets?.unsubscribe();
    this.subsribeGetPlanet?.unsubscribe();
  }
}
