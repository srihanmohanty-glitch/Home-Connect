import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import uploadRoutes from './routes/uploadRoutes';
import communicationRoutes from './routes/communicationRoutes'; // Import communicationRoutes
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL, // Only deployed frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin matches the deployed frontend URL
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      // For local development, allow localhost:5173 and localhost:3000 as well
      const localAllowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];
      if (localAllowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
}));
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('API Running'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/communications', communicationRoutes); // Use communicationRoutes

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Export the app for Vercel serverless functions
export default app;
