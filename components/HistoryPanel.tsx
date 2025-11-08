import React from 'react';
import type { HistoryItem } from '../types';
import { CloseIcon, TrashIcon } from './icons';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-gray-800 shadow-xl z-50 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Analysis History</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
              aria-label="Close history panel"
            >
              <CloseIcon />
            </button>
          </div>

          {history.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-700">
                {history.map(item => (
                  <li key={item.id} className="p-4 hover:bg-gray-700/50 cursor-pointer transition-colors" onClick={() => onSelect(item)}>
                    <p className="font-semibold text-blue-400 truncate">{item.websiteUrl}</p>
                    <p className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500 p-4">
              <p>No history yet. Run an analysis to see it here.</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={onClear}
                className="w-full group flex justify-center items-center gap-2 py-2 px-4 border border-red-700/50 rounded-md shadow-sm text-sm font-medium text-red-400 hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors"
              >
                <TrashIcon />
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;
