import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { HelperService } from '../services/helper.service';
import { Planet, Person } from '../models/swapi';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit, OnDestroy {

  constructor(
    private starwarsApiService: StarwarsApiService,
    private helperService: HelperService
  ) { }

  subsribeSearchCharacters!: Subscription;
  subsribeGetCharacters!: Subscription;
  subsribeGetAllCharacters!: Subscription;
  charactersControl = new FormControl<string | null>(null);
  minimumCharacters = 2;
  characterList: Person[] = [];
  allCharacters!: Person[];
  selectedCharacter: Person | null = null;
  selectedPlanetName = '';
  showAllCharacters = false;
  isLoading = false;

  getCharacterPlanet(endPoint: string) {
    this.subsribeGetCharacters = this.starwarsApiService.getSpecificResource<Planet>(endPoint).subscribe((response: Planet) => {
      this.selectedPlanetName = response.name;
      this.showAllCharacters = false;
    });
  }

  getCharacter(endPoint: string) {
    this.subsribeGetCharacters = this.starwarsApiService.getSpecificResource<Person>(endPoint).subscribe((response: Person) => {
      this.selectedCharacter = response;
      const planetId = this.helperService.getId(this.selectedCharacter?.homeworld);
      this.getCharacterPlanet(planetId);
      this.showAllCharacters = false;
    });
  }

  getAllCharacters() {
    this.showAllCharacters = true;
    this.isLoading = true;
    this.subsribeGetAllCharacters = this.starwarsApiService.getAllResources<Person>('people/').subscribe((response: Person[]) => {
      this.allCharacters = response;
      this.isLoading = false;
      this.selectedCharacter = null;
    });
  }

  mapCharacterDetails(selectedPerson: Person) {
    this.selectedCharacter = selectedPerson;
    const planetId = this.helperService.getId(this.selectedCharacter.homeworld);
    this.getCharacterPlanet(planetId);
    this.showAllCharacters = false;
  }

  getCharacterDetails(selectedPerson: string) {
    this.showAllCharacters = false;
    const characterId = this.helperService.getId(selectedPerson);
    this.getCharacter(characterId);
  }

  searchCharacters() {
    this.subsribeSearchCharacters = this.charactersControl.valueChanges.pipe(
      filter(value => {
        return value !== null && value.trim() !== '' && value.trim().length >= this.minimumCharacters;
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(value => this.starwarsApiService.searchResources('people', value))
    )
      .subscribe(
        response => {
          response.count === 0 ? this.characterList = [] : this.characterList = response.results as Person[];
        }
      );
  }

  ngOnInit(): void {
    this.getAllCharacters();
    this.searchCharacters();
    history.state && history.state.selected ? this.getCharacterDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeSearchCharacters?.unsubscribe();
    this.subsribeGetCharacters?.unsubscribe();
    this.subsribeGetAllCharacters?.unsubscribe();
  }
}
