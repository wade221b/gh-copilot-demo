import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { AlbumStore } from '../src/models/albumStore';

function makeApp() {
  return createApp(new AlbumStore());
}

describe('GET /albums', () => {
  it('returns the seeded list of 6 albums', async () => {
    const res = await request(makeApp()).get('/albums');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(6);
    expect(res.body[0]).toMatchObject({
      id: 1,
      title: 'You, Me and an App Id',
      artist: { name: 'Daprize' }
    });
  });
});

describe('GET /albums/:id', () => {
  it('returns a single album by id', async () => {
    const res = await request(makeApp()).get('/albums/3');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Scale It Up');
  });

  it('returns 404 when album does not exist', async () => {
    const res = await request(makeApp()).get('/albums/9999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for non-numeric id', async () => {
    const res = await request(makeApp()).get('/albums/abc');
    expect(res.status).toBe(400);
  });
});

describe('GET /albums/search', () => {
  it('returns all albums released in the requested year', async () => {
    const res = await request(makeApp()).get('/albums/search?year=2020');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((a: { year: number }) => a.year === 2020)).toBe(true);
  });

  it('returns 400 when year is missing', async () => {
    const res = await request(makeApp()).get('/albums/search');
    expect(res.status).toBe(400);
  });
});

describe('GET /albums/sort', () => {
  it('sorts albums by title', async () => {
    const res = await request(makeApp()).get('/albums/sort?sortBy=title');
    expect(res.status).toBe(200);
    const titles = res.body.map((a: { title: string }) => a.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });

  it('sorts albums by artist name', async () => {
    const res = await request(makeApp()).get('/albums/sort?sortBy=artist');
    expect(res.status).toBe(200);
    const names = res.body.map((a: { artist: { name: string } }) => a.artist.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('returns 400 for invalid sort field', async () => {
    const res = await request(makeApp()).get('/albums/sort?sortBy=year');
    expect(res.status).toBe(400);
  });
});

describe('POST /albums', () => {
  it('creates a new album with an auto-incremented id', async () => {
    const app = makeApp();
    const payload = {
      year: 2024,
      title: 'New Wave',
      artist: { name: 'Synth Lord', birthdate: '1995-04-04', birthPlace: 'Berlin, Germany' },
      price: 9.99,
      image_url: 'https://example.com/img.png'
    };
    const res = await request(app).post('/albums').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(7);
    expect(res.body.title).toBe('New Wave');

    const list = await request(app).get('/albums');
    expect(list.body).toHaveLength(7);
  });

  it('returns 400 for an invalid payload', async () => {
    const res = await request(makeApp()).post('/albums').send({ title: 'oops' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /albums/:id', () => {
  it('updates an existing album', async () => {
    const app = makeApp();
    const payload = {
      year: 2025,
      title: 'Updated Title',
      artist: { name: 'Daprize', birthdate: '1988-03-12', birthPlace: 'Seattle, USA' },
      price: 11.99,
      image_url: 'https://example.com/updated.png'
    };
    const res = await request(app).put('/albums/1').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Updated Title');
  });

  it('returns 404 when updating a missing album', async () => {
    const payload = {
      year: 2025,
      title: 'Nope',
      artist: { name: 'X', birthdate: '2000-01-01', birthPlace: 'Earth' },
      price: 1,
      image_url: 'x'
    };
    const res = await request(makeApp()).put('/albums/9999').send(payload);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /albums/:id', () => {
  it('removes an existing album', async () => {
    const app = makeApp();
    const res = await request(app).delete('/albums/2');
    expect(res.status).toBe(204);

    const after = await request(app).get('/albums');
    expect(after.body).toHaveLength(5);
    expect(after.body.find((a: { id: number }) => a.id === 2)).toBeUndefined();
  });

  it('returns 404 when album does not exist', async () => {
    const res = await request(makeApp()).delete('/albums/9999');
    expect(res.status).toBe(404);
  });
});
