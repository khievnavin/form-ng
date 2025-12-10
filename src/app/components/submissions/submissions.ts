// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { formDB, Submission } from '../../form.dto';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-submissions',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './submissions.html',
//   styleUrls: ['./submissions.css'],
// })
// export class Submissions implements OnInit {
//   list: Submission[] = [];

//   constructor(private router: Router){}

//   async ngOnInit() {
//     this.list = await formDB.submissions.toArray();
//     console.log('Loaded submissions:', this.list);
//   }

//   async approve(id?: number) {
//     if (id == null) return;
//     await formDB.submissions.update(id, {
//       status: 'approved',
//       updatedAt: new Date()
//     });
//     this.list = await formDB.submissions.toArray();
//   }

//   async reject(id?: number) {
//     if (id == null) return;
//     await formDB.submissions.update(id, {
//       status: 'rejected',
//       updatedAt: new Date()
//     });
//     this.list = await formDB.submissions.toArray();
//   }

//   back(){
//   this.router.navigate(['/'])
// }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService, Submission } from '../../../storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submissions.html',
  styleUrls: ['./submissions.css'],
})
export class Submissions implements OnInit {
  list: Submission[] = [];

  constructor(private storageService: StorageService, private router: Router) {}
  ngOnInit() {
    this.load();
  }

  load() {
    this.list = this.storageService.getAll();
    console.log('Load Form:', this.storageService.getAll());
  }

  approve(id: number) {
    const item = this.list.find((x) => x.id === id);
    if (!item) return;

    // Prevent changes if already final
    if (item.status === 'approved' || item.status === 'rejected') {
      alert("This submission's status can no longer be changed.");
      return;
    }

    this.storageService.update(id, { status: 'approved' });
    this.load();
  }

  reject(id: number) {
    const item = this.list.find((x) => x.id === id);
    if (!item) return;

    // Prevent changes if already final
    if (item.status === 'approved' || item.status === 'rejected') {
      alert("This submission's status can no longer be changed.");
      return;
    }

    this.storageService.update(id, { status: 'rejected' });
    this.load();
  }

  view(id: number) {
    this.router.navigate(['/submissions', id]);
  }
}
