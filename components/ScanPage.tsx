import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LoadingSpinner, TerminalIcon, GradientUploadIcon, LockClosedIcon, CubeIcon, CookieIcon, PuzzlePieceIcon, FingerprintIcon, ShieldIcon, BeakerIcon, CodeBracketIcon, LightBulbIcon, WarningTriangleIcon, CloseIcon, ChevronDownIcon, EllipsisVerticalIcon, ShareIcon, DocumentArrowDownIcon, CopyIcon, CheckIcon } from './icons';
import { getContentAnalysis, getSecurityAnalysis, isUrlActive } from '../services/geminiService';
import type { ContentAnalysisResult, AnalysisOption, AnalysisDetail } from '../types';
import { DEEP_ANALYSIS_OPTIONS } from '../constants';
import { Type } from '@google/genai';

// --- Helper Components & Functions for Content Analysis ---
const getContentThreatColorClasses = (level: ContentAnalysisResult['threatLevel']) => {
  switch (level?.toLowerCase()) {
    case 'malicious': return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'suspicious': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'safe': return 'bg-green-500/20 text-green-300 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const ContentAnalysisResultDisplay: React.FC<{ result: ContentAnalysisResult }> = ({ result }) => (
    <div className="mt-6 space-y-4 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
        <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Threat Level</h4>
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getContentThreatColorClasses(result.threatLevel)}`}>
                {result.threatLevel || 'Unknown'}
            </span>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Summary</h4>
            <p className="text-gray-300 whitespace-pre-wrap break-words text-sm leading-relaxed">{result.summary}</p>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Findings</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                {result.findings?.map((finding, index) => <li key={index}>{finding}</li>)}
            </ul>
        </div>
    </div>
);


// --- Helper Components & Functions for Technical Analysis ---
const getTechScanIcon = (scanId: string, className: string = "w-6 h-6 text-indigo-400 flex-shrink-0") => {
    const iconProps = { className };
    switch (scanId) {
        case 'ssl': return <LockClosedIcon {...iconProps} />;
        case 'headers': return <CubeIcon {...iconProps} />;
        case 'cookies': return <CookieIcon {...iconProps} />;
        case 'cms': return <PuzzlePieceIcon {...iconProps} />;
        case 'tech_stack': return <FingerprintIcon {...iconProps} />;
        case 'ports': return <TerminalIcon {...iconProps} />;
        case 'http_security': return <ShieldIcon {...iconProps} />;
        case 'dependency_vulns': return <BeakerIcon {...iconProps} />;
        case 'config_audit': return <CodeBracketIcon {...iconProps} />;
        case 'seo_health': return <LightBulbIcon {...iconProps} />;
        default: return <CodeBracketIcon {...iconProps} />;
    }
}


const TechnicalScanDetailView: React.FC<{
    scanData: { scan: AnalysisOption; detail: AnalysisDetail };
    onClose: () => void;
}> = ({ scanData, onClose }) => {
    const { scan, detail } = scanData;
    const [isTechnicalDetailsOpen, setIsTechnicalDetailsOpen] = useState(false);
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const actionsMenuRef = useRef<HTMLDivElement>(null);

    const riskLower = detail.risk?.toLowerCase() || 'unknown';
    
    const riskStripeClasses: Record<string, string> = {
        'high': 'risk-stripe-high', 'medium': 'risk-stripe-medium', 'low': 'risk-stripe-low',
        'informational': 'risk-stripe-informational', 'pass': 'risk-stripe-pass', 'unknown': 'risk-stripe-unknown'
    };
     const riskBadgeClasses: Record<string, string> = {
        'high': 'risk-badge-high', 'medium': 'risk-badge-medium', 'low': 'risk-badge-low',
        'informational': 'risk-badge-informational', 'pass': 'risk-badge-pass', 'unknown': 'risk-badge-unknown'
    };
    const getFindingBulletClass = (risk: string) => {
        switch(risk) {
            case 'high': return 'bullet-high';
            case 'medium': return 'bullet-medium';
            case 'low': return 'bullet-low';
            default: return 'bullet-info';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
                setIsActionsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(detail, null, 2));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    return (
        <div className="scan-detail-view">
            <header className="scan-detail-header">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
                    <CloseIcon />
                </button>
                <div className="flex items-center gap-3">
                    {getTechScanIcon(scan.id, "w-6 h-6 text-gray-400")}
                    <h2 className="text-xl font-bold text-white text-center">Analysis Result</h2>
                </div>
                 <div className="relative" ref={actionsMenuRef}>
                    <button onClick={() => setIsActionsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
                        <EllipsisVerticalIcon />
                    </button>
                    {isActionsMenuOpen && (
                         <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700">
                             <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50">
                                <ShareIcon /> Share Report
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50">
                                <DocumentArrowDownIcon /> Export PDF
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50">
                                <CodeBracketIcon /> Export JSON
                            </a>
                        </div>
                    )}
                </div>
            </header>
            
            <div className="flex-grow overflow-y-auto">
                <div className="scan-detail-content">
                    <div className={`risk-stripe ${riskStripeClasses[riskLower]}`}></div>

                    <div className="p-6 sm:p-10 space-y-20">
                        {/* Header Section */}
                        <section className="text-center pt-8 animate-fade-in-section" style={{ animationDelay: '100ms' }}>
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                                {getTechScanIcon(scan.id, "w-10 h-10 text-indigo-300")}
                            </div>
                            <h1 className="text-3xl font-extrabold text-white">{scan.label}</h1>
                            <div className={`risk-badge mx-auto mt-4 ${riskBadgeClasses[riskLower]}`}>
                                {riskLower !== 'pass' && <WarningTriangleIcon className="w-3.5 h-3.5" />}
                                <span>{detail.risk}</span>
                            </div>
                        </section>

                        {/* Findings Section */}
                        <section className="animate-fade-in-section" style={{ animationDelay: '200ms' }}>
                            <h3 className="scan-result-section-title">Findings</h3>
                            <ul className="space-y-6">
                                {detail.findings.map((finding, index) => (
                                    <li key={index} className="flex items-start gap-4 scan-detail-bullet" style={{ animationDelay: `${300 + index * 75}ms`}}>
                                        <span className={`scan-detail-bullet-icon ${getFindingBulletClass(riskLower)}`}></span>
                                        <p className="leading-relaxed scan-detail-body-text">{finding}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Recommendations Section */}
                        <section className="animate-fade-in-section" style={{ animationDelay: '300ms' }}>
                            <h3 className="scan-result-section-title">Recommendations</h3>
                             <ul className="space-y-6">
                                {detail.recommendation.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-4 scan-detail-bullet" style={{ animationDelay: `${500 + index * 75}ms`}}>
                                        <span className="scan-detail-bullet-icon bullet-pass"></span>
                                        <p className="leading-relaxed scan-detail-body-text">{rec}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                         {/* Technical Details Section */}
                        <section className="animate-fade-in-section" style={{ animationDelay: '400ms' }}>
                             <button onClick={() => setIsTechnicalDetailsOpen(!isTechnicalDetailsOpen)} className="w-full flex justify-between items-center group">
                                <h3 className="scan-result-section-title w-full text-left">Technical Details</h3>
                                 <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform group-hover:text-white ${isTechnicalDetailsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`accordion-content ${isTechnicalDetailsOpen ? 'open' : ''}`}>
                                <div className="pt-4">
                                     <div className="json-viewer">
                                        <div className="json-viewer-header">
                                            <span className="title">RAW JSON OUTPUT</span>
                                            <button onClick={handleCopyJson} className="copy-btn">
                                                {isCopied ? <CheckIcon /> : <CopyIcon />}
                                                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                                            </button>
                                        </div>
                                        <pre>
                                          {JSON.stringify(detail, null, 2).split('\n').map((line, i) => (
                                            <span key={i} className="json-line">{line}</span>
                                          ))}
                                        </pre>
                                     </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Scan Page Component ---
const ScanPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'file' | 'technical'>('file');
    
    // State for Content Scanner (File)
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isContentLoading, setIsContentLoading] = useState(false);
    const [contentError, setContentError] = useState('');
    const [contentResult, setContentResult] = useState<ContentAnalysisResult | null>(null);

    // State for Technical Scanner
    const [technicalUrlInput, setTechnicalUrlInput] = useState('https://example.com');
    const [loadingTechnicalScan, setLoadingTechnicalScan] = useState<string | null>(null);
    const [isTechnicalValidating, setIsTechnicalValidating] = useState(false);
    const [technicalScanResults, setTechnicalScanResults] = useState<Record<string, AnalysisDetail>>({});
    const [technicalScanErrors, setTechnicalScanErrors] = useState<Record<string, string>>({});
    const [detailViewData, setDetailViewData] = useState<{ scan: AnalysisOption; detail: AnalysisDetail } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
            setContentError('');
            setContentResult(null);
        } else {
            setContentError('Please select a valid image file (e.g., PNG, JPG).');
            setFile(null);
            setFilePreview(null);
        }
    };

    const handleContentScan = useCallback(async () => {
        if (!file) {
            setContentError('Please upload an image file to scan.');
            return;
        }
        setIsContentLoading(true);
        setContentError('');
        setContentResult(null);

        let imagePart: { inlineData: { data: string; mimeType: string } } | undefined;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise<void>((resolve, reject) => {
            reader.onloadend = () => {
                const base64Data = (reader.result as string)?.split(',')[1];
                if (base64Data && file) {
                    imagePart = { inlineData: { data: base64Data, mimeType: file.type } };
                    resolve();
                } else { reject(new Error("Failed to read file.")); }
            };
            reader.onerror = (error) => reject(error);
        });
        const prompt = `Analyze the uploaded image for signs of being a phishing attempt or containing malicious content. Look for fake login forms, suspicious branding, or deceptive calls to action. Return ONLY a valid JSON object with three keys: "threatLevel" (a single string: 'Safe', 'Suspicious', or 'Malicious'), "summary" (a brief one-sentence explanation), and "findings" (an array of short strings detailing specific observations).`;

        try {
            const resultJsonString = await getContentAnalysis(prompt.trim(), imagePart);
            setContentResult(JSON.parse(resultJsonString));
        } catch (e: any) {
            setContentError(e.message || 'An unknown error occurred during analysis.');
        } finally {
            setIsContentLoading(false);
        }
    }, [file]);

    const handleRunTechnicalScan = useCallback(async (scan: AnalysisOption) => {
        if (!technicalUrlInput) {
            setTechnicalScanErrors(prev => ({...prev, [scan.id]: 'Target website URL is missing.'}));
            return;
        }
        
        setLoadingTechnicalScan(scan.id);
        setIsTechnicalValidating(true);
        setTechnicalScanErrors(prev => ({...prev, [scan.id]: ''}));

        const validation = await isUrlActive(technicalUrlInput);
        setIsTechnicalValidating(false);

        if (!validation.isValid) {
            setTechnicalScanErrors(prev => ({...prev, [scan.id]: `URL validation failed: ${validation.message}`}));
            setLoadingTechnicalScan(null);
            return;
        }

        const prompt = `As an expert cybersecurity analyst, perform a non-intrusive security assessment for the scan type "${scan.label}" on the website: ${technicalUrlInput}. Focus exclusively on: ${scan.description}. Base your analysis on passive reconnaissance. Present your findings as a single, structured JSON object with three keys: "risk", "findings", and "recommendation".
- "risk" should be one of: High, Medium, Low, Informational, Pass.
- "findings" should be an array of strings. Each string is a concise bullet point detailing a specific observation.
- "recommendation" should be an array of strings. Each string is a clear, actionable step for mitigation.`;
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                risk: { type: Type.STRING },
                findings: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendation: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['risk', 'findings', 'recommendation']
        };

        try {
            const resultJsonString = await getSecurityAnalysis(prompt.trim(), schema);
            const resultObject = JSON.parse(resultJsonString) as AnalysisDetail;
            setTechnicalScanResults(prev => ({...prev, [scan.id]: resultObject }));
            setDetailViewData({ scan, detail: resultObject });
        } catch (e: any) {
            setTechnicalScanErrors(prev => ({...prev, [scan.id]: e.message || 'An unknown error occurred.'}));
        } finally {
            setLoadingTechnicalScan(null);
        }
    }, [technicalUrlInput]);


    const renderContentScanner = () => {
        const buttonText = isContentLoading ? 'Scanning...' : 'Scan Now';
        const isScanDisabled = isContentLoading || !file;

        return (
            <>
                <div className="pt-8 space-y-6">
                    <div>
                         <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload a suspicious image (e.g., a potential phishing screenshot)</label>
                         <div className="file-upload-box">
                             <div className="shine"></div>
                            <div className="space-y-2 text-center">
                                <div className="upload-icon-container mx-auto">
                                    {filePreview ? <img src={filePreview} alt="Preview" className="h-16 w-16 rounded-full object-cover"/> : <GradientUploadIcon />}
                                </div>
                                <div className="flex text-sm text-gray-400"><label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none px-1"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                    </div>
                     <button onClick={handleContentScan} disabled={isScanDisabled} className="w-full btn-run-scan flex justify-center items-center gap-2 py-3 px-4 text-sm font-medium text-white disabled:opacity-60">
                        {isContentLoading && <LoadingSpinner className="h-5 w-5"/>}
                        {buttonText}
                    </button>
                    {contentError && <p className="mt-2 text-sm text-red-400 text-center">{contentError}</p>}
                </div>
                {contentResult && <ContentAnalysisResultDisplay result={contentResult} />}
            </>
        );
    };

    const renderTechnicalScanner = () => (
        <div className="pt-8 space-y-6">
            <div>
                <label htmlFor="tech-url-input" className="block text-sm font-medium text-gray-300 mb-2">Target Website URL</label>
                <input id="tech-url-input" type="text" value={technicalUrlInput} onChange={(e) => setTechnicalUrlInput(e.target.value)} className="block w-full bg-gray-900/50 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-12 px-4" placeholder="https://example.com" />
            </div>
            <p className="text-sm text-gray-400">Run targeted, on-demand scans for specific vulnerability types against the URL above.</p>
            <ul className="space-y-4 pr-2">
                {DEEP_ANALYSIS_OPTIONS.map(option => {
                    const result = technicalScanResults[option.id];
                    const error = technicalScanErrors[option.id];
                    const isLoading = loadingTechnicalScan === option.id;

                    return (
                        <li key={option.id} className="scan-card-technical">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-start gap-4 flex-grow w-full">
                                    {getTechScanIcon(option.id)}
                                    <div>
                                        <h3 className="font-semibold text-gray-200">{option.label}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => result ? setDetailViewData({ scan: option, detail: result }) : handleRunTechnicalScan(option)} 
                                    disabled={isLoading || !technicalUrlInput || isTechnicalValidating} 
                                    className="btn-run-scan ml-auto px-4 py-2 text-sm font-medium text-white w-32 text-center flex-shrink-0"
                                >
                                    {isLoading ? <LoadingSpinner className="h-5 w-5 mx-auto"/> : result ? 'View Report' : 'Run Scan'}
                                </button>
                            </div>
                             {error && <p className="mt-2 text-sm text-red-400">Error: {error}</p>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
      <>
        <div className="space-y-8 analysis-center-bg">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100">Analysis Center</h2>
                <p className="mt-2 text-gray-400">Scan suspicious files or perform technical audits on websites.</p>
            </div>
            <div className="max-w-4xl mx-auto analysis-center-card rounded-xl p-6 sm:p-8">
                <div className="scan-tabs">
                    <button onClick={() => setActiveTab('file')} className={`scan-tab flex items-center justify-center gap-2 ${activeTab === 'file' ? 'active' : ''}`}>
                        File Scan
                    </button>
                    <button onClick={() => setActiveTab('technical')} className={`scan-tab flex items-center justify-center gap-2 ${activeTab === 'technical' ? 'active' : ''}`}>
                        Technical Scans
                    </button>
                </div>
                {activeTab === 'file' ? renderContentScanner() : renderTechnicalScanner()}
            </div>
        </div>
        {detailViewData && (
            <TechnicalScanDetailView 
                scanData={detailViewData} 
                onClose={() => setDetailViewData(null)} 
            />
        )}
      </>
    );
};

export default ScanPage;