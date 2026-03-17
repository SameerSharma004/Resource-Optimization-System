import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const PageLoader = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, [location.pathname]);
  return (
    <div className="relative min-h-screen">
      <div className={`${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {children}
      </div>
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center transition-all duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="size-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(255,59,59,0.6)]"></div>
                <div className="absolute inset-0 size-3 bg-primary rounded-full animate-ping opacity-40"></div>
              </div>
              <span className="font-black text-xl tracking-tighter text-white uppercase">
                AI <span className="text-primary italic font-serif font-normal lowercase">Optimizer</span>
              </span>
            </div>
            <div className="w-24 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
               <div className="absolute inset-0 bg-primary w-full -translate-x-full animate-[simpleLine_0.8s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes simpleLine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
export default PageLoader;
