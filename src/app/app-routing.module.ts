import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { ChartJSLineComponent } from './chart-js-line/chart-js-line.component';
import { ChartJSBarComponent } from './chart-js-bar/chart-js-bar.component';
import { Error404Component } from './components/errors/404.component';
const routes: Routes = [
  { path: 'welcome', component: LandingComponent, canDeactivate: ['CheckIfRegistered'] },
  { path: 'chart-js-sample-line', component: ChartJSLineComponent },
  { path: 'chart-js-sample-bar', component: ChartJSBarComponent },
  { path: '404', component: Error404Component },
  { path: 'stocks', loadChildren: () => import('./stocks/stocks-sample.model').then(m => m.StocksSampleModule) },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
