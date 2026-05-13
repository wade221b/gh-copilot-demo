import { Artist } from './artist';

export interface Album {
  id: number;
  year: number;
  title: string;
  artist: Artist;
  price: number;
  image_url: string;
}
