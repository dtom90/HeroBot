import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableOpacity, Text } from 'react-native';
import { useState, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useConversationStore } from '../store/store';
import { Audio } from 'expo-av';
import { Message } from '../../shared/types';

const IS_PROD = process.env.EXPO_PUBLIC_ENV === 'production';
const HOSTNAME = IS_PROD ? '/api' : 'localhost:3000';
const HTTP_URL = IS_PROD ? '/api' : `http://${HOSTNAME}`;
const WEBSOCKET_URL = IS_PROD ? '/api' : `ws://${HOSTNAME}`;

export const UserInput = () => {
  const { addMessage, setIsLoading } = useConversationStore();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const { mutate: sendMessage, isPending, isError, error } = useMutation({
    mutationFn: async (userMessage: Message) => {
      setIsLoading(true);
      const response = await fetch(`${HTTP_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMessage),
      });
      addMessage(userMessage);
      setText('');
      return response.json();
    },
    onSuccess: async (data: Message) => {
      console.log(data);
      addMessage(data);
      
      // Play audio if available
      if (data.audio) {
        try {
          // Stop any currently playing sound
          if (sound) {
            await sound.unloadAsync();
          }

          // Create and play new sound
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: `data:audio/mp3;base64,${data.audio}` },
            { shouldPlay: true }
          );
          setSound(newSound);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (transcription: string) => {
    console.log('handleSubmit', transcription);
    if (transcription.trim()) {
      sendMessage({ type: 'user', text: transcription } as Message);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // @ts-ignore-next-line
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSubmit(text);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.close();
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    setIsRecording(true);
    setText('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
        } 
      });

      const ws = new WebSocket(WEBSOCKET_URL);
      webSocketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection opened');
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          bitsPerSecond: 128000,
        });
        mediaRecorderRef.current = mediaRecorder;
  
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };
  
        mediaRecorder.onstop = () => {
          console.log('MediaRecorder stopped');
          stream.getTracks().forEach(track => track.stop());
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };

        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          stopRecording();
        };
  
        mediaRecorder.start(100); // Send data every 100ms
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.transcription) {
            setText(data.transcription);
            if (data.isFinal) {
              stopRecording();
              setTimeout(() => {
                handleSubmit(data.transcription);
              }, 0);
            }
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        stopRecording();
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
      };

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleButtonPress = () => {
    if (text.trim()) {
      handleSubmit(text);
    } else {
      handleMicPress();
    }
  };

  return (
    <View>
      {isError && (
        <View className="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex-row" role="alert">
          <Text className="font-bold text-red-700">Error: </Text>
          <Text className="block sm:inline text-red-700">{error?.message || 'Something went wrong.'}</Text>
        </View>
      )}
      <View className="relative">
        <TextInput
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg p-4 m-4 min-h-[100px] bg-white pr-12"
          value={text}
          onChangeText={setText}
          onKeyPress={handleKeyPress}
          returnKeyType="send"
          placeholder="Enter your text here..."
          editable={!isPending && !isRecording}
        />
        <TouchableOpacity
          onPress={handleButtonPress}
          className="absolute right-6 bottom-6 bg-blue-500 rounded-full p-2"
          disabled={isPending}
        >
          <View className="w-6 h-6 items-center justify-center">
            {text.trim() && !isRecording ? (
              // Send arrow icon
              <View className="w-3 h-3 border-t-2 border-r-2 border-white transform rotate-45 translate-x-[-1px]" />
            ) : isRecording ? (
              // Stop icon
              <MaterialIcons
                name="stop"
                size={24}
                color="white"
              />
            ) : (
              // Microphone icon
              <MaterialIcons
                name="mic"
                size={24}
                color="white"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

