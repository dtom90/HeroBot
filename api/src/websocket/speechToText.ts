import WebSocket from 'ws';
import { SpeechClient } from '@google-cloud/speech';

export const setupSpeechToTextWebSocket = (server: any) => {
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
};
