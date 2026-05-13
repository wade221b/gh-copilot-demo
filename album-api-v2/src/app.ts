import express, { Express } from 'express';
import { AlbumStore } from './models/albumStore';
import { createAlbumsRouter } from './routes/albums';

export function createApp(store: AlbumStore = new AlbumStore()): Express {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    return next();
  });

  app.get('/', (_req, res) => {
    res.send('Hit the /albums endpoint to retrieve a list of albums!');
  });

  app.use('/albums', createAlbumsRouter(store));

  return app;
}
