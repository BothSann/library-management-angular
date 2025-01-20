export interface Book {
  id?: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  numberOfCopies: number;
  available?: number;
}
