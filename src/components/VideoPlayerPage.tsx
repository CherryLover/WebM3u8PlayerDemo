import React from 'react';
import { M3U8Input } from './M3U8Input';
import { VideoPlayer } from './VideoPlayer';
import { PlayHistory } from './PlayHistory';
import { GithubIcon, HelpCircle } from 'lucide-react';

export const VideoPlayerPage: React.FC = () => {
  const [url, setUrl] = React.useState<string>('');
  const [history, setHistory] = React.useState<string[]>(() => {
    const savedHistory = localStorage.getItem('m3u8History');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showHelp, setShowHelp] = React.useState(false);
  const [useProxy, setUseProxy] = React.useState(true);

  const handlePlay = (inputUrl: string) => {
    if (!inputUrl) return;
    
    // 如果启用代理且URL不是已经带代理的，则添加代理前缀
    const finalUrl = useProxy && !inputUrl.includes('localhost:3001/proxy') 
      ? `http://localhost:3001/proxy${new URL(inputUrl).pathname}`
      : inputUrl;
    
    // 避免重复添加相同URL到历史记录
    if (!history.includes(finalUrl)) {
      const newHistory = [finalUrl, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('m3u8History', JSON.stringify(newHistory));
    }
    
    setUrl(finalUrl);
  };

  const handleHistorySelect = (historyUrl: string) => {
    setUrl(historyUrl);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            M3U8 播放器
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="帮助"
            >
              <HelpCircle size={24} />
            </button>
            <a 
              href="https://github.com/video-dev/hls.js/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="查看 GitHub 源代码"
            >
              <GithubIcon size={24} />
            </a>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          输入 M3U8 URL 播放您喜爱的流媒体内容
        </p>
      </header>

      {showHelp && (
        <div className="mb-6 bg-slate-800 p-4 rounded-lg text-slate-300">
          <h2 className="font-medium text-lg mb-2">常见问题解答</h2>
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-medium">什么是 M3U8?</h3>
              <p>M3U8 是一种播放列表文件格式，用于 HLS (HTTP Live Streaming) 流媒体协议。它包含了视频片段的索引信息。</p>
            </div>
            <div>
              <h3 className="font-medium">提示"网络错误"或"加载失败"？</h3>
              <p>通常是因为 CORS 跨域限制。流媒体服务器需要设置允许跨域访问。尝试使用我们提供的示例 URL。</p>
            </div>
            <div>
              <h3 className="font-medium">支持哪些浏览器？</h3>
              <p>本播放器基于 hls.js，支持所有现代浏览器。在 Safari 中使用原生 HLS 支持。</p>
            </div>
            <div>
              <h3 className="font-medium">如何获取 M3U8 URL？</h3>
              <p>M3U8 URL 通常由流媒体服务提供商提供，或可以从支持 HLS 协议的流媒体服务中找到。</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHelp(false)}
            className="mt-3 text-blue-400 hover:text-blue-300"
          >
            关闭帮助
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 mb-2">
            <input 
              type="checkbox"
              id="useProxy"
              checked={useProxy}
              onChange={(e) => setUseProxy(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useProxy" className="text-slate-300">
              使用代理解决跨域问题 (推荐)
            </label>
          </div>
          <M3U8Input onSubmit={handlePlay} />
        </div>
        
        <div className="rounded-xl overflow-hidden bg-slate-800 shadow-xl">
          <VideoPlayer url={url} />
        </div>

        {history.length > 0 && (
          <PlayHistory history={history} onSelect={handleHistorySelect} />
        )}
      </div>

      <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>使用 React、Tailwind CSS 和 HLS.js 构建 — {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};