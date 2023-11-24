import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Stage, Starship } from '../models/swapi';
import { HelperService } from '../services/helper.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-starships',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchFormComponent],
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.css']
})
export class StarshipsComponent implements OnInit, OnDestroy {

  constructor(
    private starwarsApiService: StarwarsApiService,
    private helperService: HelperService
  ) { }

  subsribeGetStarships!: Subscription;
  subsribeGetStarship!: Subscription;
  starshipList: Starship[] = [];
  allStarships: Starship[] = [];
  selectedStarship: Starship | null = null;
  selectedStarshipName = '';
  showAllStarships = false;
  isLoading = false;

  getStarship(endPoint: string) {
    this.subsribeGetStarship = this.starwarsApiService.getSpecificResource<Starship>(endPoint).subscribe((response: Starship) => {
      this.isLoading = false;
      this.showAllStarships = false;
      this.selectedStarship = response;
    });
  }

  getStarships() {
    this.showAllStarships = true;
    this.isLoading = true;
    this.subsribeGetStarships = this.starwarsApiService.getResources('starships/').subscribe((response) => {
      this.isLoading = false;
      this.allStarships = response as Starship[];
      this.selectedStarship = null;
    });
  }

  getStarshipDetails(selectedStarship: string) {
    const starshipId = this.helperService.getId(selectedStarship);
    this.getStarship(starshipId);
    this.showAllStarships = false;
  }

  getSelectedStarship(item: Stage) {
    this.selectedStarship = item as Starship;
  }

  ngOnInit(): void {
    this.getStarships();
    history.state && history.state.selected ? this.getStarshipDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeGetStarships?.unsubscribe();
    this.subsribeGetStarship?.unsubscribe();
  }
}
