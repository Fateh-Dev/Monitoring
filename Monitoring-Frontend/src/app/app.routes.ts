import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ServerDetailComponent } from './components/server-detail/server-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'serveur/:id', component: ServerDetailComponent },
  { path: '**', redirectTo: 'dashboard' },
];
