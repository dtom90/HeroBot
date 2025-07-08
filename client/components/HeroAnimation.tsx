import { useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { HERO_ASSETS } from '~/lib/heroAssets';
import { ValidHero } from '../../shared/types';
import { StyleProp, ViewStyle } from 'react-native';

export const HeroAnimation = ({ hero, style }: { hero: ValidHero, style?: StyleProp<ViewStyle> }) => {
  const player = useVideoPlayer(HERO_ASSETS[hero].video, player => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    player.play();
  }, [player]);

  return <VideoView player={player} playsInline nativeControls={false} style={style} />;
};
