"use client";

// LoadingScreen page for the /loadingpage route
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import bg from '../../images/background.png';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isTransitionComplete, setIsTransitionComplete] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Increment 25% every 2 seconds until reaching 100%
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 25);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Reset transition flag whenever progress is changed to something < 100
  useEffect(() => {
    if (progress < 100) setIsTransitionComplete(false);
  }, [progress]);

  return (
    <div className="relative min-h-screen">
  <Image src={bg} alt="Background" fill className="object-cover -z-10" priority />

      <div className="min-h-screen flex items-center justify-center flex-col text-center px-4">
        <div className="spinner mb-6" aria-hidden />

        <p className="text-lg font-medium mb-4">The Council is making Its judgement...</p>

        <div className="w-full max-w-md">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-700 ease-linear"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              onTransitionEnd={() => {
                // Only mark complete when we've actually reached 100
                if (progress === 100) setIsTransitionComplete(true);
              }}
            />
          </div>
          {progress === 100 && isTransitionComplete && (
            <div className="mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => router.push('/results')}
                aria-label="I'm awaiting my decree"
              >
                Witness your decree.
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
