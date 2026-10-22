import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes'
import bookChapterRoutes from './routes/book-chapter.routes';
import publisherRoutes from './routes/publisher.routes';
import bookRoutes from './routes/book.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api', bookRoutes);

app.use('/api', bookChapterRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/publishers', publisherRoutes);

app.use(errorMiddleware);

export default app;
