// src/app/components/edit-book/edit-book.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <!-- sss -->
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Edit Book
      </h2>

      <form
        *ngIf="book"
        [formGroup]="bookForm"
        (ngSubmit)="onSubmit()"
        class="space-y-4"
      >
        <mat-form-field class="w-full dark:text-gray-100">
          <mat-label>Title</mat-label>
          <input
            matInput
            class="dark:text-gray-100"
            formControlName="title"
            placeholder="Enter book title"
          />
          <mat-error *ngIf="bookForm.get('title')?.errors?.['required']">
            Title is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full dark:text-gray-100">
          <mat-label>Author</mat-label>
          <input
            matInput
            class="dark:text-gray-100"
            formControlName="author"
            placeholder="Enter author name"
          />
          <mat-error *ngIf="bookForm.get('author')?.errors?.['required']">
            Author is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full dark:text-gray-100">
          <mat-label>Genre</mat-label>
          <mat-select formControlName="genre" class="dark:text-gray-100">
            <mat-option
              *ngFor="let genre of genres"
              [value]="genre"
              class="dark:text-gray-100"
            >
              {{ genre }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="bookForm.get('genre')?.errors?.['required']">
            Genre is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full dark:text-gray-100">
          <mat-label>Publication Year</mat-label>
          <input
            matInput
            class="dark:text-gray-100"
            type="number"
            formControlName="publicationYear"
            placeholder="Enter publication year"
          />
          <mat-error
            *ngIf="bookForm.get('publicationYear')?.errors?.['required']"
          >
            Publication year is required
          </mat-error>
          <mat-error
            *ngIf="bookForm.get('publicationYear')?.errors?.['min'] || 
                           bookForm.get('publicationYear')?.errors?.['max']"
          >
            Please enter a valid year between 1000 and {{ currentYear }}
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full dark:text-gray-100">
          <mat-label>Number of Copies</mat-label>
          <input
            matInput
            class="dark:text-gray-100"
            type="number"
            formControlName="numberOfCopies"
            placeholder="Enter number of copies"
          />
          <mat-error
            *ngIf="bookForm.get('numberOfCopies')?.errors?.['required']"
          >
            Number of copies is required
          </mat-error>
          <mat-error *ngIf="bookForm.get('numberOfCopies')?.errors?.['min']">
            Must have at least 1 copy
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full dark:text-gray-100">
          <mat-label>Available Copies</mat-label>
          <input
            matInput
            class="dark:text-gray-100"
            type="number"
            formControlName="available"
            placeholder="Enter available copies"
          />
          <mat-error *ngIf="bookForm.get('available')?.errors?.['required']">
            Available copies is required
          </mat-error>
          <mat-error *ngIf="bookForm.get('available')?.errors?.['min']">
            Cannot be less than 0
          </mat-error>
          <mat-error *ngIf="bookForm.get('available')?.errors?.['max']">
            Cannot exceed total number of copies
          </mat-error>
        </mat-form-field>

        <div class="flex gap-4">
          <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="bookForm.invalid"
            class="disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:text-gray-400 dark:disabled:bg-gray-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            mat-stroked-button
            type="button"
            (click)="onCancel()"
            class="dark:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EditBookComponent implements OnInit {
  bookForm: FormGroup;
  book?: Book;
  currentYear = new Date().getFullYear();
  genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Thriller',
    'Horror',
    'Biography',
    'History',
    'Science',
    'Technology',
    'Classic',
  ];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      publicationYear: [
        '',
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(this.currentYear),
        ],
      ],
      numberOfCopies: ['', [Validators.required, Validators.min(1)]],
      available: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.book = this.bookService.getBookById(bookId);
      if (this.book) {
        this.bookForm.patchValue(this.book);

        // Update available copies validator
        this.bookForm
          .get('available')
          ?.addValidators(
            Validators.max(this.bookForm.get('numberOfCopies')?.value || 0)
          );

        // Update available copies max when numberOfCopies changes
        this.bookForm.get('numberOfCopies')?.valueChanges.subscribe((value) => {
          this.bookForm
            .get('available')
            ?.setValidators([
              Validators.required,
              Validators.min(0),
              Validators.max(value),
            ]);
          this.bookForm.get('available')?.updateValueAndValidity();
        });
      } else {
        this.snackBar.open('Book not found', 'Close', { duration: 3000 });
        this.router.navigate(['/books']);
      }
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid && this.book?.id) {
      this.bookService.updateBook(this.book.id, this.bookForm.value);
      this.snackBar.open('Book updated successfully', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/books']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}
