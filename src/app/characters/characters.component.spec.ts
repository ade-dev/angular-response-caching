import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharactersComponent, MatAutocomplete],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
