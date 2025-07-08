import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';

export const useAudio = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playAudio = useCallback(async (audioBase64: string) => {
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
  }, [sound]);

  const stopAudio = useCallback(async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  }, [sound]);

  const cleanup = useCallback(async () => {
    console.log('Cleaning up audio');
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  }, [sound]);

  return {
    sound,
    playAudio,
    stopAudio,
    cleanup,
  };
};
