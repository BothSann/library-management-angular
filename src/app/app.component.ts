// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <mat-toolbar
        class="bg-white dark:bg-gray-800 shadow-md dark:text-gray-100 "
      >
        <button
          class="dark:text-gray-100 "
          mat-icon-button
          (click)="sidenav.toggle()"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <span class="ml-4 text-xl font-semibold ">Library Manager</span>
        <span class="flex-1"></span>
        <button
          mat-icon-button
          (click)="toggleDarkMode()"
          class="dark:text-gray-100"
        >
          <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="h-[calc(100vh-64px)] dark:bg-gray-800">
        <mat-sidenav
          #sidenav
          mode="side"
          class="w-64 p-4 bg-white dark:bg-gray-800 "
        >
          <nav class="space-y-2 ">
            <a mat-button class="w-full text-left" routerLink="/dashboard">
              <mat-icon class="mr-2">dashboard</mat-icon> Dashboard
            </a>
            <a mat-button class="w-full text-left" routerLink="/books">
              <mat-icon class="mr-2">library_books</mat-icon> Books
            </a>
            <a mat-button class="w-full text-left" routerLink="/add-book">
              <mat-icon class="mr-2">add</mat-icon> Add Book
            </a>
          </nav>
        </mat-sidenav>

        <mat-sidenav-content class="p-6 dark:bg-gray-900">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export class AppComponent {
  isDarkMode = localStorage.getItem('darkMode') === 'true';

  constructor() {
    // Apply dark mode on initial load if it was previously enabled
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    document.documentElement.classList.toggle('dark');
  }
}
