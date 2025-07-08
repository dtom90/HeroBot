import { useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { HERO_ASSETS } from '~/lib/heroAssets';
import { ValidHero } from '../../shared/types';

export const HeroAnimation = ({ hero }: { hero: ValidHero }) => {
  const player = useVideoPlayer(HERO_ASSETS[hero].video, player => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    player.play();
  }, [player]);

  return <VideoView player={player} playsInline nativeControls={false} style={{ width: '100%', height: '100%' }} />;
};
