import { Routes } from '@angular/router';
import { Pseudonymizer } from './pseudonymizer/pseudonymizer';
import { DePseudonymizer } from './de-pseudonymizer/de-pseudonymizer';

export const routes: Routes = [
  {
    path: 'pseudo',
    component: Pseudonymizer
  },
  {
    path: 'de-pseudo',
    component: DePseudonymizer
  },
  {
    path: '',
    redirectTo: 'pseudo',
    pathMatch: 'full'
  }
];
