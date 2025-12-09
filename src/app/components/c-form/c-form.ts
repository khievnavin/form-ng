import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { formDB, Submission, SubmissionStatus } from '../../form.dto';
import { Router } from '@angular/router';
import { storageService, Submission } from '../../../storage.service';

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

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) { }

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

  saveDraft() {
    const doc: Submission = {
      id: Date.now(),
      data: this.form.value,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    storageService.add(doc);
    alert('Draft Saved!');
  }

  submit() {
    if (this.form.invalid) {
      console.log('submitted!!', this.form.value);
      alert('Invalid form. Fix errors.');
      return;
    }

    const doc: Submission = {
      data: this.form.value,
      status: 'submitted',
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 0
    };

    storageService.add(doc);
    alert('Form submitted!');
    this.router.navigate(['/submissions']);
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
