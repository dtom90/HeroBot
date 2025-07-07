import { useState, useEffect } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConversationStore } from '../lib/store';
import { Audio } from 'expo-av';
import { Message } from '../../shared/types';
import { sendMessageMutation, transcriptionStreamQuery, queryClient } from '../lib/queryClient';

export const UserInput = () => {
  const { addMessage, setIsLoading } = useConversationStore();
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
      console.log('transcriptionData', transcriptionData);
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
    }
  }, [transcriptionError]);

  const { mutate: sendMessage, isPending, isError, error } = useMutation({
    mutationFn: sendMessageMutation,
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

  const handleSubmit = async (textToSubmit?: string) => {
    const finalText = textToSubmit || text;
    console.log('handleSubmit', finalText);
    if (finalText.trim()) {
      setIsLoading(true);
      const userMessage = { type: 'user', text: finalText } as Message;
      addMessage(userMessage);
      setText('');
      sendMessage(userMessage);
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
      {isError && (
        <View className="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex-row" role="alert">
          <Text className="font-bold text-red-700">Error: </Text>
          <Text className="block sm:inline text-red-700">{error?.message || 'Something went wrong.'}</Text>
        </View>
      )}
      {transcriptionError && (
        <View className="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex-row" role="alert">
          <Text className="font-bold text-red-700">Transcription Error: </Text>
          <Text className="block sm:inline text-red-700">{transcriptionError.message}</Text>
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
            ) : isTranscribing ? (
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

