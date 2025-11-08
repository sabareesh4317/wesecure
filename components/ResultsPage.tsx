import React, { useState, useEffect } from 'react';
import type { HistoryItem, AnalysisCheck, SecurityScore } from '../types';
import { ChevronDownIcon, FileTextIcon, ShieldIcon, LockClosedIcon, CodeBracketIcon, PuzzlePieceIcon, CubeIcon, FingerprintIcon, BeakerIcon, LightBulbIcon } from './icons';

// --- Helper Functions & Components ---

const scoreMap: Record<string, { value: number; color: string; threat: string; glowClass: string; gradientId: string; }> = {
    'A+': { value: 100, color: '#4ade80', threat: 'Minimal Risk', glowClass: 'score-glow-green', gradientId: 'score-gradient-minimal' },
    'A': { value: 95, color: '#4ade80', threat: 'Minimal Risk', glowClass: 'score-glow-green', gradientId: 'score-gradient-minimal' },
    'B': { value: 85, color: '#60a5fa', threat: 'Low Risk', glowClass: 'score-glow-blue', gradientId: 'score-gradient-low' },
    'C': { value: 75, color: '#facc15', threat: 'Medium Risk', glowClass: 'score-glow-yellow', gradientId: 'score-gradient-medium' },
    'D': { value: 65, color: '#fb923c', threat: 'High Risk', glowClass: 'score-glow-yellow', gradientId: 'score-gradient-high' },
    'F': { value: 40, color: '#f87171', threat: 'Critical Risk', glowClass: 'score-glow-red', gradientId: 'score-gradient-critical' },
};

const getScoreDetails = (score: SecurityScore) => {
    return scoreMap[score] || { value: 0, color: '#9ca3af', threat: 'Undetermined', glowClass: '', gradientId: 'score-gradient-undetermined' };
};

const getSeverityTagClasses = (risk: AnalysisCheck['risk']) => {
  if (!risk) return 'severity-tag-default';
  switch (risk.toLowerCase()) {
    case 'high': return 'severity-tag-high';
    case 'medium': return 'severity-tag-medium';
    case 'low': return 'severity-tag-low';
    case 'informational': return 'severity-tag-informational';
    case 'pass': return 'severity-tag-pass';
    default: return 'severity-tag-default';
  }
};

const getSeverityIconColor = (risk: AnalysisCheck['risk']) => {
  if (!risk) return 'icon-color-default';
  switch (risk.toLowerCase()) {
    case 'high': return 'icon-color-high';
    case 'medium': return 'icon-color-medium';
    case 'low': return 'icon-color-low';
    case 'informational': return 'icon-color-informational';
    case 'pass': return 'icon-color-pass';
    default: return 'icon-color-default';
  }
};

const getCategoryIcon = (category: string, risk: AnalysisCheck['risk']) => {
    const cat = category.toLowerCase();
    const iconProps = { className: `w-6 h-6 ${getSeverityIconColor(risk)}` };
    if (cat.includes('ssl') || cat.includes('https')) return <LockClosedIcon {...iconProps} />;
    if (cat.includes('cms')) return <PuzzlePieceIcon {...iconProps} />;
    if (cat.includes('tech') || cat.includes('dependenc')) return <FingerprintIcon {...iconProps} />;
    if (cat.includes('header') || cat.includes('cookie')) return <CubeIcon {...iconProps} />;
    return <CodeBracketIcon {...iconProps} />;
};

// --- Sub-components ---

