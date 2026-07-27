export type GenreType = 
  | "Religious"
  | "Action"
  | "Adventure"
  | "Comedy"
  | "Historical"
  | "Mystery"
  | "Romance"
  | "Thriller";

export const genreMapping: Record<GenreType, string> = {
  Religious: "Religious",
  Historical: "Historical",
  Action: "Action",
  Adventure: "Adventure",
  Comedy: "Comedy",
  Mystery: "Mystery",
  Romance: "Romance",
  Thriller: "Thriller",
};

export interface ApiPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}