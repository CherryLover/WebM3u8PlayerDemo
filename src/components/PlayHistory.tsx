import React from 'react';
import { History, ExternalLink } from 'lucide-react';

interface PlayHistoryProps {
  history: string[];
  onSelect: (url: string) => void;
  title?: string;
}

export const PlayHistory: React.FC<PlayHistoryProps> = ({ 
  history, 
  onSelect,
  title = "最近播放"
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <History size={18} className="text-slate-400" />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {history.map((url, index) => (
          <li key={index} className="group">
            <div className="flex items-center">
              <button
                onClick={() => onSelect(url)}
                className="w-full text-left p-2 hover:bg-slate-700/50 rounded truncate text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
              >
                <ExternalLink size={14} className="mr-2 flex-shrink-0 text-slate-500" />
                <span className="truncate">{url}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};