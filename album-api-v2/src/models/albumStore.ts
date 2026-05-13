import { Album } from './album';

const seed: Album[] = [
  {
    id: 1,
    year: 2020,
    title: 'You, Me and an App Id',
    artist: { name: 'Daprize', birthdate: '1988-03-12', birthPlace: 'Seattle, USA' },
    price: 10.99,
    image_url: 'https://aka.ms/albums-daprlogo'
  },
  {
    id: 2,
    year: 2019,
    title: 'Seven Revision Army',
    artist: { name: 'The Blue-Green Stripes', birthdate: '1986-07-25', birthPlace: 'Austin, USA' },
    price: 13.99,
    image_url: 'https://aka.ms/albums-containerappslogo'
  },
  {
    id: 3,
    year: 2021,
    title: 'Scale It Up',
    artist: { name: 'KEDA Club', birthdate: '1990-01-18', birthPlace: 'Dublin, Ireland' },
    price: 13.99,
    image_url: 'https://aka.ms/albums-kedalogo'
  },
  {
    id: 4,
    year: 2018,
    title: 'Lost in Translation',
    artist: { name: 'MegaDNS', birthdate: '1984-11-06', birthPlace: 'London, UK' },
    price: 12.99,
    image_url: 'https://aka.ms/albums-envoylogo'
  },
  {
    id: 5,
    year: 2022,
    title: 'Lock Down Your Love',
    artist: { name: 'V is for VNET', birthdate: '1992-05-30', birthPlace: 'Toronto, Canada' },
    price: 12.99,
    image_url: 'https://aka.ms/albums-vnetlogo'
  },
  {
    id: 6,
    year: 2020,
    title: "Sweet Container O' Mine",
    artist: { name: 'Guns N Probeses', birthdate: '1987-09-09', birthPlace: 'Sydney, Australia' },
    price: 14.99,
    image_url: 'https://aka.ms/albums-containerappslogo'
  }
];

export class AlbumStore {
  private albums: Album[];

  constructor(initial?: Album[]) {
    const source = initial ?? seed;
    this.albums = source.map((a) => ({ ...a, artist: { ...a.artist } }));
  }

  getAll(): Album[] {
    return [...this.albums];
  }

  getById(id: number): Album | undefined {
    return this.albums.find((a) => a.id === id);
  }

  getByYear(year: number): Album[] {
    return this.albums.filter((a) => a.year === year);
  }

  sortBy(field: 'title' | 'artist' | 'price'): Album[] {
    const copy = [...this.albums];
    switch (field) {
      case 'title':
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case 'artist':
        return copy.sort((a, b) => a.artist.name.localeCompare(b.artist.name));
      case 'price':
        return copy.sort((a, b) => a.price - b.price);
    }
  }

  create(album: Omit<Album, 'id'>): Album {
    const nextId = this.albums.length === 0 ? 1 : Math.max(...this.albums.map((a) => a.id)) + 1;
    const created: Album = { ...album, id: nextId };
    this.albums.push(created);
    return created;
  }

  update(id: number, album: Omit<Album, 'id'>): Album | undefined {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      return undefined;
    }
    const updated: Album = { ...album, id };
    this.albums[index] = updated;
    return updated;
  }

  delete(id: number): boolean {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      return false;
    }
    this.albums.splice(index, 1);
    return true;
  }
}

export const defaultStore = new AlbumStore();
