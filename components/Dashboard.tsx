import React, { useState, useMemo } from 'react';
import type { HistoryItem, ScanMode } from '../types';
import { LoadingSpinner, ClockIcon, ShieldIcon, UrlIcon, NeonArrowRightIcon, CyberSpinnerIcon, StarIcon, LockClosedIcon, HackingIcon, CodeBracketIcon, VerifiedIcon } from './icons';

interface DashboardProps {
    onStartScan: (websiteUrl: string, scanMode: ScanMode) => void;
    isLoading: boolean;
    isValidating: boolean;
    error: string;
    history: HistoryItem[];
    onSelectHistoryItem: (item: HistoryItem) => void;
}

const CyberHeroVisual: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const particles = useMemo(() => Array.from({ length: 50 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        animationDuration: `${Math.random() * 15 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
    })), []);

    return (
        <div className={`absolute inset-0 z-0 overflow-hidden ${isLoading ? 'hero-scanning' : ''}`} aria-hidden="true">
            {/* Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pan-grid"></div>

            {/* Purple Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] purple-halo blur-3xl"></div>

            {/* Soft Scanning Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="scanning-ring"></div>
            </div>

            {/* Particles */}
            {particles.map((style, i) => (
                <div
                    key={i}
                    className="absolute bg-cyan-400 rounded-full animate-move-particles"
                    style={style}
                />
            ))}

            {/* Central Scanning Radar */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                    {/* Pulsing Rings */}
                    <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse-ring" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute inset-10 rounded-full border border-cyan-400/30 animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute inset-20 rounded-full border border-cyan-400/30 animate-pulse-ring" style={{ animationDelay: '2s' }}></div>
                    
                    {/* Radar Sweep */}
                    <div className="absolute inset-0 animate-spin-radar">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/2 bg-gradient-to-b from-cyan-400/80 to-transparent"></div>
                    </div>

                    {/* Central Shield */}
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="shield-container">
                            <div className="absolute shield-backdrop-glow"></div>
                            <ShieldIcon className="w-20 h-20 sm:w-24 sm:h-24 text-blue-400 opacity-50 animate-pulse-shield-center" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({
    onStartScan,
    isLoading,
    isValidating,
    error,
    history,
    onSelectHistoryItem
}) => {
    const [websiteUrl, setWebsiteUrl] = useState<string>('');
    const [scanMode, setScanMode] = useState<ScanMode>('quick');
    
    const isButtonDisabled = isLoading || isValidating || !websiteUrl.trim();
    const buttonText = isValidating ? 'Validating URL...' : isLoading ? 'Scanning...' : 'Start Scan';
    const isScanning = isLoading && !isValidating;

    const recentScans = history.slice(0, 5);

    const reviews = [
      {
        name: 'Sarah J.',
        title: 'Lead Security Engineer',
        avatar: 'SJ',
        rating: 5,
        icon: LockClosedIcon,
        text: "Wesecure has become my go-to for initial recon. The AI-powered analysis is incredibly fast and surfaces key issues I can dig into deeper. A real time-saver."
      },
      {
        name: 'Mike R.',
        title: 'Penetration Tester',
        avatar: 'MR',
        rating: 5,
        icon: HackingIcon,
        text: "The structured JSON output is a game-changer for my reporting workflow. I can pipe the results directly into my tools. The deep scan is surprisingly thorough for a passive tool."
      },
      {
        name: 'Elena K.',
        title: 'DevSecOps Specialist',
        avatar: 'EK',
        rating: 5,
        icon: CodeBracketIcon,
        text: "A fantastic tool for quick posture checks before a deployment. It helps our team catch low-hanging fruit like misconfigured headers before they become a problem."
      }
    ];
    
    const getScoreBadgeClasses = (score: string) => {
        if (!score) return 'bg-gray-500/20 text-gray-300';
        const s = score.toUpperCase();
        if (s.startsWith('A')) return 'bg-green-500/20 text-green-300';
        if (s.startsWith('B')) return 'bg-blue-500/20 text-blue-300';
        if (s.startsWith('C')) return 'bg-yellow-500/20 text-yellow-300';
        if (s.startsWith('D')) return 'bg-orange-500/20 text-orange-300';
        if (s.startsWith('F')) return 'bg-red-500/20 text-red-300';
        return 'bg-gray-500/20 text-gray-300';
    };

    const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");

        const oldRipple = button.querySelector('.ripple');
        if (oldRipple) oldRipple.remove();

        button.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    };

    const getButtonClasses = () => {
        const base = "btn-start-scan relative overflow-hidden w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all duration-300";
        if (isScanning) {
            return `${base} btn-scanning`;
        }
        if (isValidating || !websiteUrl.trim()) {
            return `${base} bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed`;
        }
        return `${base} bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5153c9] hover:to-[#7b46eb] hover:scale-[1.02]`;
    };

    return (
        <div className="space-y-8">
            <div className="relative text-center pt-8 pb-12 overflow-hidden rounded-xl">
                <CyberHeroVisual isLoading={isLoading} />
                <div className="hero-text-glow" />
                <div className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
                        AI Security Scanner
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Enter a website URL to perform a non-intrusive security analysis powered by AI.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl p-6 scan-card-glow">
                    <form onSubmit={(e) => { e.preventDefault(); if (!isButtonDisabled) onStartScan(websiteUrl, scanMode); }} className="space-y-6">
                        <div>
                            <label htmlFor="website-url" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                                <ShieldIcon className="h-5 w-5 text-blue-400/80 animate-pulse" />
                                <span>Website URL</span>
                            </label>
                            <div className="input-cyber">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UrlIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="website-url"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    className="block w-full bg-transparent border-transparent rounded-md shadow-sm sm:text-sm h-12 px-4 pl-12 text-lg focus:ring-0 focus:border-transparent"
                                    placeholder="https://example.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Scan Type
                            </label>
                            <div className="flex items-center bg-gray-900 rounded-lg p-1">
                                <button
                                    type="button"
                                    onClick={() => setScanMode('quick')}
                                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none border ${
                                        scanMode === 'quick' 
                                        ? 'bg-blue-600 text-white shadow-lg border-transparent' 
                                        : 'text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:border-blue-500/40'
                                    }`}
                                >
                                    Quick Scan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setScanMode('deep')}
                                     className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none border ${
                                        scanMode === 'deep' 
                                        ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg border-transparent' 
                                        : 'text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:border-blue-500/40'
                                    }`}
                                >
                                    Deep Scan
                                </button>
                            </div>
                        </div>

                        {error && (
                             <div className="error-box-cyber text-center" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isButtonDisabled}
                            onClick={handleRipple}
                            className={getButtonClasses()}
                        >
                            {isValidating ? (
                                <>
                                    <LoadingSpinner className="h-5 w-5" />
                                    <span>{buttonText}</span>
                                </>
                            ) : isScanning ? (
                                <>
                                    <CyberSpinnerIcon className="w-5 h-5" />
                                    <span className="scanning-text">{buttonText}</span>
                                </>
                            ) : (
                                <span>{buttonText}</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {recentScans.length > 0 && (
                 <div className="max-w-2xl mx-auto">
                    <div className="history-card-glow rounded-xl p-6">
                         <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-gray-100">Recent Scans</h3>
                                    <ClockIcon className="w-7 h-7 text-indigo-400 history-header-icon-glow" />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Your last 5 scanned URLs appear here.
                                </p>
                            </div>
                            <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0 mt-1">
                                View All &rarr;
                            </button>
                        </div>
                        <ul className="-mx-6 mt-4">
                            {recentScans.map(item => (
                                <li 
                                    key={item.id} 
                                    onClick={() => onSelectHistoryItem(item)}
                                    className="history-row px-6 py-4 cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <img 
                                                src={`https://www.google.com/s2/favicons?sz=32&domain_url=${item.websiteUrl}`}
                                                alt=""
                                                className="w-6 h-6 flex-shrink-0 rounded-sm"
                                                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-blue-400 truncate text-base">{item.websiteUrl}</p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getScoreBadgeClasses(item.result.score)}`}>
                                                {item.result.score}
                                            </span>
                                            <NeonArrowRightIcon className="history-row-arrow w-6 h-6 text-blue-400"/>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                 </div>
            )}
            
            <div className="max-w-5xl mx-auto py-8">
              <div className="section-divider"></div>
            </div>
            
            <div className="max-w-5xl mx-auto reviews-section-bg">
                 <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient id="star-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFD66B"/>
                            <stop offset="100%" stopColor="#FFBA00"/>
                        </linearGradient>
                    </defs>
                </svg>
                <div className="text-center mb-12 animate-slide-fade-in" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-2xl font-bold text-gray-100">Trusted by Security Professionals</h3>
                    <p className="mt-2 text-gray-400">See what others are saying about Wesecure.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <div 
                            key={index} 
                            className="review-card rounded-xl p-6 flex flex-col animate-slide-fade-in"
                            style={{ animationDelay: `${400 + index * 150}ms` }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="review-avatar">
                                    {review.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-white/90">{review.name}</p>
                                        <div className="verified-badge"><VerifiedIcon /> Verified</div>
                                    </div>
                                     <div className="flex items-center gap-1.5 text-sm text-white/60 mt-1">
                                        <review.icon className="w-4 h-4" />
                                        <span>{review.title}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mb-4 star-rating">
                                {[...Array(review.rating)].map((_, i) => <StarIcon key={i} />)}
                            </div>
                            <p className="text-white/75 text-sm flex-grow review-text transition-transform duration-300">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;