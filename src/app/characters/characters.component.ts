import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { StarwarsApiService } from '../services/starwars-api.service';
import { Person } from '../models/person';
import { HelperService } from '../services/helper.service';

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
  charactersControl = new FormControl<string>('');
  minimumCharacters: number = 2;
  characterList: Person[] = [];
  allCharacters: Person[] = [];
  selectedCharacter: Person | null = null;
  selectedPlanetName: string = '';
  showAllCharacters: boolean = false;
  isLoading: boolean = false;

  getCharacterPlanet(endPoint: string) {
    this.subsribeGetCharacters = this.starwarsApiService.getSpecificResource(endPoint).subscribe((response: any) => {
      this.selectedPlanetName = response.name;
    });
  }

  getCharacter(endPoint: string) {
    this.subsribeGetCharacters = this.starwarsApiService.getSpecificResource(endPoint).subscribe((response: any) => {
      this.selectedCharacter = response;
      const planetId = this.helperService.getId(this.selectedCharacter?.homeworld!);
      this.getCharacterPlanet(planetId!);
    });
  }

  getAllCharacters() {
    this.isLoading = true;
    this.subsribeGetAllCharacters = this.starwarsApiService.getAllResources('people/').subscribe((response: any) => {
      this.allCharacters = response;
      this.isLoading = false;
      this.showAllCharacters = true;
      this.selectedCharacter = null;
    });
  }

  mapCharacterDetails(selectedPerson: Person) {
    this.selectedCharacter = selectedPerson;
    const planetId = this.helperService.getId(this.selectedCharacter.homeworld);
    this.getCharacterPlanet(planetId);
  }

  getCharacterDetails(selectedPerson: string) {
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
      switchMap(value => this.starwarsApiService.searchResources('people', value!))
    )
      .subscribe((response: any) => {
        if (response.count === 0) {
          this.characterList = [];
        } else {
          this.characterList = response.results;
        }
        this.characterList = response.results;
      });
  }

  ngOnInit(): void {
    this.searchCharacters();
    history.state && history.state.selected ? this.getCharacterDetails(history.state.selected) : '';
  }

  ngOnDestroy() {
    this.subsribeSearchCharacters?.unsubscribe();
    this.subsribeGetCharacters?.unsubscribe();
    this.subsribeGetAllCharacters?.unsubscribe();
  };
}
