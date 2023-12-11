import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarwarsApiService } from '../services/starwars-api.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Stage, Planet, Person } from '../models/swapi';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchFormComponent],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {

  constructor(
    private starwarsApiService: StarwarsApiService
  ) { }

  allCharacters!: Person[];
  selectedCharacter: Person | null = null;
  selectedPlanetName = '';
  showAllCharacters = false;
  isLoading = false;

  getCharacterPlanet(url: string) {
    this.starwarsApiService.getResource<Planet>(url).subscribe((response: Planet) => {
      this.isLoading = false;
      this.showAllCharacters = false;
      this.selectedPlanetName = response.name;
    });
  }

  getCharacter(url: string) {
    this.starwarsApiService.getResource<Person>(url).subscribe((response: Person) => {
      this.selectedCharacter = response;
      this.getCharacterPlanet(this.selectedCharacter?.homeworld);
    });
  }

  getCharacters() {
    this.showAllCharacters = true;
    this.isLoading = true;
    this.starwarsApiService.getResources('people/').subscribe((response) => {
      this.isLoading = false;
      this.allCharacters = response as Person[];
      this.selectedCharacter = null;
    });
  }

  getCharacterDetails(selectedPerson: string) {
    this.showAllCharacters = false;
    this.isLoading = true;
    this.getCharacter(selectedPerson);
  }

  getSelectedCharacter(item: Stage) {
    const selectedCharacter = item as Person;
    this.getCharacterDetails(selectedCharacter.url);
  }

  ngOnInit(): void {
    history.state && history.state.selected ? this.getCharacterDetails(history.state.selected) : this.getCharacters();
  }
}
