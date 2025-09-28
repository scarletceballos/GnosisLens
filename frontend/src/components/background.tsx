"use client";

// components/AnimatedBackground.tsx
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Main animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-300 via-green-200 to-lime-200 animate-pulse"></div>
      
      {/* Floating gradient orbs for more dynamic animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-green-400/30 to-transparent rounded-full animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-radial from-lime-300/40 to-transparent rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-green-300/25 to-transparent rounded-full animate-float-fast"></div>
      </div>
      
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -30px) rotate(90deg); }
          50% { transform: translate(-20px, -60px) rotate(180deg); }
          75% { transform: translate(-50px, -30px) rotate(270deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-40px, 40px) rotate(120deg); }
          66% { transform: translate(40px, -20px) rotate(240deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          20% { transform: translate(-60%, -40%) rotate(72deg); }
          40% { transform: translate(-40%, -60%) rotate(144deg); }
          60% { transform: translate(-40%, -40%) rotate(216deg); }
          80% { transform: translate(-60%, -60%) rotate(288deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 12s ease-in-out infinite reverse;
        }
        
        .animate-float-fast {
          animation: float-fast 8s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;