import { useState } from 'react';
import { Button } from '../atoms';

interface VideoControlsProps {
  isScreenShared: boolean;
  onScreenShare: (isScreenNotShared: boolean) => void;
  onToggleFullscreen: (isNotFullScreen: boolean) => void;
}

export const VideoControls = ({ isScreenShared, onScreenShare, onToggleFullscreen }: VideoControlsProps) => {
  const [isFullscreen, setFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    const value = !isFullscreen;
    setFullscreen(value);
    onToggleFullscreen(value);
  };

  const handleScreenShare = () => {
    onScreenShare(!isScreenShared);
  };

  return (
    // replace with styled component
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div>
        <Button onClick={handleScreenShare}>{isScreenShared ? 'Cancel Sharing' : 'Share Screen'}</Button>
        <Button onClick={handleToggleFullscreen}>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</Button>;
      </div>
    </div>
  );
};
