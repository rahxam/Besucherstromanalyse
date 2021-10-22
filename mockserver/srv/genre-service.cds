using { Genre as myGenre } from '../db/schema';
service GenreService {
  entity Genre as projection on myGenre;
}
