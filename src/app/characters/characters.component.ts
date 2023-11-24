import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { HelperService } from '../services/helper.service';
import { Stage, Planet, Person } from '../models/swapi';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchFormComponent],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit, OnDestroy {

  constructor(
    private starwarsApiService: StarwarsApiService,
    private helperService: HelperService
  ) { }

  subsribeGetCharacters!: Subscription;
  subsribeGetCharacter!: Subscription;
  allCharacters!: Person[];
  selectedCharacter: Person | null = null;
  selectedPlanetName = '';
  showAllCharacters = false;
  isLoading = false;

  getCharacterPlanet(endPoint: string) {
    this.subsribeGetCharacters = this.starwarsApiService.getSpecificResource<Planet>(endPoint).subscribe((response: Planet) => {
      this.isLoading = false;
      this.showAllCharacters = false;
      this.selectedPlanetName = response.name;
    });
  }

  getCharacter(endPoint: string) {
    this.subsribeGetCharacters = this.starwarsApiService.getSpecificResource<Person>(endPoint).subscribe((response: Person) => {
      this.selectedCharacter = response;
      const planetId = this.helperService.getId(this.selectedCharacter?.homeworld);
      this.getCharacterPlanet(planetId);
    });
  }

  getCharacters() {
    this.showAllCharacters = true;
    this.isLoading = true;
    this.subsribeGetCharacter = this.starwarsApiService.getResources('people/').subscribe((response) => {
      this.isLoading = false;
      this.allCharacters = response as Person[];
      this.selectedCharacter = null;
    });
  }

  getCharacterDetails(selectedPerson: string) {
    this.showAllCharacters = false;
    this.isLoading = true;
    const characterId = this.helperService.getId(selectedPerson);
    this.getCharacter(characterId);
  }

  getSelectedCharacter(item: Stage) {
    this.selectedCharacter = item as Person;
  }

  ngOnInit(): void {
    this.getCharacters();
    history.state && history.state.selected ? this.getCharacterDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeGetCharacters?.unsubscribe();
    this.subsribeGetCharacter?.unsubscribe();
  }
}
