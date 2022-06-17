import { useEffect, useState, VideoHTMLAttributes } from 'react';
import { useCalculateVoiceVolume } from '../../hooks';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';

export const RemoteVideo = (props: VideoHTMLAttributes<HTMLVideoElement>) => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useCalculateVoiceVolume(mediaStream, props.id);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!props.id) { return }
      const elm = document.getElementById(props.id) as HTMLVideoElement;
      if (!elm || !elm.srcObject) { return }
      const stream = elm.srcObject as MediaStream;

      if (stream) {
        setMediaStream(stream);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };

  }, [props.id]);

  return (
    <VideoContainer>
      <VoiceVisualizer id={props.id} />
      <Video {...props} />
    </VideoContainer>
  );
};
