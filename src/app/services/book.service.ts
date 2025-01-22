import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: Book[] = [];
  private booksSubject = new BehaviorSubject<Book[]>([]);

  constructor() {
    this.addBook({
      title: 'JavaScript: The Definitive Guide',
      author: 'David Flanagan',
      genre: 'Technology',
      publicationYear: 2020,
      numberOfCopies: 5,
      available: 5,
    });
  }

  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  addBook(book: Omit<Book, 'id'>): void {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      available: book.numberOfCopies,
    };
    this.books.push(newBook);
    this.booksSubject.next([...this.books]);
  }

  updateBook(id: string, book: Partial<Book>): void {
    const index = this.books.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...book };
      this.booksSubject.next([...this.books]);
    }
  }

  deleteBook(id: string): void {
    this.books = this.books.filter((book) => book.id !== id);
    this.booksSubject.next([...this.books]);
  }

  getBookById(id: string): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  getDashboardStats() {
    return {
      totalBooks: this.books.reduce(
        (sum, book) => sum + book.numberOfCopies,
        0
      ),
      availableBooks: this.books.reduce(
        (sum, book) => sum + (book.available || 0),
        0
      ),
      uniqueBooks: this.books.length,
      genreBreakdown: this.books.reduce((acc, book) => {
        acc[book.genre] = (acc[book.genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
