import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// load dotenv before routes are imported
import dotenv from 'dotenv';
dotenv.config();

import { handleMessageStream } from './routes/message';
import { setupSpeechToTextWebSocket } from './websocket/speechToText';

const app = express();
const port = 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to HeroBot API' });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Streaming message endpoint
app.post('/message/stream', handleMessageStream);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Setup WebSocket server for speech-to-text
setupSpeechToTextWebSocket(server);
