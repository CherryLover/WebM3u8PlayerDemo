import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface M3U8InputProps {
  onSubmit: (url: string) => void;
  placeholder?: string;
}

export const M3U8Input: React.FC<M3U8InputProps> = ({ 
  onSubmit, 
  placeholder = "输入 M3U8 URL (例如: https://example.com/stream.m3u8)"
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
    </div>
  );
};