import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { Starship } from '../models/starship';
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
  minimumStarships: number = 2;
  starshipList: Starship[] = [];
  allStarships: Starship[] = [];
  selectedStarship: Starship | null = null;
  selectedStarshipName: string = '';
  showAllStarships: boolean = false;
  isLoading: boolean = false;

  getStarship(endPoint: string) {
    this.subsribeGetStarships = this.starwarsApiService.getSpecificResource(endPoint).subscribe((response: any) => {
      this.selectedStarship = response;
    });
  }

  getAllStarships() {
    this.isLoading = true;
    this.subsribeGetAllStarships = this.starwarsApiService.getAllResources('starships/').subscribe((response: any) => {
      this.allStarships = response;
      this.isLoading = false;
      this.showAllStarships = true;
      this.selectedStarship = null;
    });
  }

  getStarshipDetails(selectedStarship: string) {
    const starshipId = this.helperService.getId(selectedStarship);
    this.getStarship(starshipId);
  }

  searchStarships() {
    this.subsribeSearchStarships = this.starshipsControl.valueChanges.pipe(
      filter(value => {
        return value !== null && value.trim() !== '' && value.trim().length >= this.minimumStarships;
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(value => this.starwarsApiService.searchResources('starships', value!))
    )
      .subscribe((response: any) => {
        if (response.count === 0) {
          this.starshipList = [];
        } else {
          this.starshipList = response.results;
        }
        this.starshipList = response.results;
      });
  }

  ngOnInit(): void {
    this.searchStarships();
    history.state && history.state.selected ? this.getStarshipDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeSearchStarships?.unsubscribe();
    this.subsribeGetStarships?.unsubscribe();
    this.subsribeGetAllStarships?.unsubscribe();
  };
}
