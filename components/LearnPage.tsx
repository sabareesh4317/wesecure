import React from 'react';
import { LockClosedIcon, SparklesIcon } from './icons';

interface LearnPageProps {
    onStartLesson: (title: string) => void;
}

interface LearnCardProps {
    title: string;
    description: string;
    isPremium?: boolean;
    onStart: () => void;
}

const LearnCard: React.FC<LearnCardProps> = ({ title, description, isPremium = false, onStart }) => {
    return (
        <div className={`learn-card ${isPremium ? 'learn-card-premium' : ''}`}>
            {isPremium && (
                <>
                    <div className="premium-badge">PREMIUM</div>
                    <div className="lock-overlay">
                        <LockClosedIcon className="w-8 h-8 text-white/50" />
                    </div>
                </>
            )}
            <div>
                <h3 className="text-lg font-bold text-gray-200">{title}</h3>
                <p className="mt-2 text-sm text-gray-400">{description}</p>
            </div>
            <button
                onClick={onStart}
                disabled={isPremium}
                className="mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                {isPremium ? 'Upgrade to Access' : 'Start Learning →'}
            </button>
        </div>
    );
};

const UpgradeCard: React.FC = () => (
    <div className="upgrade-cta-card">
        <SparklesIcon className="w-8 h-8 text-yellow-300" />
        <div>
            <h3 className="text-xl font-bold text-white">Unlock Your Full Potential</h3>
            <p className="mt-1 text-gray-400 text-sm">Access advanced training, attack simulations, and expert guides with a Premium subscription.</p>
        </div>
        <button className="upgrade-cta-button">
            Upgrade to Premium
        </button>
    </div>
)

const LearnPage: React.FC<LearnPageProps> = ({ onStartLesson }) => {
    const freeModules = [
        { title: "What is Phishing?", description: "Learn to identify and avoid deceptive emails and websites." },
        { title: "Understanding Malware", description: "An introduction to viruses, trojans, and ransomware." },
        { title: "Safe Browsing Practices", description: "Essential tips to navigate the web securely and protect your data." },
        { title: "Password Security Fundamentals", description: "Best practices for creating and managing strong, unique passwords." },
        { title: "Basics of Network Security", description: "Understand the fundamentals of firewalls, VPNs, and secure Wi-Fi." },
    ];

    const premiumModules = [
        { title: "Advanced Penetration Testing", description: "Deep-dive into ethical hacking techniques and methodologies." },
        { title: "Live Attack Simulations", description: "Participate in real-world scenarios to test your defense skills." },
        { title: "Reverse Engineering Malware", description: "Deconstruct malicious software to understand its behavior." },
        { title: "Digital Forensics & Incident Response", description: "Learn to investigate breaches and manage security incidents effectively." },
        { title: "Red Team Attack Scenarios", description: "Simulate advanced persistent threats to test organizational security." },
    ];

    return (
        <div className="space-y-12 animate-slide-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100">Learning & Training Center</h2>
                <p className="mt-2 text-gray-400">Sharpen your cybersecurity skills with our expert-curated modules.</p>
            </div>

            {/* Free Content Section */}
            <div>
                <h3 className="text-2xl font-bold text-gray-200 mb-6">Foundations of Cybersecurity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {freeModules.map(module => <LearnCard key={module.title} {...module} onStart={() => onStartLesson(module.title)} />)}
                </div>
            </div>

             {/* Premium Content Section */}
            <div>
                 <h3 className="text-2xl font-bold text-gray-200 mb-6">Expert Learning Paths</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <UpgradeCard />
                    {premiumModules.map(module => <LearnCard key={module.title} {...module} isPremium onStart={() => {}} />)}
                </div>
            </div>
        </div>
    );
};

export default LearnPage;