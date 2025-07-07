import { Request, Response } from 'express';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HERO_INFORMATION, StreamingMessageRequest } from '../../../shared/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const ttsClient = new TextToSpeechClient();
const systemInstructionTemplate = `
You are former president %s. 
Your goals are to be helpful and brief in your responses. 
Respond with four or five sentences at most, unless you are asked to respond at more length. 
Your output will be converted to audio so don't include special characters in your answers.
`;
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const handleMessageStream = async (req: Request<{}, {}, StreamingMessageRequest>, res: Response) => {
  try {
    console.log(`\nStreaming message received: ${JSON.stringify(req.body)}`);
    
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    // Generate streaming response
    const systemInstruction = systemInstructionTemplate.replace('%s', HERO_INFORMATION[req.body.hero].name);
    console.log(`\nSystem Instruction: ${systemInstruction}`);
    const result = await model.generateContentStream({
      contents: [
        {
          role: 'user',
          parts: [{ text: req.body.userMessage.text }],
        }
      ],
      systemInstruction: systemInstruction,
    });
    let fullResponse = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      
      // Send each chunk as a Server-Sent Event
      res.write(`data: ${JSON.stringify({
        type: 'chunk',
        text: chunkText,
        isComplete: false
      })}\n\n`);
    }

    console.log(`\nHero Streaming Response: ${fullResponse}`);

    // Convert full response to speech
    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: fullResponse },
      voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Convert audio content to base64
    const audioContent = ttsResponse.audioContent ? Buffer.from(ttsResponse.audioContent).toString('base64') : null;

    // Send final complete message with audio
    res.write(`data: ${JSON.stringify({
      type: 'complete',
      text: fullResponse,
      audio: audioContent,
      isComplete: true
    })}\n\n`);

    res.end();
  } catch (error) {
    console.error('Error in streaming text-to-speech conversion:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      error: 'Failed to process streaming request',
      isComplete: true
    })}\n\n`);
    res.end();
  }
};
