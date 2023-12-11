import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let findRouterLinks: DebugElement[];
  let routerLinks: RouterLink[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, RouterLink, AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
    TestBed.inject(Router).resetConfig([{ path: '**', children: [] }]);

    findRouterLinks = fixture.debugElement.queryAll(By.directive(RouterLink));
    routerLinks = findRouterLinks.map((item) => item.injector.get(RouterLink));

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it(`should have the title 'Star Wars'`, () => {
    expect(appComponent.title).toEqual('Star Wars');
  });

  it('should have RouterLinks', () => {
    expect(routerLinks.length).withContext('should have 3 routerLinks').toBe(3);
    expect(routerLinks[0].href).toBe('/characters');
    expect(routerLinks[1].href).toBe('/starships');
    expect(routerLinks[2].href).toBe('/planets');
  });

  it(`should navigate when the 'characters' link is followed`, fakeAsync(() => {
    fixture.ngZone?.run(
      () => findRouterLinks[0].triggerEventHandler('click', { button: 0 })
    );
    tick();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/characters');
  }));

  it(`should navigate when the 'starships' link is followed`, fakeAsync(() => {
    fixture.ngZone?.run(
      () => findRouterLinks[1].triggerEventHandler('click', { button: 0 })
    );
    tick();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/starships');
  }));

  it(`should navigate when the 'planets' link is followed`, fakeAsync(() => {
    fixture.ngZone?.run(
      () => findRouterLinks[2].triggerEventHandler('click', { button: 0 })
    );
    tick();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/planets');
  }));

});
