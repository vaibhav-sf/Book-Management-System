// 🟢 Replace lines 1-20 in src/types/BookTypes.ts with:
export const GENRES = [
  "Religious",
  "Historical",
  "Action",
  "Adventure",
  "Comedy",
  "Mystery",
  "Romance",
  "Thriller",
] as const;

export type GenreType = typeof GENRES[number];

export interface ApiPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}