import { Component, OnInit, inject } from '@angular/core';
import { StarwarsApiService } from '../services/starwars-api.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Stage, Starship } from '../models/swapi';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-starships',
  standalone: true,
  imports: [RouterLink, SearchFormComponent],
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.css']
})
export class StarshipsComponent implements OnInit {

  private starwarsApiService = inject(StarwarsApiService);

  allStarships: Starship[] = [];
  selectedStarship: Starship | null = null;
  selectedStarshipName = '';
  showAllStarships = false;
  isLoading = false;

  getStarship(url: string) {
    this.starwarsApiService.getResource<Starship>(url).subscribe((response: Starship) => {
      this.isLoading = false;
      this.showAllStarships = false;
      this.selectedStarship = response;
    });
  }

  getStarships() {
    this.showAllStarships = true;
    this.isLoading = true;
    this.starwarsApiService.getResources('starships/').subscribe((response) => {
      this.isLoading = false;
      this.allStarships = response as Starship[];
      this.selectedStarship = null;
    });
  }

  getStarshipDetails(selectedStarship: string) {
    this.getStarship(selectedStarship);
    this.showAllStarships = false;
  }

  getSelectedStarship(item?: Stage) {
    this.showAllStarships = false;
    this.selectedStarship = item as Starship;
  }

  ngOnInit(): void {
    if (history.state && history.state.selected) {
      this.getStarshipDetails(history.state.selected);
    }
    else {
      this.getStarships();
    }
  }
}
