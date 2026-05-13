import { Router } from 'express';
import { AlbumStore } from '../models/albumStore';
import { Album } from '../models/album';

function isValidAlbumPayload(body: unknown): body is Omit<Album, 'id'> {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (typeof b.year !== 'number') return false;
  if (typeof b.title !== 'string') return false;
  if (typeof b.price !== 'number') return false;
  if (typeof b.image_url !== 'string') return false;
  if (typeof b.artist !== 'object' || b.artist === null) return false;
  const artist = b.artist as Record<string, unknown>;
  if (typeof artist.name !== 'string') return false;
  if (typeof artist.birthdate !== 'string') return false;
  if (typeof artist.birthPlace !== 'string') return false;
  return true;
}

export function createAlbumsRouter(store: AlbumStore): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(store.getAll());
  });

  router.get('/search', (req, res) => {
    const yearParam = req.query.year;
    const year = Number(yearParam);
    if (yearParam === undefined || yearParam === '' || Number.isNaN(year)) {
      return res.status(400).json({ error: 'Query parameter "year" is required and must be a number.' });
    }
    return res.json(store.getByYear(year));
  });

  router.get('/sort', (req, res) => {
    const sortBy = String(req.query.sortBy ?? '').toLowerCase();
    if (sortBy !== 'title' && sortBy !== 'artist' && sortBy !== 'price') {
      return res.status(400).json({ error: "Invalid sort parameter. Use 'title', 'artist' or 'price'." });
    }
    return res.json(store.sortBy(sortBy));
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id.' });
    }
    const album = store.getById(id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    return res.json(album);
  });

  router.post('/', (req, res) => {
    if (!isValidAlbumPayload(req.body)) {
      return res.status(400).json({ error: 'Invalid album payload.' });
    }
    const created = store.create(req.body);
    return res.status(201).location(`/albums/${created.id}`).json(created);
  });

  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id.' });
    }
    if (!isValidAlbumPayload(req.body)) {
      return res.status(400).json({ error: 'Invalid album payload.' });
    }
    const updated = store.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    return res.json(updated);
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id.' });
    }
    const deleted = store.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    return res.status(204).send();
  });

  return router;
}
