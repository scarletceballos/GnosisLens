"use client";

import { useState } from "react";
import Image from "next/image";

interface CharacterChatProps {
  initialMessage?: string;
}

const CharacterChat: React.FC<CharacterChatProps> = ({
  initialMessage = "Greetings, traveler. How may I assist you today?",
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="fixed bottom-0 right-0 flex flex-col items-end gap-3 z-50 pointer-events-none select-none"
      aria-live="polite"
    >
      {/* Chat Bubble */}
      {open && (
        <div className="relative max-w-xs pointer-events-auto cursor-default mr-4">
          <div className="relative bg-green-50/80 dark:bg-green-900/40 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg shadow-green-900/20 border border-green-700/30 dark:border-green-300/20">
            <p className="text-sm text-green-900 dark:text-green-100 leading-relaxed font-medium">
              {initialMessage}
            </p>
            {/* Tail pointer */}
            <div className="absolute -right-3 bottom-6 w-5 h-8">
              <svg viewBox="0 0 20 40" className="w-full h-full">
                <path
                  d="M2 2 C14 14 10 30 18 38"
                  stroke="#3f6212"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="vine-stroke"
                  pathLength={1}
                />
              </svg>
            </div>
            {/* Vine border */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
            >
              <rect
                x="2"
                y="2"
                width="96"
                height="56"
                rx="14"
                ry="14"
                fill="none"
                stroke="#4d7c0f"
                strokeWidth="3"
                pathLength={1}
                className="vine-stroke"
              />
              {/* Decorative curling vine */}
              <path
                d="M6 50 C14 42 20 58 28 48 C36 38 44 62 54 44 C64 26 70 64 84 40"
                stroke="#65a30d"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                pathLength={1}
                className="vine-stroke delay2"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Character */}
      <button
        type="button"
        aria-label="Toggle dialogue"
        onClick={() => setOpen((o) => !o)}
        className="relative pointer-events-auto focus:outline-none group"
      >
        <div className="relative w-80 h-80 animate-float drop-shadow-xl -mb-64 -mr-24">
          <Image
            src="/images/Pallas_SHADOW.png"
            alt="Pallas"
            fill
            sizes="320px"
            priority
            className="object-contain"
          />
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-green-300/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </button>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .vine-stroke {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: draw 1.6s ease forwards;
          filter: drop-shadow(0 0 2px rgba(34, 94, 25, 0.4));
        }
        .vine-stroke.delay2 {
          animation-delay: 0.35s;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CharacterChat;
