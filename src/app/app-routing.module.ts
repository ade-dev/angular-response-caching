import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharactersComponent } from './characters/characters.component';
import { PlanetsComponent } from './planets/planets.component';
import { StarshipsComponent } from './starships/starships.component';

const routes: Routes = [
  {
    path: 'characters', component: CharactersComponent
  },
  {
    path: 'planets', component: PlanetsComponent
  },
  {
    path: 'starships', component: StarshipsComponent
  },
  {
    path: '', redirectTo: 'characters', pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
