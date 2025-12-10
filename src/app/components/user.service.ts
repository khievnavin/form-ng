import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UserService {

  private platformId = inject(PLATFORM_ID);

  getCurrentUser(): string {
    if (!isPlatformBrowser(this.platformId)) return 'guest';
    return localStorage.getItem('currentUser') || 'user1';
  }

  setCurrentUser(user: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('currentUser', user);
  }
}
