import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SearchService } from '../services/search.service';

describe('SearchFormComponent', () => {
  let searchFormComponent: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        SearchService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    searchFormComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(searchFormComponent).toBeTruthy();
  });

  it('should call searchService.search OnInit', () => {
    const searchSpy = spyOn(searchFormComponent.searchService, "search");
    searchFormComponent.ngOnInit();
    expect(searchSpy).toHaveBeenCalled();
  });

});
