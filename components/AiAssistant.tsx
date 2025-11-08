import React, { useState, useRef, useEffect } from 'react';
import type { AiChatMessage } from '../types';
import { AiAssistantIcon, CloseIcon, MicIcon, SendIcon } from './icons';

interface AiAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: AiChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

const ChatBubble: React.FC<{ message: AiChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const isTyping = message.sender === 'typing';

    if (isTyping) {
        return (
            <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg rounded-bl-none px-4 py-3 max-w-xs">
                    <TypingIndicator />
                </div>
            </div>
        );
    }
    
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-3 max-w-xs lg:max-w-md ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};


const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onToggle, messages, onSendMessage, isLoading }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(inputValue);
        setInputValue('');
    };
    
    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={onToggle}
                className={`animate-pulse-fab-subtle fixed bottom-28 right-6 lg:bottom-28 lg:right-8 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-2xl z-40 transition-transform duration-300 ease-in-out hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                aria-label="Toggle AI Security Assistant"
            >
                <AiAssistantIcon className="w-8 h-8"/>
            </button>

            {/* Chat Popup */}
            <div
                className={`fixed bottom-28 right-6 lg:bottom-28 lg:right-8 w-[calc(100%-3rem)] max-w-md h-[70vh] max-h-[600px] z-50 transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
            >
                <div className="h-full w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col">
                    {/* Header */}
                    <header className="flex items-center justify-between p-4 border-b border-gray-700/50">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                                <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-glow 2s infinite ease-in-out' }}></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Security AI Assistant</h3>
                                <p className="text-xs text-gray-400">Your Cyber Defense Partner</p>
                            </div>
                        </div>
                         <button onClick={onToggle} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors">
                            <CloseIcon />
                        </button>
                    </header>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                         <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <footer className="p-4 border-t border-gray-700/50">
                        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
                             <button type="button" className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors">
                                <MicIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about security..."
                                className="flex-1 bg-gray-700/50 rounded-full h-10 px-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center transition-colors hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default AiAssistant;