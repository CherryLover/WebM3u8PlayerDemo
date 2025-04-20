import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onFullscreenToggle: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  duration,
  currentTime,
  volume,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onFullscreenToggle,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '00:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    onSeek(clickPosition * duration);
  };
  
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, clickPosition)));
  };
  
  const toggleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 1);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300">
      {/* Progress bar */}
      <div 
        className="group w-full h-2 bg-slate-700/50 rounded-full cursor-pointer relative mb-3"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-blue-500 rounded-full relative"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-150"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Play/Pause button */}
          <button 
            onClick={onPlayPause}
            className="text-white hover:text-blue-400 transition-colors duration-200"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          {/* Volume control */}
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button 
              onClick={toggleMute}
              className="text-white hover:text-blue-400 transition-colors duration-200"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            {/* Volume slider (shows on hover) */}
            {showVolumeSlider && (
              <div 
                className="absolute left-8 w-24 h-2 bg-slate-700/70 rounded-full cursor-pointer transform -translate-y-1/2 top-1/2"
                onClick={handleVolumeClick}
              >
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {/* Time display */}
          <div className="text-sm font-medium text-slate-300">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Fullscreen button */}
        <button 
          onClick={onFullscreenToggle}
          className="text-white hover:text-blue-400 transition-colors duration-200"
          aria-label="Toggle fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
};