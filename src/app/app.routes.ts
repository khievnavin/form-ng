import { Routes } from '@angular/router';
import { CForm } from './components/c-form/c-form';
import { Submissions } from './components/submissions/submissions';

export const routes: Routes = [
  {
    path: '',
    component: CForm
  },
  { path: 'submissions',
   component: Submissions 
  },
];
