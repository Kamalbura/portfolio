'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  // Load the site name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('portfolio-site-name');
    if (savedName) {
      setSiteName(savedName);
    }
  }, []);

  // Deployed pages data
  const pages: Page[] = [
    {
      name: 'Main Portfolio',
      url: '/',
      description: 'Primary portfolio showcasing projects, skills, and experience',
      status: 'live',
      lastUpdated: '2025-07-02'
    },
    {
      name: 'DSA Academy',
      url: 'https://dsa.burakamal.site',
      description: 'Data Structures and Algorithms learning platform with tutorials and practice problems',
      status: 'live',
      lastUpdated: '2025-06-25'
    },
    {
      name: 'Skilllance',
      url: 'https://skilllance.burakamal.site',
      description: 'Freelance skills marketplace connecting professionals with clients',
      status: 'live',
      lastUpdated: '2025-06-20'
    },
    {
      name: 'Freelance Platform',
      url: 'https://freelance.burakamal.site',
      description: 'Platform for finding and managing freelance opportunities',
      status: 'live',
      lastUpdated: '2025-06-15'
    },
    {
      name: 'Acumen',
      url: 'https://acumen.burakamal.site',
      description: 'A website for college events and activities, providing information and updates',
      status: 'live',
      lastUpdated: '2025-06-10'
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">      
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4 cursor-pointer"
            onClick={handleSecretClick}
          >
            {siteName}
          </h1>
          <div className="w-20 h-px bg-gray-900 dark:bg-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of web applications, projects, and platforms developed by Kamal Bura
          </p>
          
          {/* Secret name changer that appears after 5 clicks */}
          {showNameChanger && (
            <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg max-w-md mx-auto shadow-sm">
              <input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new site name"
              />
              <button
                onClick={handleNameChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Site Name
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div 
              key={page.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {page.name}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    page.status === 'live' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : page.status === 'development'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-5 h-12 line-clamp-2">
                  {page.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <a
                    href={page.url}
                    target={page.url.startsWith('http') ? '_blank' : '_self'}
                    rel={page.url.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center"
                  >
                    Visit
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Updated: {page.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </main>
      
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Kamal Bura. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
