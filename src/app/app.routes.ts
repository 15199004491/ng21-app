import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FactoryListComponent } from './modules/factory/pages/factory-list/factory-list.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'factory/list', component: FactoryListComponent },
];