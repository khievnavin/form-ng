import Dexie from 'dexie';

export type SubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Submission {
  id?: number;
  data: any;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class FormDB extends Dexie {
  submissions!: Dexie.Table<Submission, number>;

  constructor() {
    super('FormDB');
    this.version(1).stores({
      submissions: '++id,status,createdAt'
    });
  }
}

export const formDB = new FormDB();
