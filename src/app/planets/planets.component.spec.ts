import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetsComponent } from './planets.component';
import { MatAutocomplete } from '@angular/material/autocomplete';

describe('PlanetsComponent', () => {
  let component: PlanetsComponent;
  let fixture: ComponentFixture<PlanetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatAutocomplete],
      imports: [HttpClientTestingModule, PlanetsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
