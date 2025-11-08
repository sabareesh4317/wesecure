import React from 'react';
import { HomeIcon, ScanIcon, NewspaperIcon, AccountIcon, BookOpenIcon } from './icons';
import type { CurrentPage } from '../types';

interface FooterProps {
  currentPage: CurrentPage;
  onNavigate: (page: CurrentPage) => void;
}

const FooterButton: React.FC<{
  page: CurrentPage;
  currentPage: CurrentPage;
  onNavigate: (page: CurrentPage) => void;
  Icon: React.FC<{ className?: string }>;
  label: string;
}> = ({ page, currentPage, onNavigate, Icon, label }) => {
  const isActive = currentPage === page || (currentPage === 'results' && page === 'dashboard');
  
  return (
    <button
      onClick={() => onNavigate(page)}
      className="flex flex-col items-center justify-center w-1/5 h-full transition-colors duration-200 ease-in-out focus:outline-none group pt-1"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className={`h-6 w-6 transition-all duration-300 ${
        isActive
          ? 'text-blue-400 scale-110 footer-icon-active-glow'
          : 'text-gray-400 opacity-40 group-hover:opacity-100'
      }`} />
      <span className={`text-xs mt-1 transition-colors duration-200 ${
        isActive
          ? 'text-blue-400 font-semibold'
          : 'text-gray-500 group-hover:text-gray-300'
      }`}>
        {label}
      </span>
    </button>
  );
};

const Footer: React.FC<FooterProps> = ({ currentPage, onNavigate }) => {
  return (
    <footer className="premium-footer fixed bottom-0 left-0 right-0 h-[72px] z-30 md:hidden">
      <nav className="h-full flex justify-around items-start">
        <FooterButton page="scan" currentPage={currentPage} onNavigate={onNavigate} Icon={ScanIcon} label="Scan" />
        <FooterButton page="learn" currentPage={currentPage} onNavigate={onNavigate} Icon={BookOpenIcon} label="Learn" />
        <FooterButton page="dashboard" currentPage={currentPage} onNavigate={onNavigate} Icon={HomeIcon} label="Home" />
        <FooterButton page="threats" currentPage={currentPage} onNavigate={onNavigate} Icon={NewspaperIcon} label="Threats" />
        <FooterButton page="account" currentPage={currentPage} onNavigate={onNavigate} Icon={AccountIcon} label="Account" />
      </nav>
    </footer>
  );
};

export default Footer;