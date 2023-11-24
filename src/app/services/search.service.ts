import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, debounceTime, switchMap, tap, Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';

@Injectable()

export class SearchService<T> {

  constructor(
    private starwarsApiService: StarwarsApiService
  ) { }

  searchResult: T[] = [];
  subsribeSearch!: Subscription;
  isLoading = false;
  isResults = true;

  search(searchInput: FormControl<string | null>, searchType: string) {
    this.subsribeSearch = searchInput.valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
        this.isResults = false;
      }),
      filter(value => {
        return value !== null && value.trim() !== '';
      }),
      debounceTime(1000),
      switchMap(value => this.starwarsApiService.searchResources(searchType, value))
    )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.count !== 0) {
            this.searchResult = response.results as T[];
            this.isResults = true;
          }
          else {
            this.isResults = false;
          }
        },
        error: (error) => (
          console.log('error', error)
        )
      });
  }

  unsubscribeSearch() {
    this.subsribeSearch.unsubscribe();
  }
}
