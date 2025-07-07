import { useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';

const assetId = require('~/assets/videos/TeddyRoosevelt-idle.mp4');

export const AnimatedHero = () => {
  const player = useVideoPlayer(assetId, player => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    player.play();
  }, [player]);

  return <VideoView player={player} playsInline />;
};
