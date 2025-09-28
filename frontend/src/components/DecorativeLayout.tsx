"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DecorativeLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after a short delay
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* Main Content */}
      {children}

      {/* Animated Flowers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {/* Top-left flower - pushed further into corner */}
        <div
          className={`absolute -top-8 -left-8 w-32 h-32 transition-all duration-700 ease-out ${
            isLoaded
              ? "opacity-100 translate-x-2 translate-y-2 rotate-0"
              : "opacity-0 -translate-x-16 -translate-y-16 -rotate-45"
          }`}
        >
          <Image
            src="/images/flower.png"
            alt="Flower"
            width={128}
            height={128}
            className="object-contain animate-spin-slow"
          />
        </div>

        {/* Top-right flower - pushed further into corner */}
        <div
          className={`absolute -top-8 -right-8 w-32 h-32 transition-all duration-700 ease-out delay-200 ${
            isLoaded
              ? "opacity-100 -translate-x-2 translate-y-2 rotate-0"
              : "opacity-0 translate-x-16 -translate-y-16 rotate-45"
          }`}
        >
          <Image
            src="/images/flower.png"
            alt="Flower"
            width={128}
            height={128}
            className="object-contain animate-spin-slow-reverse"
          />
        </div>

        {/* Bottom-left flower - pushed further into corner */}
        <div
          className={`absolute -bottom-8 -left-8 w-32 h-32 transition-all duration-700 ease-out delay-300 ${
            isLoaded
              ? "opacity-100 translate-x-2 -translate-y-2 rotate-0"
              : "opacity-0 -translate-x-16 translate-y-16 rotate-45"
          }`}
        >
          <Image
            src="/images/flower.png"
            alt="Flower"
            width={128}
            height={128}
            className="object-contain animate-spin-slow-reverse"
          />
        </div>

        {/* Bottom-right flower - pushed further into corner */}
        <div
          className={`absolute -bottom-8 -right-8 w-32 h-32 transition-all duration-700 ease-out delay-400 ${
            isLoaded
              ? "opacity-100 -translate-x-2 -translate-y-2 rotate-0"
              : "opacity-0 translate-x-16 translate-y-16 -rotate-45"
          }`}
        >
          <Image
            src="/images/flower.png"
            alt="Flower"
            width={128}
            height={128}
            className="object-contain animate-spin-slow"
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 70s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DecorativeLayout;
