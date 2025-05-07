import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface M3U8InputProps {
  onSubmit: (url: string) => void;
  placeholder?: string;
  videoType?: 'm3u8' | 'mp4';
}

export const M3U8Input: React.FC<M3U8InputProps> = ({ 
  onSubmit, 
  placeholder = "输入 M3U8 URL (例如: https://example.com/stream.m3u8)",
  videoType = 'm3u8'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!inputValue.trim()) {
      setError('请输入 URL');
      return;
    }
    
    try {
      // 解析 URL 以确保它是有效的
      new URL(inputValue);
      
      // 放宽验证 - 不强制要求文件扩展名为 .m3u8
      // 有些 M3U8 URL 可能不是以 .m3u8 结尾的，而是通过内容类型标识
      // 我们只验证它是有效的 URL
      
      setError(null);
      onSubmit(inputValue);
    } catch {
      setError('请输入有效的 URL');
    }
  };

  return (
    <div>
      <form 
        onSubmit={handleSubmit}
        className="relative"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="url"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder={placeholder}
              className={`w-full px-4 py-3 rounded-lg bg-slate-800 border ${
                error ? 'border-red-500' : 'border-slate-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 text-red-500 text-sm">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 whitespace-nowrap transform hover:scale-105 active:scale-95"
          >
            <Play size={18} />
            <span>播放</span>
          </button>
        </div>
      </form>
      
      {videoType === 'm3u8' ? (
        <div className="mt-8 bg-slate-800 p-4 rounded-lg">
          <h3 className="text-slate-300 font-medium mb-2">示例 M3U8 URL:</h3>
          <div className="grid gap-2 text-sm">
            <div className="group cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={() => setInputValue('https://s3-store.flyooo.uk/test/video/m3u8/standard/output.m3u8')}>
              <p className="text-blue-400">https://s3-store.flyooo.uk/test/video/m3u8/standard/output.m3u8</p>
              <p className="text-slate-500 text-xs">您提供的 M3U8 地址 (通过代理解决跨域)</p>
            </div>
            <div className="group cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={() => setInputValue('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')}>
              <p className="text-blue-400">https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8</p>
              <p className="text-slate-500 text-xs">Mux 测试流 (支持 CORS)</p>
            </div>
            <div className="group cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={() => setInputValue('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8')}>
              <p className="text-blue-400">https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8</p>
              <p className="text-slate-500 text-xs">Tears of Steel 电影示例 (支持 CORS)</p>
            </div>
            <div className="group cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={() => setInputValue('https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8')}>
              <p className="text-blue-400">https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8</p>
              <p className="text-slate-500 text-xs">Akamai 测试流 (支持 CORS)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-slate-800 p-4 rounded-lg">
          <h3 className="text-slate-300 font-medium mb-2">示例 MP4 URL:</h3>
          <div className="grid gap-2 text-sm">
            <div className="group cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={() => setInputValue('https://media.w3.org/2010/05/sintel/trailer.mp4')}>
              <p className="text-blue-400">https://media.w3.org/2010/05/sintel/trailer.mp4</p>
              <p className="text-slate-500 text-xs">Sintel 预告片 (W3C 媒体)</p>
            </div>
            <div className="group cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={() => setInputValue('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}>
              <p className="text-blue-400">https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4</p>
              <p className="text-slate-500 text-xs">Big Buck Bunny (支持 CORS)</p>
            </div>
            <div className="group cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={() => setInputValue('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4')}>
              <p className="text-blue-400">https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4</p>
              <p className="text-slate-500 text-xs">Elephants Dream (支持 CORS)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};