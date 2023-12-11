import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarwarsApiService } from '../services/starwars-api.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Stage, Planet } from '../models/swapi';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planets',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchFormComponent],
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit {

  constructor(
    private starwarsApiService: StarwarsApiService
  ) { }

  planetList: Planet[] = [];
  allPlanets: Planet[] = [];
  selectedPlanet: Planet | null = null;
  selectedPlanetName = '';
  showAllPlanets = false;
  isLoading = false;

  getPlanet(url: string) {
    this.starwarsApiService.getResource<Planet>(url).subscribe((response: Planet) => {
      this.isLoading = false;
      this.showAllPlanets = false;
      this.selectedPlanet = response;
    });
  }

  getPlanets() {
    this.showAllPlanets = true;
    this.isLoading = true;
    this.starwarsApiService.getResources('planets/').subscribe((response) => {
      this.isLoading = false;
      this.allPlanets = response as Planet[];
      this.selectedPlanet = null;
    });
  }

  getPlanetDetails(selectedPlanet: string) {
    this.getPlanet(selectedPlanet);
    this.showAllPlanets = false;
  }

  getSelectedPlanet(item: Stage) {
    this.selectedPlanet = item as Planet;
  }

  ngOnInit(): void {
    history.state && history.state.selected ? this.getPlanetDetails(history.state.selected) : this.getPlanets();
  }
}
