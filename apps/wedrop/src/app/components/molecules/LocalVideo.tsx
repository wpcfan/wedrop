import { forwardRef, VideoHTMLAttributes } from 'react';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';

export const LocalVideo = forwardRef<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement>>((props, ref) => {
  // it causes echoing local video voice even if we past mute prop to video element.
  // useCalculateVoiceVolume(ref?.current?.srcObject, 'local');

  return (
    <VideoContainer>
      <VoiceVisualizer id="local" />
      <Video {...props} ref={ref} />
    </VideoContainer>
  );
});
