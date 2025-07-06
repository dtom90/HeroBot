import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import WebSocket from 'ws';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const ttsClient = new TextToSpeechClient();
const conversation_system_instruction = `
You are former president Teddy Roosevelt. 
Your goals are to be helpful and brief in your responses. 
Respond with four or five sentences at most, unless you are asked to respond at more length. 
Your output will be converted to audio so don't include special characters in your answers.
`;
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: conversation_system_instruction });

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to HeroBot API' });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

interface MessageRequest {
  message: string;
}

// Message endpoint
app.post('/message', async (req: Request<{}, {}, MessageRequest>, res: Response) => {
  const { message } = req.body;
  console.log(`Message received: ${message}`);
  const response = await model.generateContent(message);
  const responseText = response.response.text();
  console.log(`Response: ${responseText}`);

  try {
    // Convert text to speech
    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: responseText },
      voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Convert audio content to base64
    // const audioContent = ttsResponse.audioContent?.toString('base64');
    const audioContent = ttsResponse.audioContent ? Buffer.from(ttsResponse.audioContent).toString('base64') : null;

    res.json({ 
      message: responseText,
      audio: audioContent
    });
  } catch (error) {
    console.error('Error in text-to-speech conversion:', error);
    res.status(500).json({ error: 'Failed to convert text to speech' });
  }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// WebSocket server for speech-to-text
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected for speech-to-text');

  const speechClient = new SpeechClient();
  const recognizeStream = speechClient
    .streamingRecognize({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
      },
      interimResults: true,
    })
    .on('error', (error: Error) => {
      console.error('Error in streaming recognition:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: 'Streaming recognition error' }));
      }
    })
    .on('data', (data: any) => {
      const transcription = data.results[0]?.alternatives[0]?.transcript;
      if (transcription && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ 
          transcription,
          isFinal: data.results[0].isFinal
        }));
      }
    });

  ws.on('message', (message: Buffer) => {
    try {
      recognizeStream.write(message);
    } catch (error) {
      console.error('Error writing to recognition stream:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    try {
      recognizeStream.destroy();
    } catch (error) {
      console.error('Error destroying recognition stream on close:', error);
    }
  });

  ws.on('error', (error: Error) => {
    console.error('WebSocket error:', error);
    try {
      recognizeStream.destroy();
    } catch (destroyError) {
      console.error('Error destroying recognition stream on ws error:', destroyError);
    }
  });
});
