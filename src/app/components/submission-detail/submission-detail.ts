import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService, Submission } from '../../../storage.service';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../user.service';


@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submission-detail.html',
  styleUrls: ['./submission-detail.css'],
})
export class SubmissionDetail implements OnInit {

  submission?: Submission;
  notFound = false;
  comment: string = '';

  WORKFLOW = [
    { step: 1, assignedTo: 'user1' },
    { step: 2, assignedTo: 'user3' },
    { step: 3, assignedTo: 'user5' }
  ];

    platformId = inject(PLATFORM_ID);
    currentUser: string = 'user1';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (isNaN(id)) {
      this.notFound = true;
      return;
    }

    const item = this.storage.getById(id);
    if (!item) {
      this.notFound = true;
      return;
    } 

    this.submission = item;
     this.currentUser = this.userService.getCurrentUser();
  }

  changeUser(e: any) {
  this.userService.setCurrentUser(e.target.value);
  this.currentUser = e.target.value;
  this.ngOnInit(); // refresh
}

  backToList() {
    this.router.navigate(['/submissions']);
  }

  backToForm() {
    this.router.navigate(['/']);
  }

  reload() {
    if (this.submission) {
      this.submission = this.storage.getById(this.submission.id);
    }
  }

 performAction(action: 'agree' | 'reject', comment: string) {
  if (!this.submission) return;

  const step = this.submission.currentStep;
  const workflow = this.submission.workflow;

  // Reject → Finalize
  if (action === 'reject') {
    this.submission.status = 'rejected';

    workflow.push({
      step,
      assignedTo: this.currentUser,
      action: 'rejected',
      comment,
      date: new Date()
    });

    this.storage.update(this.submission.id, this.submission);
    this.reload();
    return;
  }

  // Get next step
  const next = this.WORKFLOW.find(w => w.step === step + 1);

  // If there is NO next → final approval
  if (!next) {
    this.submission.status = 'approved';

    workflow.push({
      step,
      assignedTo: this.currentUser,
      action: 'approved',
      comment,
      date: new Date()
    });

    this.storage.update(this.submission.id, this.submission);
    this.reload();
    return;
  }

  // 1️⃣ Record that the CURRENT user agreed
  workflow.push({
    step,
    assignedTo: this.currentUser,
    action: 'agreed',
    comment,
    date: new Date()
  });

  // 2️⃣ Move to NEXT STEP
  this.submission.currentStep = next.step;

  // 3️⃣ Add NEXT STEP as pending assignment
  workflow.push({
    step: next.step,
    assignedTo: next.assignedTo,
    action: 'pending',
    date: new Date()
  });

  this.storage.update(this.submission.id, this.submission);
  this.reload();

  console.log("perfomAction:", this.performAction);
  
}


  isAssignedUser() {
    return (
      this.submission?.workflow.find(
        x => x.step === this.submission?.currentStep
      )?.assignedTo === this.currentUser
    );
  }

  isFinalized() {
    return (
      this.submission?.status === 'approved' ||
      this.submission?.status === 'rejected'
    );
  }
}
