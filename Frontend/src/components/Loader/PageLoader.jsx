import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoader = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 800ms loading time to show the skeleton

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) {
    return <>{children}</>;
  }

  const path = location.pathname;


  if (path === '/dashboard') {
    return (
      <div className="w-full h-full animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 h-96 bg-slate-200 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800"></div>
          <div className="col-span-12 lg:col-span-4 h-96 bg-slate-200 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800"></div>
          <div className="col-span-12 h-64 bg-slate-200 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800"></div>
        </div>
      </div>
    );
  }

  if (path.startsWith('/dashboard/')) {
    return (
      <div className="w-full h-full animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800/40 rounded-xl w-1/4 mb-6"></div>
        <div className="h-[500px] bg-slate-200 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 w-full"></div>
      </div>
    );
  }

  if (path === '/login' || path === '/signup') {
    return (
      <div className="bg-background-dark dark:bg-background-light min-h-screen flex flex-col relative overflow-hidden">
        <header className="flex items-center justify-between px-6 lg:px-20 py-6 border-b animate-pulse border-slate-200 dark:border-slate-800/50">
          <div className="w-32 h-6 bg-slate-800/50 dark:bg-slate-200/50 rounded"></div>
          <div className="w-24 h-6 bg-slate-800/50 dark:bg-slate-200/50 rounded hidden sm:block"></div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-pulse relative">
          <div className="w-full max-w-[440px] z-10 flex flex-col items-center">
            <div className="w-2/3 h-10 bg-slate-800/20 dark:bg-slate-200/50 rounded mt-4 mb-4"></div>
            <div className="w-1/2 h-4 bg-slate-800/20 dark:bg-slate-200/50 rounded mb-12"></div>

            <div className="w-full h-12 bg-slate-800/20 dark:bg-slate-200/50 rounded-lg mb-4"></div>
            <div className="w-full h-12 bg-slate-800/20 dark:bg-slate-200/50 rounded-lg mb-6"></div>
            <div className="w-48 h-4 bg-slate-800/20 dark:bg-slate-200/50 rounded mb-8 self-center"></div>

            <div className="w-full h-12 bg-slate-800/20 dark:bg-slate-200/50 rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  if (path === '/') {
    return (
      <div className="dark bg-black text-white min-h-screen w-full">
        <div className="min-h-screen pt-32 animate-pulse px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 space-y-8">
              <div className="w-3/4 h-20 bg-slate-200 dark:bg-slate-800/40 rounded-2xl"></div>
              <div className="w-2/3 h-16 bg-slate-200 dark:bg-slate-800/40 rounded-2xl"></div>
              <div className="flex gap-4">
                 <div className="w-40 h-14 bg-slate-200 dark:bg-slate-800/40 rounded-xl"></div>
                 <div className="w-40 h-14 bg-slate-200 dark:bg-slate-800/40 rounded-xl"></div>
              </div>
          </div>
          <div className="w-full lg:w-1/2 h-96 bg-slate-200 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
        </div>
      </div>
    );
  }

  if (path === '/download') {
    return (
      <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto animate-pulse">
         <div className="flex flex-col items-center mb-16 space-y-6 pt-10">
            <div className="w-2/3 md:w-1/2 h-16 bg-slate-200 dark:bg-slate-800/40 rounded-2xl"></div>
            <div className="w-1/2 md:w-1/3 h-8 bg-slate-200 dark:bg-slate-800/40 rounded-xl"></div>
         </div>
         <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
                 <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800/40 rounded-[2rem] border border-slate-200 dark:border-slate-800"></div>
             ))}
         </div>
         <div className="max-w-3xl mx-auto mt-24 h-48 bg-slate-200 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full animate-pulse p-4">
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800/50 rounded-xl w-1/3 mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 dark:bg-slate-800/40 rounded-2xl col-span-1 md:col-span-2 border border-slate-200 dark:border-slate-800"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
             <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
          ))}
        </div>
        
        <div className="h-64 bg-slate-200 dark:bg-slate-800/40 rounded-2xl w-full mt-6 border border-slate-200 dark:border-slate-800"></div>
      </div>
    </div>
  );
};

export default PageLoader;
