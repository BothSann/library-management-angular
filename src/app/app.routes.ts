import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./components/book-list/book-list.component').then(
        (m) => m.BookListComponent
      ),
  },
  {
    path: 'add-book',
    loadComponent: () =>
      import('./components/add-book/add-book.component').then(
        (m) => m.AddBookComponent
      ),
  },
  {
    path: 'edit-book/:id',
    loadComponent: () =>
      import('./components/edit-book/edit-book.component').then(
        (m) => m.EditBookComponent
      ),
  },
];
