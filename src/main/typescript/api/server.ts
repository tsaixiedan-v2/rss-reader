import express from 'express';
import cors from 'cors';
import feedsRouter from './routes/feeds';
import articlesRouter from './routes/articles';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/feeds', feedsRouter);
app.use('/api/articles', articlesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
