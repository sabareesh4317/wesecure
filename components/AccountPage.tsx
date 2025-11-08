import React, { useState } from 'react';
import type { User } from '../types';
import { BellIcon, UserIcon, LockClosedIcon, QuestionMarkCircleIcon, ShieldCheckIcon, DocumentTextIcon, ShieldReportIcon } from './icons';

interface AccountPageProps {
  user: User;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => {
    return (
        <label className="toggle-switch">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="slider"></span>
        </label>
    );
};

const AccountPage: React.FC<AccountPageProps> = ({ user }) => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);
    
    const userInitials = user.email.substring(0, 2).toUpperCase();
    const userName = user.email.split('@')[0];

    return (
        <div className="space-y-8 max-w-3xl mx-auto animate-slide-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100">Settings</h2>
                <p className="mt-2 text-gray-400">Manage your profile and preferences.</p>
            </div>

            {/* Profile Header Card */}
            <div className="profile-header-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="profile-avatar rounded-full flex-shrink-0 flex items-center justify-center font-bold text-3xl text-white">
                    {userInitials}
                </div>
                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-white">{userName}</h3>
                    <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="flex-shrink-0 flex sm:flex-col gap-2">
                    <button className="text-sm font-semibold text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors">
                        Edit Profile
                    </button>
                    <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Change Password
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="settings-divider"></div>

            {/* Preferences Card */}
            <div className="settings-card rounded-2xl px-8 py-9">
                <h3 className="text-xl font-bold text-white mb-4">Preferences</h3>
                <ul className="divide-y divide-gray-700/50">
                    <li className="setting-row flex items-center justify-between py-6">
                        <div className="flex items-center gap-6">
                            <BellIcon className="w-6 h-6 text-blue-400" />
                            <span className="text-gray-300 setting-row-label transition-colors">Email Notifications for New Threats</span>
                        </div>
                        <ToggleSwitch checked={emailNotifications} onChange={setEmailNotifications} />
                    </li>
                    <li className="setting-row flex items-center justify-between py-6">
                        <div className="flex items-center gap-6">
                            <ShieldReportIcon className="w-6 h-6 text-green-400" />
                            <span className="text-gray-300 setting-row-label transition-colors">Weekly Security Summary</span>
                        </div>
                        <ToggleSwitch checked={weeklySummary} onChange={setWeeklySummary} />
                    </li>
                </ul>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone-card settings-card rounded-2xl p-6">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
                        <p className="mt-1 text-gray-400 text-sm">Permanently remove your Wesecure account and all of your data.</p>
                    </div>
                    <button className="btn-danger flex-shrink-0 w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900">
                        Delete Account
                    </button>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="settings-footer text-center text-sm pt-8">
                <div className="flex justify-center items-center">
                    <a href="#">
                        <QuestionMarkCircleIcon />
                        <span>Help & Support</span>
                    </a>
                    <span className="footer-divider">&bull;</span>
                    <a href="#">
                        <ShieldCheckIcon />
                        <span>Privacy Policy</span>
                    </a>
                    <span className="footer-divider">&bull;</span>
                    <a href="#">
                        <DocumentTextIcon />
                        <span>Terms</span>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default AccountPage;