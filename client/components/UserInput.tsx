import { useState, useEffect } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConversationStore } from '../lib/store';
import { Audio } from 'expo-av';
import { Message } from '../../shared/types';
import { sendMessageMutation, transcriptionStreamQuery, streamingMessageQuery, queryClient } from '../lib/queryClient';

export const UserInput = () => {
  const { addMessage, setIsLoading, upsertStreamingMessage } = useConversationStore();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  // Streamed query for WebSocket transcription
  const {
    data: transcriptionData,
    isPending: isTranscribing,
    error: transcriptionError,
  } = useQuery({
    queryKey: ['transcription'],
    enabled: isRecording, // Only run when recording
    queryFn: transcriptionStreamQuery,
  });

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
          handleSubmit(lastTranscription.transcription);
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

  // Old mutation function - commented out in favor of streaming
  // const { mutate: sendMessage, isPending, isError, error } = useMutation({
  //   mutationFn: sendMessageMutation,
  //   onSuccess: async (data: Message) => {
  //     console.log(data);
  //     addMessage(data);
      
  //     // Play audio if available
  //     if (data.audio) {
  //       await playAudio(data.audio);
  //     }
  //   },
  //   onSettled: () => {
  //     setIsLoading(false);
  //   },
  // });

  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  
  // Streaming message query
  const {
    data: streamingData,
    isPending: isStreaming,
    error: streamingError,
  } = useQuery({
    queryKey: ['streamingMessage', streamingMessage],
    enabled: !!streamingMessage,
    queryFn: streamingMessageQuery,
  });

  // Handle streaming updates
  useEffect(() => {
    if (streamingData) {
      const lastStreamingData = streamingData[streamingData.length - 1];
      
      if (lastStreamingData.type === 'chunk') {
        setIsLoading(false)
        // Update the message with partial text
        upsertStreamingMessage(lastStreamingData.text || '');
      } else if (lastStreamingData.type === 'complete') {
        // Final message with audio
        console.log('complete streamingData:', lastStreamingData.text);
        
        // Play audio if available
        if (lastStreamingData.audio) {
          playAudio(lastStreamingData.audio);
        }
        
        setIsLoading(false);
        setStreamingMessage(null);
        // Reset the streaming query
        queryClient.removeQueries({ queryKey: ['streamingMessage'] });
      } else if (lastStreamingData.type === 'error') {
        console.error('Streaming error:', lastStreamingData.error);
        setIsLoading(false);
        setStreamingMessage(null);
        queryClient.removeQueries({ queryKey: ['streamingMessage'] });
      }
    }
  }, [streamingData]);

  // Handle streaming errors
  useEffect(() => {
    if (streamingError) {
      console.error('Streaming error:', streamingError);
      setIsLoading(false);
      setStreamingMessage(null);
      queryClient.cancelQueries({ queryKey: ['streamingMessage'] });
    }
  }, [streamingError]);

  const playAudio = async (audioBase64: string) => {
    try {
      // Stop any currently playing sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${audioBase64}` },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSubmit = async (textToSubmit?: string) => {
    const finalText = textToSubmit || text;
    console.log('handleSubmit', finalText);
    if (finalText.trim()) {
      setIsLoading(true);
      const userMessage = { type: 'user', text: finalText } as Message;
      addMessage(userMessage);
      setText('');
      setStreamingMessage(userMessage); // Trigger streaming query
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // @ts-ignore-next-line
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Reset the transcription query so it can be used again
    queryClient.removeQueries({ queryKey: ['transcription'] });
  };

  const startRecording = async () => {
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
      handleSubmit();
    } else {
      handleMicPress();
    }
  };

  return (
    <View>
      {transcriptionError && (
        <View className="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex-row" role="alert">
          <Text className="font-bold text-red-700">Transcription Error: </Text>
          <Text className="block sm:inline text-red-700">{transcriptionError.message}</Text>
        </View>
      )}
      {streamingError && (
        <View className="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex-row" role="alert">
          <Text className="font-bold text-red-700">Streaming Error: </Text>
          <Text className="block sm:inline text-red-700">{streamingError.message}</Text>
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
          placeholder={isRecording ? 'Recording...' : 'Enter your text here...'}
          editable={!isRecording}
        />
        <TouchableOpacity
          onPress={handleButtonPress}
          className="absolute right-6 bottom-6 bg-blue-500 rounded-full p-2"
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

