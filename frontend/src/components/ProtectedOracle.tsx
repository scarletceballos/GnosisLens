"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import TextInput from "./TextInput";
import { motion, AnimatePresence } from "../components/motion-polyfill";
import TypewriterMessage from "./TypewriterMessage";
import { useAuth } from "./AuthContext";

// Optional import for auto-animate - use a ref if not available
let useAutoAnimate: () => [any, (el?: any) => void] = () => [null, () => {}];

// Client-only dynamic import to set up auto-animate if it's available.
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const mod = await import('@formkit/auto-animate/react');
      if (mod?.useAutoAnimate) {
        useAutoAnimate = mod.useAutoAnimate;
      }
    } catch (e) {
      console.warn('Auto-animate not available, animations will be basic');
    }
  })();
}

interface Message {
  sender: "user" | "character";
  text: string;
  id: string;
  isTyping?: boolean;
  goddess?: string; // Store the original goddess for the message
}

const ProtectedOracle = () => {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        sender: "character",
        text: "Welcome to GnosisLens! I am the Oracle of Wisdom, powered by the ancient goddesses. Share your travel purchase details and I will analyze them for fairness using the wisdom of Dike (fair deals), Apate (scam detection), and Nemesis (righteous justice). What purchase would you like me to examine?",
        id: "initial-msg",
        goddess: "ATHENA"
      },
    ]
  );
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const [country, setCountry] = useState("Egypt");
  const [currency, setCurrency] = useState("USD");
  const [currentGoddess, setCurrentGoddess] = useState("ATHENA"); // Default goddess (owl girl)
  const [scamScore, setScamScore] = useState<number | null>(null); // Store scam score
  const [advice, setAdvice] = useState<string | null>(null); // Store advice data
  const [showInfoBox, setShowInfoBox] = useState(false); // Control info box visibility
  const [parent] = useAutoAnimate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Function to get goddess image based on current goddess
  const getGoddessImage = (goddess: string) => {
    switch (goddess) {
      case 'DIKE':
        return '/images/DIKE_SHADOW.png';
      case 'APATE':
        return '/images/APATE_SHADOW.png';
      case 'NEMESIS':
        return '/images/NEMESIS_SHADOW.png';
      case 'ATHENA':
        return '/images/Pallas_SHADOW.png'; // Owl girl with shadow
      case 'THEMIS':
        return '/images/Pallas_SHADOW.png'; // Using Athena as fallback
      case 'METIS':
        return '/images/Pallas_SHADOW.png'; // Using Athena as fallback
      case 'TYCHE':
        return '/images/Pallas_SHADOW.png'; // Using Athena as fallback
      default:
        return '/images/Pallas_SHADOW.png';
    }
  };

  // Function to get goddess profile image for chat
  const getGoddessProfileImage = (goddess: string) => {
    // Always use the specific goddess for the message, never fall back to currentGoddess
    switch (goddess) {
      case 'DIKE':
        return '/images/pfpDIKE.png'; // Face-focused image for chat
      case 'APATE':
        return '/images/pfpAPATE.png'; // Face-focused image for chat
      case 'NEMESIS':
        return '/images/pfpnem.png'; // Face-focused image for chat
      case 'ATHENA':
        return '/images/athena_profile.png';
      case 'THEMIS':
        return '/images/athena_profile.png';
      case 'METIS':
        return '/images/athena_profile.png';
      case 'TYCHE':
        return '/images/athena_profile.png';
      default:
        return '/images/athena_profile.png';
    }
  };

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
    const currentInput = inputText;
    setInputText("");
    
    // Show typing indicator
    setTyping(true);
    
    try {
      // Debug: Log the values being sent
      console.log('Sending to backend:', {
        text: currentInput,
        country: country,
        currency: currency,
        location: {
          city: country,
          country: country
        }
      });

      // Call the backend API
      const response = await fetch('http://localhost:8000/api/scam-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: currentInput,
          country: country,
          currency: currency,
          location: {
            city: country,
            country: country
          }
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Show only the goddess response
        const analysis = data.data;
        
        // Change avatar immediately to the selected goddess
        setCurrentGoddess(analysis.goddess);
        
        // Store the scam score and advice
        setScamScore(analysis.scamScore);
        setAdvice(analysis.advice);
        
        // Show info box with scam score
        setShowInfoBox(true);
        
        const characterResponse: Message = {
          sender: "character",
          text: analysis.goddessResponse,
          id: `char-${Date.now()}`,
          isTyping: true,
          goddess: analysis.goddess // Store the original goddess for this message
        };
        setMessages(prev => [...prev, characterResponse]);
        
        // Switch back to Athena after 12 seconds for advice (give goddess more time to finish)
        setTimeout(() => {
          setCurrentGoddess("ATHENA");
        }, 12000);
      } else {
        const errorResponse: Message = {
          sender: "character",
          text: "I apologize, but I encountered an error while analyzing your request. Please try again.",
          id: `char-${Date.now()}`,
          isTyping: true,
          goddess: "ATHENA" // Default to Athena for error messages
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error('API call failed:', error);
      const errorResponse: Message = {
        sender: "character",
        text: "I apologize, but I'm unable to connect to the wisdom of the gods at this moment. Please try again later.",
        id: `char-${Date.now()}`,
        isTyping: true,
        goddess: "ATHENA" // Default to Athena for error messages
      };
      setMessages(prev => [...prev, errorResponse]);
    }
    
    setTyping(false);
  };

  // Handle typewriter completion for a specific message
  const handleTypewriterComplete = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
  };

  const messageGroups = useMemo(() => {
    return messages.reduce((groups: any[], message, i) => {
      if (i === 0 || messages[i-1].sender !== message.sender) {
        groups.push({
          sender: message.sender,
          messages: [message],
          id: `group-${message.id}`
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
      return groups;
    }, []);
  }, [messages]);

  return (
    <div className="w-full max-h-[90vh] flex items-stretch relative">
      <div className="grid grid-cols-1 md:grid-cols-[2.4fr_0.6fr] gap-4 w-full z-10 p-4">
        {/* Chat Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-[80vh] bg-[#1a1c2d]/85 dark:bg-[#1a1c2d]/90 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden shadow-xl"
        >
          {/* Background texture overlay */}
          <div className="absolute inset-0 opacity-5 bg-[url('/images/marble-texture.png')] bg-repeat"></div>
          
          {/* Golden laurel wreath top decoration */}
          <div className="absolute top-0 left-0 w-full h-16 pointer-events-none overflow-hidden">
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

          {/* Chat header */}
          <div className="relative pt-6 pb-2 mb-2 border-b border-emerald-500/30 text-center">
            <div className="absolute bottom-0 left-0 w-full h-3 overflow-hidden opacity-80">
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
          <div className="flex-grow overflow-y-auto pr-3 space-y-8 scrollbar-thin" ref={parent}>
            {messageGroups.map((group) => (
              <div
                key={group.id}
                className={`flex items-end gap-2 ${
                  group.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar for character messages */}
                {group.sender === "character" && (
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-emerald-400/50 bg-emerald-900/40 flex items-center justify-center">
                    <Image
                      src={getGoddessProfileImage(group.messages[0]?.goddess || "ATHENA")}
                      alt={group.messages[0]?.goddess || "ATHENA"}
                      width={64}
                      height={64}
                      className="object-cover object-center"
                    />
                  </div>
                )}
                
                <div className="flex flex-col gap-2 max-w-[85%]">
                  {group.messages.map((message: Message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative rounded-xl px-5 py-4 ${
                        message.sender === "user"
                          ? "ml-auto"
                          : ""
                      }`}
                    >
                      <p className={`text-lg leading-relaxed relative z-10 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-emerald-100"
                      }`}>
                        {message.sender === "character" && message.isTyping ? (
                          <TypewriterMessage 
                            text={message.text} 
                            onComplete={() => handleTypewriterComplete(message.id)}
                          />
                        ) : (
                          message.text
                        )}
                      </p>

                      {/* Animated border */}
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
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-blue-400/50 bg-blue-700/40">
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            <AnimatePresence>
              {typing && (
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-emerald-400/50 bg-emerald-900/40 flex items-center justify-center">
                    <Image
                      src={getGoddessProfileImage(currentGoddess)}
                      alt={currentGoddess}
                      width={64}
                      height={64}
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="rounded-xl rounded-tl-none px-5 py-3">
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

          {/* Input area with dropdowns */}
          <div className="mt-6 space-y-4">
            {/* Current selection display */}
            <div className="text-sm text-emerald-300/70 text-center">
              Selected: {country} | {currency}
            </div>
            
            {/* Country and Currency dropdowns */}
            <div className="flex gap-2 relative z-10">
              <select
                value={country}
                onChange={(e) => {
                  console.log('Country changed to:', e.target.value);
                  setCountry(e.target.value);
                }}
                className="flex-1 px-4 py-3 bg-[#2a2d3a]/50 border border-emerald-500/30 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer relative z-10"
                style={{ zIndex: 10 }}
              >
                <option value="Egypt">🇪🇬 Egypt</option>
                <option value="France">🇫🇷 France</option>
                <option value="Spain">🇪🇸 Spain</option>
                <option value="Italy">🇮🇹 Italy</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="India">🇮🇳 India</option>
                <option value="Thailand">🇹🇭 Thailand</option>
                <option value="Japan">🇯🇵 Japan</option>
                <option value="China">🇨🇳 China</option>
                <option value="Mexico">🇲🇽 Mexico</option>
                <option value="Brazil">🇧🇷 Brazil</option>
                <option value="Turkey">🇹🇷 Turkey</option>
                <option value="Morocco">🇲🇦 Morocco</option>
                <option value="Vietnam">🇻🇳 Vietnam</option>
                <option value="Peru">🇵🇪 Peru</option>
                <option value="Greece">🇬🇷 Greece</option>
                <option value="Portugal">🇵🇹 Portugal</option>
                <option value="Netherlands">🇳🇱 Netherlands</option>
                <option value="Belgium">🇧🇪 Belgium</option>
                <option value="Austria">🇦🇹 Austria</option>
                <option value="Switzerland">🇨🇭 Switzerland</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="South Korea">🇰🇷 South Korea</option>
                <option value="Singapore">🇸🇬 Singapore</option>
                <option value="Malaysia">🇲🇾 Malaysia</option>
                <option value="Indonesia">🇮🇩 Indonesia</option>
                <option value="Philippines">🇵🇭 Philippines</option>
                <option value="South Africa">🇿🇦 South Africa</option>
                <option value="Kenya">🇰🇪 Kenya</option>
                <option value="Argentina">🇦🇷 Argentina</option>
                <option value="Chile">🇨🇱 Chile</option>
                <option value="Colombia">🇨🇴 Colombia</option>
                <option value="Russia">🇷🇺 Russia</option>
                <option value="Poland">🇵🇱 Poland</option>
                <option value="Czech Republic">🇨🇿 Czech Republic</option>
                <option value="Hungary">🇭🇺 Hungary</option>
                <option value="Romania">🇷🇴 Romania</option>
                <option value="Bulgaria">🇧🇬 Bulgaria</option>
                <option value="Croatia">🇭🇷 Croatia</option>
                <option value="Slovenia">🇸🇮 Slovenia</option>
                <option value="Slovakia">🇸🇰 Slovakia</option>
                <option value="Estonia">🇪🇪 Estonia</option>
                <option value="Latvia">🇱🇻 Latvia</option>
                <option value="Lithuania">🇱🇹 Lithuania</option>
                <option value="Finland">🇫🇮 Finland</option>
                <option value="Sweden">🇸🇪 Sweden</option>
                <option value="Norway">🇳🇴 Norway</option>
                <option value="Denmark">🇩🇰 Denmark</option>
                <option value="Iceland">🇮🇸 Iceland</option>
                <option value="Ireland">🇮🇪 Ireland</option>
                <option value="New Zealand">🇳🇿 New Zealand</option>
                <option value="Israel">🇮🇱 Israel</option>
                <option value="United Arab Emirates">🇦🇪 UAE</option>
                <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                <option value="Qatar">🇶🇦 Qatar</option>
                <option value="Kuwait">🇰🇼 Kuwait</option>
                <option value="Bahrain">🇧🇭 Bahrain</option>
                <option value="Oman">🇴🇲 Oman</option>
                <option value="Jordan">🇯🇴 Jordan</option>
                <option value="Lebanon">🇱🇧 Lebanon</option>
                <option value="Cyprus">🇨🇾 Cyprus</option>
                <option value="Malta">🇲🇹 Malta</option>
                <option value="Luxembourg">🇱🇺 Luxembourg</option>
                <option value="Monaco">🇲🇨 Monaco</option>
                <option value="Liechtenstein">🇱🇮 Liechtenstein</option>
                <option value="Andorra">🇦🇩 Andorra</option>
                <option value="San Marino">🇸🇲 San Marino</option>
                <option value="Vatican City">🇻🇦 Vatican City</option>
              </select>
              
              <select
                value={currency}
                onChange={(e) => {
                  console.log('Currency changed to:', e.target.value);
                  setCurrency(e.target.value);
                }}
                className="flex-1 px-4 py-3 bg-[#2a2d3a]/50 border border-emerald-500/30 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer relative z-10"
                style={{ zIndex: 10 }}
              >
                <option value="USD">💵 USD (US Dollar)</option>
                <option value="EUR">💶 EUR (Euro)</option>
                <option value="GBP">💷 GBP (British Pound)</option>
                <option value="JPY">💴 JPY (Japanese Yen)</option>
                <option value="CNY">💰 CNY (Chinese Yuan)</option>
                <option value="EGP">🇪🇬 EGP (Egyptian Pound)</option>
                <option value="INR">🇮🇳 INR (Indian Rupee)</option>
                <option value="THB">🇹🇭 THB (Thai Baht)</option>
                <option value="MXN">🇲🇽 MXN (Mexican Peso)</option>
                <option value="BRL">🇧🇷 BRL (Brazilian Real)</option>
                <option value="TRY">🇹🇷 TRY (Turkish Lira)</option>
                <option value="MAD">🇲🇦 MAD (Moroccan Dirham)</option>
                <option value="VND">🇻🇳 VND (Vietnamese Dong)</option>
                <option value="PEN">🇵🇪 PEN (Peruvian Sol)</option>
                <option value="CHF">🇨🇭 CHF (Swiss Franc)</option>
                <option value="AUD">🇦🇺 AUD (Australian Dollar)</option>
                <option value="CAD">🇨🇦 CAD (Canadian Dollar)</option>
                <option value="KRW">🇰🇷 KRW (South Korean Won)</option>
                <option value="SGD">🇸🇬 SGD (Singapore Dollar)</option>
                <option value="MYR">🇲🇾 MYR (Malaysian Ringgit)</option>
                <option value="IDR">🇮🇩 IDR (Indonesian Rupiah)</option>
                <option value="PHP">🇵🇭 PHP (Philippine Peso)</option>
                <option value="ZAR">🇿🇦 ZAR (South African Rand)</option>
                <option value="KES">🇰🇪 KES (Kenyan Shilling)</option>
                <option value="ARS">🇦🇷 ARS (Argentine Peso)</option>
                <option value="CLP">🇨🇱 CLP (Chilean Peso)</option>
                <option value="COP">🇨🇴 COP (Colombian Peso)</option>
                <option value="RUB">🇷🇺 RUB (Russian Ruble)</option>
                <option value="PLN">🇵🇱 PLN (Polish Zloty)</option>
                <option value="CZK">🇨🇿 CZK (Czech Koruna)</option>
                <option value="HUF">🇭🇺 HUF (Hungarian Forint)</option>
                <option value="RON">🇷🇴 RON (Romanian Leu)</option>
                <option value="BGN">🇧🇬 BGN (Bulgarian Lev)</option>
                <option value="HRK">🇭🇷 HRK (Croatian Kuna)</option>
                <option value="SEK">🇸🇪 SEK (Swedish Krona)</option>
                <option value="NOK">🇳🇴 NOK (Norwegian Krone)</option>
                <option value="DKK">🇩🇰 DKK (Danish Krone)</option>
                <option value="ISK">🇮🇸 ISK (Icelandic Krona)</option>
                <option value="NZD">🇳🇿 NZD (New Zealand Dollar)</option>
                <option value="ILS">🇮🇱 ILS (Israeli Shekel)</option>
                <option value="AED">🇦🇪 AED (UAE Dirham)</option>
                <option value="SAR">🇸🇦 SAR (Saudi Riyal)</option>
                <option value="QAR">🇶🇦 QAR (Qatari Riyal)</option>
                <option value="KWD">🇰🇼 KWD (Kuwaiti Dinar)</option>
                <option value="BHD">🇧🇭 BHD (Bahraini Dinar)</option>
                <option value="OMR">🇴🇲 OMR (Omani Rial)</option>
                <option value="JOD">🇯🇴 JOD (Jordanian Dinar)</option>
                <option value="LBP">🇱🇧 LBP (Lebanese Pound)</option>
                <option value="CYP">🇨🇾 CYP (Cypriot Pound)</option>
                <option value="MTL">🇲🇹 MTL (Maltese Lira)</option>
                <option value="LUF">🇱🇺 LUF (Luxembourg Franc)</option>
                <option value="MCF">🇲🇨 MCF (Monégasque Franc)</option>
                <option value="LIF">🇱🇮 LIF (Liechtenstein Franc)</option>
                <option value="ADF">🇦🇩 ADF (Andorran Franc)</option>
                <option value="SML">🇸🇲 SML (San Marino Lira)</option>
                <option value="VAT">🇻🇦 VAT (Vatican Lira)</option>
              </select>
            </div>

            {/* Text input and send button */}
            <div className="flex gap-3 relative">
              <div className="relative w-full">
                <TextInput
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Describe your purchase (e.g., 'bottle of water for 50 EGP')..."
                  disabled={typing}
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={typing || !inputText.trim()}
                className={`rounded-lg ${
                  typing || !inputText.trim() 
                    ? "bg-emerald-700/40 cursor-not-allowed" 
                    : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95"
                } px-5 py-3 text-white font-medium transition-all whitespace-nowrap relative`}
              >
                <span>Send</span>
              </button>
            </div>
          </div>



          {/* Greek columns at the bottom corners - moved up to avoid dropdown interference */}
          <div className="absolute bottom-20 left-2 w-12 h-24 opacity-20 pointer-events-none">
            <svg viewBox="0 0 40 100" className="w-full h-full">
              <rect x="10" y="10" width="20" height="70" fill="#10b981" />
              <rect x="5" y="5" width="30" height="5" fill="#10b981" />
              <rect x="5" y="80" width="30" height="15" fill="#10b981" />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect key={i} x="10" y={15 + i * 10} width="20" height="1" fill="#1a1c2d" />
              ))}
            </svg>
          </div>
          <div className="absolute bottom-20 right-2 w-12 h-24 opacity-20 pointer-events-none">
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
        <div className="hidden md:block relative h-[80vh] overflow-visible">
          <div className="absolute inset-0 flex items-end justify-end transition-all duration-700 opacity-100">
            <div className="relative w-[120%] h-[120%] -mb-8 -mr-8 animate-float-slow">
              <Image
                src={getGoddessImage(currentGoddess)}
                alt={currentGoddess}
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 70vw"
              />
              
              {/* Info Box - Bottom Right */}
              {showInfoBox && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute bottom-20 right-4 w-72 bg-[#1a1c2d]/95 backdrop-blur-lg rounded-2xl p-4 border border-emerald-500/30 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Image
                        src={getGoddessProfileImage(currentGoddess)}
                        alt={currentGoddess}
                        width={32}
                        height={32}
                        className="object-contain rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-emerald-200 font-medium text-sm">{currentGoddess}</h4>
                      <p className="text-emerald-300/70 text-xs">
                        {currentGoddess === "ATHENA" ? "Wise Guidance" : "Scam Assessment"}
                      </p>
                    </div>
                  </div>
                  <div className="text-emerald-100 text-sm leading-relaxed">
                    {currentGoddess === "ATHENA" ? (
                      <p>{advice}</p>
                    ) : (
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-2 ${
                          scamScore && scamScore <= 30 ? 'text-green-400' : 
                          scamScore && scamScore <= 70 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {scamScore}%
                        </div>
                        <div className={`text-xs font-medium ${
                          scamScore && scamScore <= 30 ? 'text-green-300' : 
                          scamScore && scamScore <= 70 ? 'text-yellow-300' : 
                          'text-red-300'
                        }`}>
                          {scamScore && scamScore <= 30 ? 'Fair Deal' : 
                           scamScore && scamScore <= 70 ? 'Moderate Risk' : 
                           'High Risk'}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[#1a1c2d]/95 border-r border-b border-emerald-500/30 transform rotate-45"></div>
                </motion.div>
              )}
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

export default ProtectedOracle;
