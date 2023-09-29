import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { Starship } from '../models/swapi';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-starships',
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.css']
})
export class StarshipsComponent implements OnInit, OnDestroy {

  constructor(
    private starwarsApiService: StarwarsApiService,
    private helperService: HelperService
  ) { }

  subsribeSearchStarships!: Subscription;
  subsribeGetStarships!: Subscription;
  subsribeGetAllStarships!: Subscription;
  starshipsControl = new FormControl<string>('');
  minimumStarships = 2;
  starshipList: Starship[] = [];
  allStarships: Starship[] = [];
  selectedStarship: Starship | null = null;
  selectedStarshipName = '';
  showAllStarships = false;
  isLoading = false;

  getStarship(endPoint: string) {
    this.subsribeGetStarships = this.starwarsApiService.getSpecificResource<Starship>(endPoint).subscribe((response: Starship) => {
      this.selectedStarship = response;
      this.showAllStarships = false;
    });
  }

  getAllStarships() {
    this.showAllStarships = true;
    this.isLoading = true;
    this.subsribeGetAllStarships = this.starwarsApiService.getAllResources<Starship>('starships/').subscribe((response: Starship[]) => {
      this.allStarships = response;
      this.isLoading = false;
      this.selectedStarship = null;
    });
  }

  getStarshipDetails(selectedStarship: string) {
    const starshipId = this.helperService.getId(selectedStarship);
    this.getStarship(starshipId);
    this.showAllStarships = false;
  }

  searchStarships() {
    this.subsribeSearchStarships = this.starshipsControl.valueChanges.pipe(
      filter(value => {
        return value !== null && value.trim() !== '' && value.trim().length >= this.minimumStarships;
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(value => this.starwarsApiService.searchResources('starships', value))
    )
      .subscribe(
        response => {
          response.count === 0 ? this.starshipList = [] : this.starshipList = response.results as Starship[];
        });
  }

  ngOnInit(): void {
    this.getAllStarships();
    this.searchStarships();
    history.state && history.state.selected ? this.getStarshipDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeSearchStarships?.unsubscribe();
    this.subsribeGetStarships?.unsubscribe();
    this.subsribeGetAllStarships?.unsubscribe();
  }
}
