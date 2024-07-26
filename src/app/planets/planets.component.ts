import { Component, OnInit, inject } from '@angular/core';
import { StarwarsApiService } from '../services/starwars-api.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Stage, Planet } from '../models/swapi';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planets',
  standalone: true,
  imports: [RouterLink, SearchFormComponent],
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit {

  private starwarsApiService = inject(StarwarsApiService);

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

  getSelectedPlanet(item?: Stage) {
    this.showAllPlanets = false;
    this.selectedPlanet = item as Planet;
  }

  ngOnInit(): void {
    if (history.state && history.state.selected) {
      this.getPlanetDetails(history.state.selected);
    }
    else {
      this.getPlanets();
    }
  }
}
