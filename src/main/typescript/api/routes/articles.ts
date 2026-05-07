import { Router } from 'express';
import * as articleService from '../../services/articleService';

const router = Router();

router.get('/', (req, res) => {
  const feedId = req.query.feedId ? Number(req.query.feedId) : null;
  const limit = Number(req.query.limit) || 50;
  const offset = Number(req.query.offset) || 0;
  const articles = feedId
    ? articleService.getArticlesByFeed(feedId, limit, offset)
    : articleService.getAllArticles(limit, offset);
  res.json(articles);
});

router.patch('/feed/:feedId/read-all', (req, res) => {
  articleService.markFeedAsRead(Number(req.params.feedId));
  res.status(204).end();
});

router.patch('/:id/read', (req, res) => {
  articleService.markAsRead(Number(req.params.id));
  res.status(204).end();
});

export default router;
