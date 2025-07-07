import { Request, Response } from 'express';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../../../shared/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const ttsClient = new TextToSpeechClient();
const conversation_system_instruction = `
You are former president Teddy Roosevelt. 
Your goals are to be helpful and brief in your responses. 
Respond with four or five sentences at most, unless you are asked to respond at more length. 
Your output will be converted to audio so don't include special characters in your answers.
`;
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: conversation_system_instruction });

export const handleMessage = async (req: Request<{}, {}, Message>, res: Response) => {
  try {
    console.log(`Message received: ${JSON.stringify(req.body)}`);
    const response = await model.generateContent(req.body.text);
    const responseText = response.response.text();
    console.log(`Hero Response: ${responseText}`);

    // Convert text to speech
    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: responseText },
      voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Convert audio content to base64
    const audioContent = ttsResponse.audioContent ? Buffer.from(ttsResponse.audioContent).toString('base64') : null;

    res.json({
      type: 'hero',
      text: responseText,
      audio: audioContent
    } as Message);
  } catch (error) {
    console.error('Error in text-to-speech conversion:', error);
    res.status(500).json({ error: 'Failed to convert text to speech' });
  }
};
