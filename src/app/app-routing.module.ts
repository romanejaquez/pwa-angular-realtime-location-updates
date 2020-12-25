import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';


const routes: Routes = [
  {
    component: MapPageComponent,
    path: 'map'
  },
  {
    component: LandingPageComponent,
    path: 'landing'
  },
  {
    component: WelcomePageComponent,
    path: 'welcome'
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
