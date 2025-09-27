"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import bg from '../images/background.png';
import mockData from '../data/mockresponse.json';

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
  <Image src={bg} alt="Background" fill className="object-cover -z-10" priority />

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

        {/* Goddess response (upper-left) */}
        <section className="absolute top-24 left-8 max-w-2xl w-[min(60%,700px)] p-6 rounded bg-white/60 dark:bg-black/40 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-2">{goddess} says:</h2>

          <p data-testid="response-text" className="mb-6 text-base leading-relaxed">
            {displayText}
          </p>
        </section>

        {/* Chat prompt (bottom-right) */}
        {!adviceShown && (
          <div className="absolute right-8 bottom-8 w-[min(360px,90%)]">
            <label htmlFor="advice-input" className="sr-only">Ask for advice</label>
            <div className="flex gap-2">
              <input
                id="advice-input"
                defaultValue={"Okay Wise One, do you have advice on what I should do?"}
                className="flex-1 px-3 py-2 border rounded bg-white/90"
                readOnly
                aria-label="advice prompt"
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