const ScoreGauge: React.FC<{ score: SecurityScore }> = ({ score }) => {
    const { value, color, threat, glowClass, gradientId } = getScoreDetails(score);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);
    
    useEffect(() => {
        const progress = value / 100;
        const newOffset = circumference * (1 - progress);
        // Timeout to allow for CSS transition to be visible on load
        const timer = setTimeout(() => setOffset(newOffset), 100);
        return () => clearTimeout(timer);
    }, [score, value, circumference]);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="relative score-gauge-container">
                <div className={`score-gauge-glow ${glowClass}`}></div>
                <svg className="w-full h-full score-gauge-svg" viewBox="0 0 200 200">
                     <defs>
                        <linearGradient id="score-gradient-minimal" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#22c55e"/></linearGradient>
                        <linearGradient id="score-gradient-low" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
                        <linearGradient id="score-gradient-medium" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#facc15"/><stop offset="100%" stopColor="#eab308"/></linearGradient>
                        <linearGradient id="score-gradient-high" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#f97316"/></linearGradient>
                        <linearGradient id="score-gradient-critical" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f87171"/><stop offset="100%" stopColor="#ef4444"/></linearGradient>
                        <linearGradient id="score-gradient-undetermined" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#9ca3af"/><stop offset="100%" stopColor="#6b7280"/></linearGradient>
                    </defs>
                    <circle className="score-gauge-bg" cx="100" cy="100" r={radius}></circle>
                    <circle
                        className="score-gauge-fg"
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke={`url(#${gradientId})`}
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset }}
                    ></circle>
                </svg>
                <div className="score-gauge-reflection"></div>
                <div className="score-gauge-inner-shadow"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold" style={{ color }}>{score}</span>
                </div>
            </div>
            <p className="mt-4 text-lg font-semibold" style={{ color: color, textShadow: `0 0 10px ${color}40` }}>{threat}</p>
        </div>
    );
};

const ResultItem: React.FC<{ check: AnalysisCheck; style: React.CSSProperties }> = ({ check, style }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="report-card-glass rounded-xl overflow-hidden animate-slide-fade-in" style={style}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left gap-4"
            >
                <div className="flex items-center gap-4 min-w-0">
                    {getCategoryIcon(check.category, check.risk)}
                    <span className="font-semibold text-gray-200 truncate">{check.category}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`severity-tag ${getSeverityTagClasses(check.risk)}`}>
                        {check.risk}
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                 <div className="px-4 pb-4 border-t border-gray-700/50 space-y-4 pt-4">
                    <div className="detail-block">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400/80 mb-2">
                            <BeakerIcon className="w-4 h-4 text-amber-400" />
                            Findings
                        </h4>
                        <p className="text-gray-300/80 text-sm leading-relaxed whitespace-pre-wrap">{check.findings}</p>
                    </div>
                    <div className="detail-block">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400/80 mb-2">
                            <LightBulbIcon className="w-4 h-4 text-cyan-400" />
                            Recommendation
                        </h4>
                        <p className="text-gray-300/80 text-sm leading-relaxed whitespace-pre-wrap">{check.recommendation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

const ResultsPage: React.FC<{ result: HistoryItem }> = ({ result }) => {
    if (!result || !result.result) {
        return <div className="text-center p-8"><p>No analysis result found.</p></div>;
    }
    
    const { websiteUrl, timestamp, scanMode, result: analysisResult } = result;
    const { score, summary, checks } = analysisResult;

    return (
        <div className="space-y-10 relative">
            <div className="report-top-gradient"></div>
             <div className="text-center relative pt-8 pb-4">
                 <div className="relative inline-block">
                    <div className="report-hero-shield-glow"></div>
                    <ShieldIcon className="h-16 w-16 mx-auto text-blue-400/80 animate-pulse-shield-center opacity-40"/>
                 </div>
                <p className="mt-4 text-lg text-blue-400 font-medium truncate">{websiteUrl}</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-100">
                    Security Scan Report
                </h1>
                <p className="mt-4 text-sm text-gray-500">
                    Scanned on {new Date(timestamp).toLocaleString()} ({scanMode} mode)
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 report-card-glass report-card-glass-primary rounded-2xl p-6 flex flex-col items-center justify-center animate-slide-fade-in">
                    <ScoreGauge score={score} />
                </div>
                <div className="lg:col-span-2 report-card-glass report-card-glass-primary rounded-2xl p-6 animate-slide-fade-in" style={{ animationDelay: '150ms'}}>
                    <div className="relative mb-3">
                         <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                            <FileTextIcon />
                            AI Summary
                        </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{summary}</p>
                </div>
            </div>

            <div>
                <div className="section-header-anchor">
                   <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                       <ShieldIcon className="w-6 h-6 text-blue-400" />
                       Tech & Safety Checks
                   </h2>
                </div>
                <div className="space-y-3">
                    {checks.map((check, index) => (
                        <ResultItem 
                            key={index} 
                            check={check}
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;