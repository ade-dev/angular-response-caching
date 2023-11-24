import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarshipsComponent } from './starships.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';

describe('StarshipsComponent', () => {
  let component: StarshipsComponent;
  let fixture: ComponentFixture<StarshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarshipsComponent, MatAutocomplete],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StarshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
