import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { VideoControls } from './VideoControls';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Video event listeners
      const onTimeUpdate = () => setCurrentTime(video.currentTime);
      const onDurationChange = () => setDuration(video.duration);
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onVolumeChange = () => setVolume(video.volume);
      
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('durationchange', onDurationChange);
      video.addEventListener('play', onPlay);
      video.addEventListener('pause', onPause);
      video.addEventListener('volumechange', onVolumeChange);
      
      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('durationchange', onDurationChange);
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('volumechange', onVolumeChange);
      };
    }
  }, []);

  useEffect(() => {
    if (!url) return;
    
    const initializePlayer = async () => {
      setError(null);
      setLoading(true);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      const video = videoRef.current;
      if (!video) return;
      
      try {
        if (Hls.isSupported()) {
          const hls = new Hls({
            xhrSetup: (xhr) => {
              // 设置 CORS 请求头
              xhr.withCredentials = false;
              
              xhr.addEventListener('error', (e) => {
                console.error('XHR Error:', e);
                setError('网络错误：无法加载流媒体。可能是 CORS 跨域问题，请确认服务器允许跨域请求。');
                setLoading(false);
              });
            },
            // 增加重试次数
            manifestLoadingMaxRetry: 3,
            levelLoadingMaxRetry: 3,
            fragLoadingMaxRetry: 3
          });
          
          hls.loadSource(url);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('Manifest successfully parsed');
            setLoading(false);
            video.play().catch((e) => {
              // Auto-play was prevented
              console.error('Autoplay prevented:', e);
              setIsPlaying(false);
            });
          });
          
          hls.on(Hls.Events.ERROR, (_, data) => {
            console.error('HLS Error:', data);
            
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                    setError(`无法加载 M3U8 清单文件。请检查 URL 是否正确并确保服务器允许跨域请求。错误代码: ${data.response?.code || 'unknown'}`);
                  } else if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) {
                    setError('加载 M3U8 清单文件超时。请检查您的网络连接或服务器状态。');
                  } else if (data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
                    setError('解析 M3U8 清单文件时出错。该文件可能格式不正确或不是有效的 HLS 流。');
                  } else {
                    setError(`网络错误: ${data.details}。请检查您的网络连接或 M3U8 地址是否有效。`);
                  }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError(`媒体错误: ${data.details}。视频流格式可能不被支持。`);
                  // 尝试恢复媒体错误
                  hls.recoverMediaError();
                  break;
                default:
                  setError(`播放错误: ${data.details}`);
                  break;
              }
              
              // 只有致命错误才销毁 hls 实例
              if (data.fatal) {
                setLoading(false);
                hls.destroy();
              }
            }
          });
          
          hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = url;
          video.addEventListener('loadedmetadata', () => {
            setLoading(false);
            video.play().catch((e) => {
              // Auto-play was prevented
              console.error('Autoplay prevented:', e);
              setIsPlaying(false);
            });
          });
          
          video.addEventListener('error', (e) => {
            console.error('Video error:', e, video.error);
            const errorCode = video.error ? video.error.code : 'unknown';
            const errorMessage = video.error ? video.error.message : '未知错误';
            setError(`加载流失败 (错误码: ${errorCode}): ${errorMessage}。请检查 URL 并重试。`);
            setLoading(false);
          });
        } else {
          setError('您的浏览器不支持 HLS 播放。请使用现代浏览器如 Chrome、Firefox 或 Safari。');
          setLoading(false);
        }
      } catch (err) {
        console.error('Player initialization error:', err);
        setError(`初始化播放器时出错: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };
    
    initializePlayer();
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    };
  }, [url]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleFullscreenToggle = () => {
    if (!videoRef.current) return;
    
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  return (
    <div 
      className="relative aspect-video bg-black flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {!url && !loading && !error && (
        <div className="text-center text-slate-400 p-6">
          <p>输入 M3U8 URL 开始播放</p>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <Loader2 className="animate-spin" size={48} />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="text-center text-red-400 p-6 max-w-md">
            <p className="font-medium text-lg">错误</p>
            <p className="mt-2">{error}</p>
            <div className="mt-4 text-sm">
              <p>常见问题解决方案:</p>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>确保 URL 是有效的 .m3u8 地址</li>
                <li>检查 M3U8 服务器是否允许跨域 (CORS) 请求</li>
                <li>检查您的网络连接</li>
                <li>尝试使用代理服务器中转</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <video 
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onClick={handlePlayPause}
      />
      
      {(showControls || !isPlaying) && (
        <VideoControls
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onFullscreenToggle={handleFullscreenToggle}
        />
      )}
    </div>
  );
};