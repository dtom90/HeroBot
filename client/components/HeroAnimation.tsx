import { useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { HERO_ASSETS } from '~/lib/heroAssets';
import { ValidHero } from '../../shared/types';
import { StyleProp, ViewStyle, View } from 'react-native';

export const HeroAnimation = ({ hero, style }: { hero: ValidHero, style?: StyleProp<ViewStyle> }) => {
  const player = useVideoPlayer(HERO_ASSETS[hero].video, player => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    player.play();
  }, [player]);

  return (
    <View style={style} className="rounded-md overflow-hidden">
      <VideoView player={player} playsInline nativeControls={false} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};
