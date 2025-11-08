import React from 'react';
import { CloseIcon } from './icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 flex items-center justify-center" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl transform transition-all m-4 border border-gray-700"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">About Wesecure</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                        aria-label="Close about modal"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6 text-gray-300 space-y-4 max-h-[70vh] overflow-y-auto">
                    <p>
                        <strong>Wesecure</strong> is an AI-powered tool designed to streamline the initial phases of a website security assessment. By providing a user-friendly interface to define the scope of analysis, it automatically crafts a detailed, expert-level prompt for Google's Gemini model.
                    </p>
                    <p>
                        The goal is to perform a non-intrusive, passive analysis, identifying potential vulnerabilities based on publicly available information and cybersecurity best practices, without ever sending a single packet to the target server.
                    </p>
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="font-semibold text-lg text-blue-400 mb-2">Powered by Google Gemini</h3>
                        <p className="text-sm">
                            This application leverages the advanced reasoning capabilities of the Gemini 2.5 Pro model to interpret the generated prompts and provide a comprehensive, hypothetical security analysis. The quality of the results is a direct reflection of the model's understanding of cybersecurity concepts.
                        </p>
                    </div>
                     <div className="p-4 bg-red-900/40 border border-red-700/50 rounded-lg">
                        <h3 className="font-semibold text-lg text-red-300 mb-2">Important Disclaimer</h3>
                        <p className="text-sm">
                            The analysis provided by Wesecure is for <strong>educational and informational purposes only</strong>. It is a simulated assessment and does not constitute a real penetration test. Findings are hypothetical and must be verified by a qualified security professional through a comprehensive, authorized security audit. Never attempt to exploit any potential vulnerabilities identified by this tool.
                        </p>
                    </div>
                </div>

                 <div className="p-4 border-t border-gray-700 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;