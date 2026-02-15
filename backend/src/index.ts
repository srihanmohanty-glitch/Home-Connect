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
app.use(cors({
  origin: 'http://localhost:5173', // Local frontend for development
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

const PORT = process.env.PORT || 5001; // Back to 5001 as previously established

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
