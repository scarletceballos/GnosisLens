"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import TextInput from "./TextInput";
import { motion, AnimatePresence } from "../components/motion-polyfill";

// Optional import for auto-animate - use a ref if not available
let useAutoAnimate = () => [null];
try {
  const formkitAutoAnimate = require('@formkit/auto-animate/react');
  useAutoAnimate = formkitAutoAnimate.useAutoAnimate;
} catch (e) {
  console.warn('Auto-animate not available, animations will be basic');
}

interface Message {
  sender: "user" | "character";
  text: string;
  id: string;
}

const ConversationalUI = () => {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        sender: "character",
        text: "I am Athena, Goddess of Wisdom. What guidance do you seek from Olympus?",
        id: "initial-msg"
      },
    ]
  );
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || typing) return;
    
    // Add user message
    const userMessage: Message = { 
      sender: "user", 
      text: inputText,
      id: `user-${Date.now()}`
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    // Show typing indicator
    setTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add response
    const characterResponse: Message = {
      sender: "character",
      text: "The wisdom of the gods flows through me. Let me contemplate your inquiry...",
      id: `char-${Date.now()}`
    };
    setMessages(prev => [...prev, characterResponse]);
    setTyping(false);
  };

  const messageGroups = useMemo(() => {
    return messages.reduce((groups: any[], message, i) => {
      // Create a new group if sender changes or it's the first message
      if (i === 0 || messages[i-1].sender !== message.sender) {
        groups.push({
          sender: message.sender,
          messages: [message],
          id: `group-${message.id}`
        });
      } else {
        // Add to the last group
        groups[groups.length - 1].messages.push(message);
      }
      return groups;
    }, []);
  }, [messages]);

  return (
    <div className="w-full max-h-[70vh] flex items-stretch relative">
      <div className="grid grid-cols-1 md:grid-cols-[1fwhr_0.8fr] gap-4 w-full z-10 p-4">
        {/* Chat Area - Made more opaque and changed to green theme */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-[60vh] bg-[#1a1c2d]/85 dark:bg-[#1a1c2d]/90 backdrop-blur-lg rounded-2xl p-4 border border-emerald-500/30 relative overflow-hidden shadow-xl"
        >
          {/* Background texture overlay - reduced opacity */}
          <div className="absolute inset-0 opacity-5 bg-[url('/images/marble-texture.png')] bg-repeat"></div>
          
          {/* Golden laurel wreath top decoration - changed to green */}
          <div className="absolute top-0 left-0 w-full h-24 pointer-events-none overflow-hidden">
            <svg
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32"
              viewBox="0 0 400 100"
            >
              <path
                d="M200 20 Q180 10 160 20 Q140 30 120 25 Q100 20 80 30 M200 20 Q220 10 240 20 Q260 30 280 25 Q300 20 320 30"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                className="laurel-path"
              />
              <g className="laurel-leaves">
                {Array.from({ length: 10 }).map((_, i) => (
                  <g
                    key={`left-${i}`}
                    transform={`translate(${
                      160 - i * 8
                    }, ${20 + Math.sin(i * 0.5) * 5})`}
                  >
                    <path
                      d={`M0 0 Q-15 5 -10 15 Q-5 25 0 20 Q5 25 10 15 Q15 5 0 0`}
                      fill="#10b981"
                      opacity="0.8"
                      className="leaf"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    />
                  </g>
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <g
                    key={`right-${i}`}
                    transform={`translate(${
                      240 + i * 8
                    }, ${20 + Math.sin(i * 0.5) * 5})`}
                  >
                    <path
                      d={`M0 0 Q15 5 10 15 Q5 25 0 20 Q-5 25 -10 15 Q-15 5 0 0`}
                      fill="#10b981"
                      opacity="0.8"
                      className="leaf"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    />
                  </g>
                ))}
              </g>
              {/* Circular medallion in the center - changed to green */}
              <circle cx="200" cy="20" r="15" fill="#10b981" className="medallion" />
              <circle
                cx="200"
                cy="20"
                r="12"
                fill="#1a1c2d"
                stroke="#10b981"
                strokeWidth="1"
              />
              <path
                d="M200 12 L203 18 L210 18 L204 22 L206 28 L200 24 L194 28 L196 22 L190 18 L197 18 Z"
                fill="#10b981"
              />
            </svg>
          </div>

          {/* Chat header - changed to green */}
          <div className="relative pt-10 pb-3 mb-3 border-b border-emerald-500/30 text-center">
            <h3 className="text-xl font-medium text-emerald-200">
              <span className="tracking-wider">ORACLE OF WISDOM</span>
            </h3>
            <div className="absolute bottom-0 left-0 w-full h-4 overflow-hidden opacity-80">
              <svg
                className="w-full h-full"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 H10 V0 H20 V10 H30 V0 H40 V10 H50 V0 H60 V10 H70 V0 H80 V10 H90 V0 H100 V10 H110 V0 H120 V10 H130 V0 H140 V10 H150 V0 H160 V10 H170 V0 H180 V10 H190 V0 H200"
                  stroke="#10b981"
                  strokeWidth="1"
                  fill="none"
                  className="greek-key-pattern"
                />
              </svg>
            </div>
          </div>

          {/* Message area */}
          <div className="flex-grow overflow-y-auto pr-2 space-y-6 scrollbar-thin" ref={parent}>
            {messageGroups.map((group) => (
              <div
                key={group.id}
                className={`flex items-end gap-2 ${
                  group.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar for character messages - UPDATED with larger size */}
                {group.sender === "character" && (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-emerald-400/50 bg-emerald-900/40 flex items-center justify-center">
                    <Image
                      src="/images/athena_profile.png"
                      alt="Athena"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                )}
                
                <div className="flex flex-col gap-1.5 max-w-[85%]">
                  {group.messages.map((message: Message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative rounded-xl px-4 py-3 ${
                        message.sender === "user"
                          ? "ml-auto"
                          : ""
                      }`}
                    >
                      <p className={`text-base leading-relaxed relative z-10 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-emerald-100"
                      }`}>
                        {message.text}
                      </p>

                      {/* Animated border - changed to green for oracle */}
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
                          rx="10"
                          ry="10"
                          fill="none"
                          stroke={message.sender === "user" ? "#3b82f6" : "#10b981"}
                          strokeWidth="1.5"
                          className="msg-border"
                        />

                        {/* Greek key pattern based on sender */}
                        {message.sender === "user" ? (
                          <path
                            d="M20 50 H30 V46 H26 V42 H30 V38 H26 V34 H30 V30 H20 M70 10 H80 V14 H84 V18 H80 V22 H84 V26 H80 V30 H70"
                            stroke="#3b82f6"
                            strokeWidth="1"
                            fill="none"
                            className="msg-pattern"
                          />
                        ) : (
                          <path
                            d="M20 10 H30 V14 H34 V18 H30 V22 H34 V26 H30 V30 H20 M70 50 H80 V46 H76 V42 H80 V38 H76 V34 H80 V30 H70"
                            stroke="#10b981"
                            strokeWidth="1"
                            fill="none"
                            className="msg-pattern"
                          />
                        )}
                      </svg>
                    </motion.div>
                  ))}
                </div>
                
                {/* Avatar for user messages */}
                {group.sender === "user" && (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-blue-400/50 bg-blue-700/40">
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      Y
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator - UPDATED with larger size */}
            <AnimatePresence>
              {typing && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-emerald-400/50 bg-emerald-900/40 flex items-center justify-center">
                    <Image
                      src="/images/athena_profile.png"
                      alt="Athena"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="rounded-xl rounded-tl-none px-4 py-2.5">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
            
            <div ref={chatEndRef} />
          </div>

          {/* Input area - Simplified to matte black */}
          <div className="mt-4 flex gap-2 relative">
            <div className="relative w-full">
              <TextInput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask the Oracle of Wisdom..."
                disabled={typing}
              />
              {/* Removed decorative SVG overlay on textbox */}
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={typing || !inputText.trim()}
              className={`rounded-lg ${
                typing || !inputText.trim() 
                  ? "bg-emerald-700/40 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95"
              } px-4 py-2 text-white font-medium transition-all whitespace-nowrap relative`}
            >
              <span>Send</span>
            </button>
          </div>

          {/* Greek columns at the bottom corners - changed to green */}
          <div className="absolute bottom-1 left-2 w-12 h-24 opacity-20 pointer-events-none">
            <svg viewBox="0 0 40 100" className="w-full h-full">
              <rect x="10" y="10" width="20" height="70" fill="#10b981" />
              <rect x="5" y="5" width="30" height="5" fill="#10b981" />
              <rect x="5" y="80" width="30" height="15" fill="#10b981" />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect key={i} x="10" y={15 + i * 10} width="20" height="1" fill="#1a1c2d" />
              ))}
            </svg>
          </div>
          <div className="absolute bottom-1 right-2 w-12 h-24 opacity-20 pointer-events-none">
            <svg viewBox="0 0 40 100" className="w-full h-full">
              <rect x="10" y="10" width="20" height="70" fill="#10b981" />
              <rect x="5" y="5" width="30" height="5" fill="#10b981" />
              <rect x="5" y="80" width="30" height="15" fill="#10b981" />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect key={i} x="10" y={15 + i * 10} width="20" height="1" fill="#1a1c2d" />
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Character Area */}
        <div className="hidden md:block relative h-[60vh] overflow-visible">
          <div className="absolute inset-0 flex items-end justify-end transition-all duration-700 opacity-100">
            <div className="relative w-[130%] h-[130%] -mb-12 -mr-16 animate-float-slow">
              <Image
                src="/images/Pallas_SHADOW.png"
                alt="Pallas"
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 70vw"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) translateX(5px) scale(1.01);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .laurel-path {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: drawPath 2s ease-out forwards;
        }

        .leaf {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }

        .medallion {
          transform-origin: center;
          animation: glow 3s ease-in-out infinite;
        }

        .greek-key-pattern {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawPath 3s ease-out forwards;
        }

        .msg-border {
          stroke-dasharray: 300;
          stroke-dashoffset: 0;
          filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.3));
        }

        .msg-pattern {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawPath 1s ease-out forwards;
        }

        .input-border {
          stroke-dasharray: 800;
          stroke-dashoffset: 0;
        }

        .input-pattern {
          stroke-dasharray: 100;
          stroke-dashoffset: 0;
        }

        .btn-border {
          stroke-dasharray: 300;
          stroke-dashoffset: 0;
        }

        .btn-circle {
          transform-origin: center;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 0.8;
          }
        }

        @keyframes glow {
          0%,
          100% {
            filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.7));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.9));
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        /* Custom scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ConversationalUI;
