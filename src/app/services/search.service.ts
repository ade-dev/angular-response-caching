import { Injectable, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, map, distinctUntilChanged, tap, filter, switchMap } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';

@Injectable({
  providedIn: 'root'
})

export class SearchService<T> {

  private starwarsApiService = inject(StarwarsApiService);

  searchResult: T[] = [];
  subscribeSearch!: Subscription;
  isLoading = false;
  isResults = false;
  noResults = false;

  search(searchInput: FormControl<string | null>, searchType: string) {
    this.subscribeSearch = searchInput.valueChanges.pipe(
      debounceTime(200),
      map(value => value!.trim()),
      distinctUntilChanged(),
      tap((value) => {
        if (value.length > 0) { this.isLoading = true; }
        this.isResults = false;
        this.noResults = false;
      }),
      filter((value) => value !== null && value !== ''),
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
            this.noResults = true;
          }
        },
        error: (error) => (
          console.log('error', error)
        )
      });
  }
  unsubscribeSearch() {
    this.subscribeSearch.unsubscribe();
  }
}
