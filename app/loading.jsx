"use client";
import React from 'react';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-[10000]">
      {/* Ultra-thin top progress bar */}
      <div className="h-[3px] bg-black/10 w-full overflow-hidden">
        <div className="h-full bg-black w-full animate-progress-bar origin-left"></div>
      </div>
      
      <style jsx>{`
        @keyframes progress-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress-bar {
          animation: progress-bar 2s cubic-bezier(0.1, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
