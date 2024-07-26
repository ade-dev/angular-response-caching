import { Component, OnInit, inject, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../services/search.service';
import { Stage } from '../models/swapi';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})

export class SearchFormComponent implements OnInit {

  public searchService = inject(SearchService<Stage>);

  apiType = input.required<string>();
  selectedItem = model<Stage>();

  searchInput = new FormControl<string | null>(null);

  getSelectedItem(item: Stage) {
    this.selectedItem.set(item);
  }

  ngOnInit(): void {
    this.searchService.search(this.searchInput, this.apiType());
  }
}
