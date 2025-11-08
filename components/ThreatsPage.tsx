import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getCyberSecurityNews } from '../services/geminiService';
import type { NewsArticle, NewsCategory } from '../types';
import { RefreshIcon, VulnerabilityIcon, RansomwareIcon, MalwareIcon, AlertIcon, HackingIcon, PremiumVerifiedIcon } from './icons';

type FilterType = 'Latest' | 'High Risk' | 'Government Alerts' | 'CVE Updates';
type Severity = 'critical' | 'high' | 'medium' | 'informational';

const getSeverityFromCategory = (category: NewsCategory): Severity => {
    switch(category) {
        case 'vulnerability':
        case 'ransomware':
            return 'critical';
        case 'hacking':
        case 'breach':
            return 'high';
        case 'malware':
        case 'phishing':
            return 'medium';
        case 'alert':
            return 'informational';
        default:
            return 'informational';
    }
};

const getArticleIcon = (category: NewsCategory) => {
    const iconProps = { className: "w-6 h-6" };
    switch (category) {
        case 'vulnerability': return <VulnerabilityIcon {...iconProps} className="w-6 h-6 text-red-400" />;
        case 'ransomware': return <RansomwareIcon {...iconProps} className="w-6 h-6 text-red-400" />;
        case 'malware': return <MalwareIcon {...iconProps} className="w-6 h-6 text-yellow-400" />;
        case 'alert': return <AlertIcon {...iconProps} className="w-6 h-6 text-blue-400" />;
        case 'hacking': return <HackingIcon {...iconProps} className="w-6 h-6 text-orange-400" />;
        case 'phishing': return <MalwareIcon {...iconProps} className="w-6 h-6 text-yellow-400" />;
        case 'breach': return <AlertIcon {...iconProps} className="w-6 h-6 text-orange-400" />;
        default: return <VulnerabilityIcon {...iconProps} className="w-6 h-6 text-blue-400" />;
    }
};

const SkeletonCard: React.FC = () => (
    <div className="threat-card rounded-xl p-5">
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full animate-pulse-bg"></div>
            <div className="h-5 w-3/4 rounded animate-pulse-bg"></div>
        </div>
        <div className="flex gap-2 mt-4">
            <div className="h-5 w-20 rounded-full animate-pulse-bg"></div>
            <div className="h-5 w-24 rounded-full animate-pulse-bg"></div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-700/50 flex justify-between items-center">
            <div className="h-4 w-28 rounded animate-pulse-bg"></div>
            <div className="h-4 w-16 rounded animate-pulse-bg"></div>
        </div>
    </div>
);

const ArticleCard: React.FC<{ article: NewsArticle, severity: Severity }> = ({ article, severity }) => {
    const cardClasses = `threat-card rounded-xl block transform transition-all duration-300 hover:-translate-y-1 threat-card-${severity}`;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className={cardClasses}>
            <div className="p-5">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">{getArticleIcon(article.category)}</div>
                    <h3 className="font-bold text-gray-200 leading-tight text-lg">{article.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {article.tags.map(tag => (
                        <span key={tag} className="threat-tag">{tag}</span>
                    ))}
                </div>
                 <div className="mt-4 pt-3 border-t border-gray-700/50 flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-2 font-semibold">
                        <PremiumVerifiedIcon className="w-5 h-5" /> 
                        <span className="opacity-80">{article.source}</span>
                    </span>
                    <span className="opacity-80">{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
            </div>
        </a>
    );
};


const ThreatsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('Latest');

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const newsData = await getCyberSecurityNews();
            setArticles(newsData);
        } catch (e: any) {
            setError(e.message || 'Failed to fetch news. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const filteredArticles = useMemo(() => {
        if (activeFilter === 'High Risk') {
            return articles.filter(a => ['ransomware', 'vulnerability', 'hacking', 'breach'].includes(a.category));
        }
        if (activeFilter === 'Government Alerts') {
             return articles.filter(a => a.tags.includes('#CISA') || a.tags.includes('#FBI'));
        }
        if (activeFilter === 'CVE Updates') {
            return articles.filter(a => a.tags.some(tag => tag.toUpperCase().startsWith('#CVE')));
        }
        return articles; // Latest
    }, [articles, activeFilter]);
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</div>;
        }

        if (error) {
            return (
                <div className="text-center p-10 bg-red-900/40 rounded-xl border border-red-700/50">
                    <p className="text-red-300 font-semibold">An Error Occurred</p>
                    <p className="mt-2 text-red-400 text-sm">{error}</p>
                    <button onClick={fetchNews} className="mt-4 flex items-center gap-2 mx-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800">
                        <RefreshIcon className="h-5 w-5" />
                        Try Again
                    </button>
                </div>
            );
        }

        return (
             <div className="space-y-4">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => <ArticleCard key={article.id} article={article} severity={getSeverityFromCategory(article.category)} />)
                ) : (
                    <div className="text-center p-10 bg-gray-800/50 rounded-xl border border-gray-700">
                        <p className="text-gray-400">No articles found for the "{activeFilter}" filter.</p>
                    </div>
                )}
            </div>
        );
    };
    
    const filters: FilterType[] = ['Latest', 'High Risk', 'Government Alerts', 'CVE Updates'];

    return (
        <div className="space-y-6">
            <div className="threats-header-container">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-center sm:text-left">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-100">Cyber Threats Feed</h2>
                        <p className="mt-1 text-gray-400">Live updates from trusted cybersecurity sources.</p>
                    </div>
                </div>
            </div>

             <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {filters.map(filter => (
                    <button 
                        key={filter} 
                        onClick={() => setActiveFilter(filter)}
                        className={`filter-pill ${ activeFilter === filter ? 'filter-pill-active' : 'filter-pill-inactive' }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {renderContent()}
        </div>
    );
};

export default ThreatsPage;