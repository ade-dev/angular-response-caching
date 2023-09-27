import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetsComponent } from './planets.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatLegacyAutocomplete as MatAutocomplete } from '@angular/material/legacy-autocomplete';

describe('PlanetsComponent', () => {
  let component: PlanetsComponent;
  let fixture: ComponentFixture<PlanetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanetsComponent, MatAutocomplete],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
