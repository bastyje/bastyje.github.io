import { Routes } from '@angular/router';
import { Pseudonymizer } from './pseudonymizer/pseudonymizer';
import { DePseudonymizer } from './de-pseudonymizer/de-pseudonymizer';
import { GetFile } from './get-file/get-file';

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
  },
  {
    path: '**',
    redirectTo: 'pseudo'
  }
];
