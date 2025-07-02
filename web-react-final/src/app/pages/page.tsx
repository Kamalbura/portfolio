'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';

interface Page {
  name: string;
  url: string;
  description: string;
  status: 'live' | 'development' | 'archived';
  lastUpdated: string;
}

export default function PagesDirectory() {
  const [siteName, setSiteName] = useState('Kamal Bura Portfolio');
  const [clickCount, setClickCount] = useState(0);
  const [showNameChanger, setShowNameChanger] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');

  // Mock deployed pages data - replace with real data
  const pages: Page[] = [
    {
      name: 'Main Portfolio',
      url: '/',
      description: 'Primary portfolio showcasing projects, skills, and experience',
      status: 'live',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'Project Showcase',
      url: '/projects',
      description: 'Detailed project galleries with live demos and source code',
      status: 'development',
      lastUpdated: '2024-01-18'
    },
    {
      name: 'Technical Blog',
      url: '/blog',
      description: 'Technical articles and coding tutorials',
      status: 'development',
      lastUpdated: '2024-01-15'
    },
    {
      name: 'Resume Generator',
      url: '/resume',
      description: 'Dynamic resume generator with multiple templates',
      status: 'archived',
      lastUpdated: '2023-12-10'
    },
    {
      name: 'Contact Form',
      url: '/contact',
      description: 'Professional contact form with email integration',
      status: 'live',
      lastUpdated: '2024-01-19'
    }
  ];

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5 && !showNameChanger) {
      setShowNameChanger(true);
      setNewSiteName(siteName);
    }
    
    // Reset count after showing the changer
    if (newCount >= 10) {
      setClickCount(0);
    }
  };

  const handleNameChange = () => {
    if (newSiteName.trim()) {
      setSiteName(newSiteName.trim());
      setShowNameChanger(false);
      setClickCount(0);
      
      // Store in localStorage for persistence
      localStorage.setItem('portfolio-site-name', newSiteName.trim());
    }
  };

  // Load saved site name on mount
  useEffect(() => {
    const savedName = localStorage.getItem('portfolio-site-name');
    if (savedName) {
      setSiteName(savedName);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'development': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'development':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'archived':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 cursor-pointer select-none"
              onClick={handleSecretClick}
              title={clickCount > 0 ? `${clickCount}/5 clicks` : ''}
            >
              {siteName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Deployed Pages Directory
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Secret Name Changer */}
          {showNameChanger && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🎉 Secret Feature Unlocked!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You've discovered the hidden site name changer! Enter a new name for this portfolio:
                </p>
                <input
                  type="text"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                  placeholder="Enter new site name..."
                  maxLength={50}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleNameChange}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Update Name
                  </button>
                  <button
                    onClick={() => {
                      setShowNameChanger(false);
                      setClickCount(0);
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-400 uppercase tracking-wide">Live Pages</h3>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300">
                {pages.filter(p => p.status === 'live').length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 uppercase tracking-wide">In Development</h3>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-300">
                {pages.filter(p => p.status === 'development').length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-400 uppercase tracking-wide">Total Pages</h3>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-300">
                {pages.length}
              </p>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {page.name}
                  </h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                    {getStatusIcon(page.status)}
                    {page.status}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {page.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    Updated: {new Date(page.lastUpdated).toLocaleDateString()}
                  </span>
                  
                  {page.status === 'live' && (
                    <a
                      href={page.url}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                    >
                      Visit
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              This directory showcases all deployed pages and projects. 
              <br className="hidden sm:block" />
              Built with Next.js, TypeScript, and TailwindCSS.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
