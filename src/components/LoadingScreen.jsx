import React from 'react';

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <svg
          width="600"
          height="120"
          viewBox="0 0 600 120"
          className="w-[90vw] h-auto"
        >
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="logo-path"
          >
            ashishdev.com
          </text>
        </svg>

        <div className="mt-8 w-48 h-[2px] bg-white/5 mx-auto relative overflow-hidden">
          <div className="loader-progress absolute inset-0 bg-[#64ffda]"></div>
        </div>

        <p className="mt-6 text-xs tracking-[0.45em] text-white/40 uppercase">
          {message}
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
