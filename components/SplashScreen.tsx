import React from 'react';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 animate-fadeOut pointer-events-none">
    <div className="text-center">
      <svg className="mx-auto h-16 w-16 text-blue-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <h1 className="text-4xl font-extrabold text-white">Wesecure</h1>
      <p className="mt-2 text-lg text-gray-400">Securing Your Web, One Prompt at a Time.</p>
    </div>
  </div>
);

export default SplashScreen;