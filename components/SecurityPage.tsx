import React from 'react';

// Placeholder icons for demonstration
const ShieldCheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m4.618-3.04A11.955 11.955 0 0121 12.056a12.02 12.02 0 00-3-8.056z" />
    </svg>
);

const GlobeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293a1 1 0 010 1.414L4 9h16l-3.707-3.293a1 1 0 010-1.414zM2 12h20" />
    </svg>
);

const BellIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);


const SecurityPage: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100">Security Center</h2>
                <p className="mt-2 text-gray-400">Your hub for real-time protection and safety tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Phishing Alerts */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm text-center">
                    <BellIcon />
                    <h3 className="text-xl font-bold text-white mt-4 mb-2">Phishing Alerts</h3>
                    <p className="text-sm text-gray-400 mb-4">You have 0 new alerts. We'll notify you of suspicious links or emails.</p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">View Alerts</button>
                </div>

                {/* Dark Web Scanner */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm text-center">
                    <GlobeIcon />
                    <h3 className="text-xl font-bold text-white mt-4 mb-2">Dark Web Scanner</h3>
                    <p className="text-sm text-gray-400 mb-4">Scan for your email address in known data breaches.</p>
                    <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        Run Scan
                    </button>
                </div>
                
                {/* Safe Browsing */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm text-center">
                    <ShieldCheckIcon />
                    <h3 className="text-xl font-bold text-white mt-4 mb-2">Safe Browsing</h3>
                    <p className="text-sm text-gray-400 mb-4">Your safe browsing score is <span className="font-bold text-green-400">Excellent</span>. Keep it up!</p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">Learn More</button>
                </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">Security Recommendations</h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                        <span className="text-green-400">✅</span>
                        <p className="text-gray-300 text-sm">Use strong, unique passwords for every account.</p>
                    </li>
                    <li className="flex items-center gap-3">
                         <span className="text-green-400">✅</span>
                        <p className="text-gray-300 text-sm">Enable Two-Factor Authentication (2FA) wherever possible.</p>
                    </li>
                    <li className="flex items-center gap-3">
                         <span className="text-yellow-400">⚠️</span>
                        <p className="text-gray-300 text-sm">Review app permissions regularly on your devices.</p>
                    </li>
                    <li className="flex items-center gap-3">
                         <span className="text-green-400">✅</span>
                        <p className="text-gray-300 text-sm">Keep your software and applications updated.</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SecurityPage;