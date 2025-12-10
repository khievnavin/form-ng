import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type SubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface WorkflowStep {
  step: number;
  assignedTo: string; // userId
  action?: 'agreed' | 'approved' | 'rejected' | 'forwarded' | 'draft' | 'submitted' | 'pending';
  comment?: string;
  date?: Date;
}

export interface Submission {
  id: number;
  data: any;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
  currentStep: number;
  workflow: WorkflowStep[];
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private key = 'submissions';
  private platformId = inject(PLATFORM_ID);

  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  private load(): Submission[] {
    if (!this.isBrowser()) return [];
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  private save(submissions: Submission[]) {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.key, JSON.stringify(submissions));
  }

  getAll(): Submission[] {
    return this.load();
  }

  getById(id: number): Submission | undefined {
    return this.load().find(x=> x.id === id);
  }

  add(doc: Submission) {
    if (!this.isBrowser()) return;
    const list = this.load();
    list.push(doc);
    this.save(list);
  }

  // update(id: number, update: Partial<Submission>) {
  //   if (!this.isBrowser()) return;
  //   const list = this.load();
  //   const idx = list.findIndex(x => x.id === id);
  //   if (idx !== -1) {
  //     list[idx] = { ...list[idx], ...update, updatedAt: new Date() };
  //     this.save(list);
  //   }
  // }

  update(id: number, update: Partial<Submission>) {
    if(!this.isBrowser())
      return;

    const list = this.load();
    const index = list.findIndex(x => x.id === id);
    if(index === -1)
      return;

    list[index] = {...list[index], ...update, updatedAt: new Date()};
    this.save(list);
    console.log("update:", update);
    
  }
}

