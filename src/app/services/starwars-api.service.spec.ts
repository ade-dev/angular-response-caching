
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { StarwarsApiService } from './starwars-api.service';

describe('StarwarsApiService', () => {
  let mockService: StarwarsApiService;

  beforeEach(() => {
    // Configuring testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [StarwarsApiService]

    });
    mockService = TestBed.inject(StarwarsApiService);
  });
  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });
});
