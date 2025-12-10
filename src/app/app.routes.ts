import { Routes } from '@angular/router';
import { CForm } from './components/c-form/c-form';
import { Submissions } from './components/submissions/submissions';
import { SubmissionDetail } from './components/submission-detail/submission-detail'

export const routes: Routes = [
  {
    path: '',
    component: CForm
  },
  { path: 'submissions',
   component: Submissions 
  },
  { path: 'submissions/:id',
    component: SubmissionDetail 
  },
];
