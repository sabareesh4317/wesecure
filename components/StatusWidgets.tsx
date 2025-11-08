import React from 'react';

const StatusChip: React.FC<{ icon: string; text: string; }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 bg-gray-700/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-600/50 animate-[glow-faint_3s_ease-in-out_infinite]">
        <span>{icon}</span>
        <span>{text}</span>
    </div>
);

const StatusWidgets: React.FC = () => {
    return (
        <div className="bg-gray-800/20 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    <StatusChip icon="✅" text="Protection Active" />
                    <StatusChip icon="🛡️" text="AI Firewall Enabled" />
                    <StatusChip icon="🌐" text="Real-time Site Analysis ON" />
                </div>
            </div>
        </div>
    );
};

export default StatusWidgets;