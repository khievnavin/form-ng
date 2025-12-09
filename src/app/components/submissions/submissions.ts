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
import { storageService, Submission } from '../../../storage.service';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submissions.html',
  styleUrls: ['./submissions.css'],
})
export class Submissions implements OnInit {
  list: Submission[] = [];

  ngOnInit() {
    this.load();
  }

  load() {
    this.list = storageService.getAll();
  }

  approve(id: number) {
    storageService.update(id, { status: 'approved' });
    this.load();
  }

  reject(id: number) {
    storageService.update(id, { status: 'rejected' });
    this.load();
  }
}
