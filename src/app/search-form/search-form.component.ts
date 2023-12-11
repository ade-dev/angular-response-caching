import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../services/search.service';
import { Stage } from '../models/swapi';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
  providers: [SearchService]
})

export class SearchFormComponent implements OnInit {

  constructor(
    public searchService: SearchService<Stage>
  ) { }

  @Input() apiType: string = '';
  @Output() selectedItemEvent = new EventEmitter<Stage>();

  searchInput = new FormControl<string | null>(null);

  getSelectedItem(item: Stage) {
    this.selectedItemEvent.emit(item);
  }

  ngOnInit(): void {
    this.searchService.search(this.searchInput, this.apiType);
  }
}
