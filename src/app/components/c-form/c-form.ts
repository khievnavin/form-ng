import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { formDB, Submission, SubmissionStatus } from '../../form.dto';
import { Router } from '@angular/router';
import { StorageService, Submission } from '../../../storage.service';
import { WORKFLOW } from '../../workflow.config';
import { UserService } from '../user.service';

@Component({
  selector: 'app-c-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './c-form.html',
  styleUrls: ['./c-form.css'],
})
export class CForm implements OnInit {
  formSchema: any;
  form!: FormGroup;
  submission?: Submission;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private storage: StorageService,
    private userService: UserService
  ) {}

  @Output() formCancelled = new EventEmitter<void>();

  ngOnInit() {
    this.http.get('/assets/form.json').subscribe((schema: any) => {
      this.formSchema = schema; // Store schema
      this.buildForm(schema.fields); // Build form dynamically
    });
  }

  buildForm(fields: any[]) {
    const controls: any = {};

    fields.forEach((field) => {
      controls[field.name] = ['']; // default empty control
    });

    this.form = this.fb.group(controls);
  }

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX - The Rise of Skywalker',
  ];
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  // submit() {
  //   console.log("Form Submitted:", this.form.value);
  // }

  cancel() {
    this.formCancelled.emit();
    console.log('Form cancelled by user.');
  }

  generateId(): number {
    const all = this.storage.getAll();
    if (all.length === 0) return 1;
    return Math.max(...all.map((x) => x.id)) + 1;
  }

  saveDraft() {
    const doc: Submission = {
      id: this.generateId(),
      data: this.form.value,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),

      currentStep: 1,
      workflow: [
        {
          step: 1,
          assignedTo: 'user1',
          action: 'draft',
          date: new Date(),
          comment: 'Form saved as draft',
        },
      ],
    };

    this.storage.add(doc);
    this.router.navigate(['/submissions']);
  }

  submit() {
  if (this.form.invalid) {
    alert("Fix form errors.");
    return;
  }

  const doc: Submission = {
    id: this.generateId(),
    data: this.form.value,
    status: 'submitted',
    createdAt: new Date(),
    updatedAt: new Date(),

    currentStep: 1,
    workflow: [
      {
        step: 1,
        assignedTo: 'user1',
        action: 'submitted',
        date: new Date(),
        comment: 'Form submitted'
      }
    ]
  };

  this.storage.add(doc);
  this.router.navigate(['/submissions']);
}


  performAction(action: 'agree' | 'reject', comment: string) {
    if (!this.submission) return;
    const CURRENT_USER = this.userService.getCurrentUser();

    const step = this.submission.currentStep;
    const wf = this.submission.workflow;

    if (action === 'reject') {
      this.storage.update(this.submission.id, {
        status: 'rejected',
        workflow: [
          ...wf,
          {
            step,
            assignedTo: CURRENT_USER,
            action: 'rejected',
            comment,
            date: new Date(),
          },
        ],
      });
      return;
    }

    // Action: Agree → Move to next step
    const next = WORKFLOW.find((x) => x.step === step + 1);

    if (!next) {
      // Final approval
      this.storage.update(this.submission.id, {
        status: 'approved',
        workflow: [
          ...wf,
          {
            step,
            assignedTo: CURRENT_USER,
            action: 'approved',
            comment,
            date: new Date(),
          },
        ],
      });
      return;
    }

    // Forward to next assigned user
    this.storage.update(this.submission.id, {
      currentStep: next.step,
      workflow: [
        ...wf,
        {
          step,
          assignedTo: CURRENT_USER,
          action: 'agreed',
          comment,
          date: new Date(),
        },
      ],
    });
  }
}

// // Approve form
// approveForm(id: number) {
//   formDB.submissions.update(id, {
//     status: 'approved',
//     updatedAt: new Date(),
//   });
//   alert('Form approved!');
// }

// // Reject form
// rejectForm(id: number) {
//   formDB.submissions.update(id, {
//     status: 'rejected',
//     updatedAt: new Date(),
//   });
//   alert('Form rejected!');
// }
