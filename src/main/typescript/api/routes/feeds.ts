import { Router } from 'express';
import * as feedService from '../../services/feedService';

const router = Router();

router.get('/', (_req, res) => {
  res.json(feedService.getAllFeeds());
});

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    const feed = await feedService.addFeed(url);
    res.status(201).json(feed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  feedService.deleteFeed(Number(req.params.id));
  res.status(204).end();
});

router.post('/:id/refresh', async (req, res) => {
  try {
    const feed = await feedService.refreshFeed(Number(req.params.id));
    res.json(feed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
