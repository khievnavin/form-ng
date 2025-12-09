export interface Submission {
  id: number;
  data: any;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export class StorageService {
  private key = 'submissions';

  private load(): Submission[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  private save(submissions: Submission[]) {
    localStorage.setItem(this.key, JSON.stringify(submissions));
  }

  getAll(): Submission[] {
    return this.load();
  }

  add(doc: Submission) {
    const list = this.load();
    list.push(doc);
    this.save(list);
  }

  update(id: number, update: Partial<Submission>) {
    const list = this.load();
    const index = list.findIndex(x => x.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...update, updatedAt: new Date() };
      this.save(list);
    }
  }
}

export const storageService = new StorageService();
