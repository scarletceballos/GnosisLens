"use client";

import dynamic from 'next/dynamic';

// Import the background with no SSR to avoid hydration issues
const ParallaxBackground = dynamic(
  () => import('./ParallaxBackground'),
  { ssr: false }
);

export default function ClientBackgroundWrapper() {
  return <ParallaxBackground />;
}
