import React, { useState, useEffect } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useConversationStore } from '../hooks/useConversationStore';
import { HERO_INFORMATION, Message, ValidHero } from '../../shared/types';
import { queryClient } from '../lib/queryClient';
import { useTranscriptionQuery } from '../hooks/useTranscriptionQuery';
import { useStreamingMessageQuery } from '../hooks/useStreamingMessageQuery';
import { useFocusEffect } from '@react-navigation/native';
import { useAudio } from '../hooks/useAudio';

export const UserInput = ({ hero }: { hero: ValidHero }) => {
  const { addMessage, setIsLoading, upsertHeroMessage: upsertStreamingMessage } = useConversationStore();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { playAudio, stopAudio, cleanup: cleanupAudio } = useAudio();
  
  // Streamed query for WebSocket transcription
  const {
    data: transcriptionData,
    isPending: isTranscribing,
    error: transcriptionError,
  } = useTranscriptionQuery(isRecording);

  // Handle transcription updates
  useEffect(() => {
    if (transcriptionData) {
      const lastTranscription = transcriptionData[transcriptionData.length - 1];
      setText(lastTranscription.transcription);
      if (lastTranscription.isFinal) {
        setIsRecording(false);
        // Reset the transcription query so it can be used again
        queryClient.removeQueries({ queryKey: ['transcription'] });
        setTimeout(() => {
          submitUserMessage(lastTranscription.transcription);
        }, 0);
      }
    }
  }, [transcriptionData]);

  // Handle transcription errors
  useEffect(() => {
    if (transcriptionError) {
      console.error('Transcription error:', transcriptionError);
      setIsRecording(false);
      queryClient.cancelQueries({ queryKey: ['transcription'] });
    }
  }, [transcriptionError]);

  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  
  // Streaming message query
  const {
    data: streamingData,
    error: streamingError,
  } = useStreamingMessageQuery(hero, streamingMessage || null);

  // Handle streaming updates
  useEffect(() => {
    if (streamingData && hero) {
      const lastStreamingData = streamingData[streamingData.length - 1];
      
      if (lastStreamingData.type === 'chunk') {
        setIsLoading(hero, false);
        // Update the message with partial text
        upsertStreamingMessage(hero, { type: 'hero', text: lastStreamingData.text || '' } as Message);
      } else if (lastStreamingData.type === 'complete') {
        // Final message with audio
        console.log('Hero Response:', lastStreamingData.text);
        upsertStreamingMessage(hero, { type: 'hero', text: lastStreamingData.text || '', audio: lastStreamingData.audio } as Message);
        
        // Play audio if available
        if (lastStreamingData.audio) {
          playAudio(lastStreamingData.audio);
        }
        
        setIsLoading(hero, false);
        setStreamingMessage(null);
        // Reset the streaming query
        queryClient.removeQueries({ queryKey: ['streamingMessage'] });
      } else if (lastStreamingData.type === 'error') {
        console.error('Streaming error:', lastStreamingData.error);
        setIsLoading(hero, false);
        setStreamingMessage(null);
        queryClient.removeQueries({ queryKey: ['streamingMessage'] });
      }
    }
  }, [streamingData, hero]);

  // Handle streaming errors
  useEffect(() => {
    if (streamingError && hero) {
      console.error('Streaming error:', streamingError);
      setIsLoading(hero, false);
      setStreamingMessage(null);
      queryClient.cancelQueries({ queryKey: ['streamingMessage'] });
    }
  }, [streamingError, hero]);

  useEffect(() => {
    submitUserMessage('Introduce yourself in one sentence and then tell me how you can help me in one sentence', true);
  }, []);

  // Cleanup on navigation away
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Cleanup audio
        cleanupAudio();
        
        // Cancel any ongoing queries
        queryClient.cancelQueries({ queryKey: ['transcription'] });
        queryClient.cancelQueries({ queryKey: ['streamingMessage'] });
        
        // Reset recording state
        setIsRecording(false);
      };
    }, [cleanupAudio])
  );



  const submitUserMessage = async (textToSubmit?: string, isInitialMessage: boolean = false) => {
    if (!hero) {
      console.warn('No hero selected');
      return;
    }

    const finalText = textToSubmit || text;
    console.log('User Input:', finalText);
    if (finalText.trim()) {
      setIsLoading(hero, true);
      const userMessage = { type: 'user', text: finalText } as Message;
      if (!isInitialMessage) {
        addMessage(hero, userMessage);
      }
      setText('');
      setStreamingMessage(userMessage); // Trigger streaming query
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // @ts-ignore-next-line
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      submitUserMessage();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Reset the transcription query so it can be used again
    queryClient.removeQueries({ queryKey: ['transcription'] });
  };

  const startRecording = async () => {
    await stopAudio();
    setIsRecording(true);
    setText('');
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
      submitUserMessage();
    } else {
      handleMicPress();
    }
  };

  return (
    <View>
      {transcriptionError && (
        <View className="m-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative flex-row" role="alert">
          <Text className="font-bold text-red-700 dark:text-red-300">Transcription Error: </Text>
          <Text className="block sm:inline text-red-700 dark:text-red-300">{transcriptionError.message}</Text>
        </View>
      )}
      {streamingError && (
        <View className="m-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative flex-row" role="alert">
          <Text className="font-bold text-red-700 dark:text-red-300">Streaming Error: </Text>
          <Text className="block sm:inline text-red-700 dark:text-red-300">{streamingError.message}</Text>
        </View>
      )}
      <View className="relative">
        <TextInput
          multiline
          numberOfLines={4}
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[100px] dark:bg-gray-800 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          value={text}
          onChangeText={setText}
          onKeyPress={handleKeyPress}
          returnKeyType="send"
          placeholder={isRecording ? 'Recording...' : `Ask ${HERO_INFORMATION[hero].name} a question...`}
          editable={!isRecording}
        />
        <TouchableOpacity
          onPress={handleButtonPress}
          className="absolute right-6 bottom-6 bg-gray-500 dark:bg-gray-600 rounded-full p-2"
        >
          <View className="w-6 h-6 items-center justify-center">
            {text.trim() && !isRecording ? (
              // Send arrow icon
              <View className="w-3 h-3 border-t-2 border-r-2 border-white transform rotate-45 translate-x-[-1px]" />
            ) : isRecording && isTranscribing ? (
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

