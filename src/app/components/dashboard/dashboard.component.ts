import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <mat-card class="bg-white dark:bg-gray-800 shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-gray-900 dark:text-gray-100"
            >Total Books</mat-card-title
          >
        </mat-card-header>
        <mat-card-content>
          <p class="text-4xl font-bold mt-4 text-gray-900 dark:text-gray-100">
            {{ stats.totalBooks }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card class="bg-white dark:bg-gray-800 shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-gray-900 dark:text-gray-100"
            >Available Books</mat-card-title
          >
        </mat-card-header>
        <mat-card-content>
          <p class="text-4xl font-bold mt-4 text-gray-900 dark:text-gray-100">
            {{ stats.availableBooks }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card class="bg-white dark:bg-gray-800 shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-gray-900 dark:text-gray-100"
            >Unique Titles</mat-card-title
          >
        </mat-card-header>
        <mat-card-content>
          <p class="text-4xl font-bold mt-4 text-gray-900 dark:text-gray-100">
            {{ stats.uniqueBooks }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card class="col-span-full bg-white dark:bg-gray-800 shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-gray-900 dark:text-gray-100"
            >Genre Breakdown</mat-card-title
          >
        </mat-card-header>
        <mat-card-content>
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
          >
            <div
              *ngFor="let genre of getGenres()"
              class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <p class="font-semibold text-gray-900 dark:text-gray-100">
                {{ genre }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ stats.genreBreakdown[genre] }}
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats: {
    totalBooks: number;
    availableBooks: number;
    uniqueBooks: number;
    genreBreakdown: Record<string, number>;
  } = {
    totalBooks: 0,
    availableBooks: 0,
    uniqueBooks: 0,
    genreBreakdown: {},
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.stats = this.bookService.getDashboardStats();
  }

  getGenres(): string[] {
    return Object.keys(this.stats.genreBreakdown);
  }
}
