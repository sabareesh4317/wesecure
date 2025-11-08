

import React, { useState, useCallback } from 'react';
import { CloseIcon, LoadingSpinner } from './icons';
import type { AnalysisOption, AnalysisDetail } from '../types';
import { getSecurityAnalysis } from '../services/geminiService';
import { Type } from '@google/genai';

const getRiskColorClasses = (risk: AnalysisDetail['risk']) => {
  switch (risk?.toLowerCase()) {
    case 'high':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const ScanResult: React.FC<{ detail: AnalysisDetail }> = ({ detail }) => (
    <div className="mt-4 space-y-4 bg-gray-900/50 p-4 rounded-lg">
        <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Risk Level</h4>
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getRiskColorClasses(detail.risk)}`}>
                {detail.risk || 'N/A'}
            </span>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Findings</h4>
            <pre className="text-gray-300 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">{detail.findings}</pre>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Recommendation</h4>
            <pre className="text-gray-300 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">{detail.recommendation}</pre>
        </div>
    </div>
);


interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisOptions: AnalysisOption[];
  websiteUrl: string;
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, analysisOptions, websiteUrl }) => {
    const [loadingScan, setLoadingScan] = useState<string | null>(null);
    const [scanResults, setScanResults] = useState<Record<string, AnalysisDetail | string>>({});
    const [scanErrors, setScanErrors] = useState<Record<string, string>>({});

    const handleRunScan = useCallback(async (scan: AnalysisOption) => {
        if (!websiteUrl) {
            setScanErrors(prev => ({...prev, [scan.id]: 'Target website URL is missing.'}));
            return;
        }
        setLoadingScan(scan.id);
        setScanErrors(prev => ({...prev, [scan.id]: ''}));
        setScanResults(prev => ({...prev, [scan.id]: ''}));

        const prompt = `
As an expert cybersecurity analyst, perform a non-intrusive security assessment for the scan type "${scan.label}" on the website: ${websiteUrl}.

Focus exclusively on: ${scan.description}.

Base your analysis on passive reconnaissance. Explain your findings, assess the risk level, and provide a clear mitigation recommendation.

Present your findings as a single, structured JSON object with three keys: "risk", "findings", and "recommendation".
- "risk" should be one of: High, Medium, Low, Informational.
- "findings" should be a detailed explanation.
- "recommendation" should be actionable advice.
        `;

        const schema = {
            type: Type.OBJECT,
            properties: {
                risk: { type: Type.STRING },
                findings: { type: Type.STRING },
                recommendation: { type: Type.STRING }
            },
            required: ['risk', 'findings', 'recommendation']
        };

        try {
            const resultJsonString = await getSecurityAnalysis(prompt.trim(), schema);
            try {
                const resultObject = JSON.parse(resultJsonString);
                setScanResults(prev => ({...prev, [scan.id]: resultObject}));
            } catch (e) {
                setScanResults(prev => ({...prev, [scan.id]: resultJsonString}));
            }
        } catch (e: any) {
            setScanErrors(prev => ({...prev, [scan.id]: e.message || 'An unknown error occurred.'}));
        } finally {
            setLoadingScan(null);
        }
    }, [websiteUrl]);

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
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Individual Scans</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                        aria-label="Close scans modal"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6 text-gray-300 space-y-4 max-h-[70vh] overflow-y-auto">
                    <p className="text-sm text-gray-400">Run targeted, on-demand scans for specific vulnerability types. Results are generated in real-time.</p>
                    <ul className="space-y-3">
                        {analysisOptions.map(option => (
                            <li key={option.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-200">{option.label}</h3>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRunScan(option)}
                                        disabled={loadingScan === option.id || !websiteUrl}
                                        className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors w-24 text-center"
                                    >
                                        {loadingScan === option.id ? <LoadingSpinner className="h-5 w-5 mx-auto"/> : 'Run'}
                                    </button>
                                </div>
                                {scanErrors[option.id] && <p className="mt-2 text-sm text-red-400">Error: {scanErrors[option.id]}</p>}
                                {/* FIX: Use an IIFE to create a stable variable for type narrowing, preventing the ReactNode type error. */}
                                {(() => {
                                    const result = scanResults[option.id];
                                    if (!result) {
                                        return null;
                                    }
                                    if (typeof result === 'object') {
                                        return <ScanResult detail={result as AnalysisDetail} />;
                                    }
                                    return <pre className="mt-4 text-gray-300 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">{result}</pre>;
                                })()}
                            </li>
                        ))}
                    </ul>
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

export default ScanModal;
