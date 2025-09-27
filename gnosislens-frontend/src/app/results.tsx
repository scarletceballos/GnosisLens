"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import mockData from '../data/mockresponse.json';
import TypewriterText from "../components/TypewriterText";

export default function Results() {
    // Extract only what we need
    const data = mockData?.data ?? {};
    const goddessRaw = data?.goddess ?? 'NEMESIS';
    const initialResponse = data?.goddessResponse ?? 'The oracle is silent.';
    const advice = data?.advice ?? 'No advice available.';

    const goddess = goddessRaw.charAt(0).toUpperCase() + goddessRaw.slice(1).toLowerCase();

    const [displayText, setDisplayText] = useState<string>(initialResponse);
    const [adviceShown, setAdviceShown] = useState<boolean>(false);

    function handleAsk() {
        setDisplayText(advice);
        setAdviceShown(true);
    }

    return (
        <div className="relative min-h-screen font-sans">
            <Image src="/images/background.png" alt="Background" fill className="object-cover -z-10" priority />

            <div className="min-h-screen p-8 pb-20 sm:p-20">
                {/* Header */}
                <div className="mb-6">
                    <Image
                        className="dark:invert h-16 w-auto"
                        src="/headertext.png"
                        alt="Header"
                        width={10000}
                        height={10}
                        priority
                    />
                </div>

                {/* Goddess response (moved inward and centered) */}
                <section className="absolute top-28 left-12 max-w-[900px] w-[min(70%,900px)] p-6 rounded bg-white/60 dark:bg-black/40 backdrop-blur-sm">
                    <h2 className="text-2xl font-semibold mb-2 text-center">{goddess} says:</h2>

                    <p data-testid="response-text" className="mb-6 text-base leading-relaxed text-center">
                        {displayText}
                    </p>
                </section>

                {/* Chat prompt (bottom-right) */}
                {!adviceShown && (
                    <div className="absolute right-1/4 bottom-1/4 translate-x-1/4 translate-y-1/4 w-[min(420px,80%)] max-w-sm">
                        <label htmlFor="advice-input" className="sr-only">Ask for advice</label>
                        <div className="flex gap-2">
                            <TypewriterText
                                text="Okay Wise One, do you have advice?"
                                speed={80}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-black/90 dark:text-white dark:border-gray-700"
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                                onClick={handleAsk}
                            >
                                Ask
                            </button>
                        </div>
                    </div>
                )}






                {/* Footer area (kept for parity, but visually unobtrusive) */}
                <footer className="absolute left-1/2 -translate-x-1/2 bottom-4 opacity-80">
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
                        href="https://nextjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn more
                    </a>
                </footer>
            </div>
        </div>
    );
}
