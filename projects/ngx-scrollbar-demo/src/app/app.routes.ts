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
    path: 'other-integrations',
    loadComponent: () => import('./integration-page/integration-page.component').then(c => c.IntegrationPageComponent),
  },
  {
    path: 'scrollto-element',
    loadComponent: () => import('./example-scrollto-element/example-scrollto-element.component').then(c => c.ExampleScrolltoElementComponent),
  }
];
