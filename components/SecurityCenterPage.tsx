
import React from 'react';
import type { HistoryItem } from '../types';
import { TrashIcon } from './icons';

interface SecurityCenterPageProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const SecurityCenterPage: React.FC<SecurityCenterPageProps> = ({ history, onSelectHistoryItem, onClearHistory }) => {
  return (
    <div className="space-y-10">
      <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-100">Security Center</h2>
          <p className="mt-2 text-gray-400">Review your past security analysis reports.</p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Analysis History</h3>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="group flex items-center gap-2 py-2 px-3 border border-red-700/50 rounded-md shadow-sm text-xs font-medium text-red-400 hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors"
            >
              <TrashIcon />
              Clear History
            </button>
          )}
        </div>
        {history.length > 0 ? (
          <ul className="divide-y divide-gray-700 max-h-[60vh] overflow-y-auto">
            {history.map(item => (
              <li key={item.id} className="p-3 hover:bg-gray-700/50 cursor-pointer transition-colors" onClick={() => onSelectHistoryItem(item)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blue-400 truncate">{item.websiteUrl}</p>
                    <p className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-300">{item.result.score}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No history yet. Run an analysis to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityCenterPage;