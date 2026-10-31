import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes'
import bookChapterRoutes from './routes/book-chapter.routes';
import publisherRoutes from './routes/publisher.routes';
import bookRoutes from './routes/book.routes';
import categoryRoutes from './routes/category.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import adminRoutes from './routes/admin.routes'

const app = express();

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Public and resource routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books', bookChapterRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/publishers', publisherRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;