// src/app/components/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row gap-4 md:items-center">
        <mat-form-field class="flex-1 dark:text-gray-100">
          <mat-label>Search</mat-label>
          <input
            matInput
            (keyup)="applyFilter($event)"
            placeholder="Search books..."
            class="dark:text-gray-100"
          />
        </mat-form-field>

        <mat-form-field class="dark:text-gray-100">
          <mat-label>Genre Filter</mat-label>
          <mat-select
            (selectionChange)="filterByGenre($event.value)"
            class="dark:text-gray-100"
          >
            <mat-option value="">All</mat-option>
            <mat-option *ngFor="let genre of genres" [value]="genre">
              {{ genre }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <table
        mat-table
        [dataSource]="filteredBooks"
        class="w-full bg-white dark:bg-gray-800 shadow-lg text-gray-900 dark:text-gray-100"
      >
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td class="dark:text-gray-100" mat-cell *matCellDef="let book">
            {{ book.title }}
          </td>
        </ng-container>

        <ng-container matColumnDef="author">
          <th mat-header-cell *matHeaderCellDef>Author</th>
          <td class="dark:text-gray-100" mat-cell *matCellDef="let book">
            {{ book.author }}
          </td>
        </ng-container>

        <ng-container matColumnDef="genre">
          <th mat-header-cell *matHeaderCellDef>Genre</th>
          <td class="dark:text-gray-100" mat-cell *matCellDef="let book">
            {{ book.genre }}
          </td>
        </ng-container>

        <ng-container matColumnDef="copies">
          <th mat-header-cell *matHeaderCellDef>Copies</th>
          <td class="dark:text-gray-100" mat-cell *matCellDef="let book">
            {{ book.available }}/{{ book.numberOfCopies }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let book">
            <button
              class="dark:text-gray-100"
              mat-icon-button
              color="primary"
              (click)="editBook(book)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              class="dark:text-gray-100"
              mat-icon-button
              color="warn"
              (click)="deleteBook(book)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr
          mat-header-row
          *matHeaderRowDef="displayedColumns"
          class="bg-gray-50 dark:bg-gray-700"
        ></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        ></tr>
      </table>
    </div>
  `,
})
export class BookListComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'author',
    'genre',
    'copies',
    'actions',
  ];
  books: Book[] = [];
  filteredBooks: Book[] = [];
  genres: string[] = [];

  constructor(
    private bookService: BookService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
      this.filteredBooks = books;
      this.genres = [...new Set(books.map((book) => book.genre))];
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBooks = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(filterValue) ||
        book.author.toLowerCase().includes(filterValue) ||
        book.genre.toLowerCase().includes(filterValue)
    );
  }

  filterByGenre(genre: string): void {
    this.filteredBooks = genre
      ? this.books.filter((book) => book.genre === genre)
      : this.books;
  }

  editBook(book: Book): void {
    this.router.navigate(['/edit-book', book.id]);
  }

  deleteBook(book: Book): void {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${book.title}?`
    );
    if (confirmDelete) {
      this.bookService.deleteBook(book.id!);
      this.snackBar.open('Book deleted successfully', 'Close', {
        duration: 3000,
      });
    }
  }
}
