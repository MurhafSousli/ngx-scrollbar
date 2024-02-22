import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-page/home-page.component').then(c => c.HomePageComponent),
    pathMatch: 'full'
  },
  {
    path: 'material',
    loadComponent: () => import('./material-page/material-page.component').then(c => c.MaterialPageComponent),
  },
  {
    path: 'integration',
    loadComponent: () => import('./integration-page/integration-page.component').then(c => c.IntegrationPageComponent),
  },
  // {
  //   path: 'lab',
  //   loadComponent: () => import('./lab/lab.component').then(c => c.LabComponent),
  // }
];
