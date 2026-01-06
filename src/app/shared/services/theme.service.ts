import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  setTheme(theme: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  init() {
    const saved = localStorage.getItem('theme') as 'dark' | 'light';
    if (saved) {
      this.setTheme(saved);
    }
  }
}
