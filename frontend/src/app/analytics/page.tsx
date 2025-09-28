"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from '../components/motion-polyfill';
import { useAuth } from '../../../components/AuthContext';

interface UserAnalytics {
  totalPurchases: number;
  totalSpent: number;
  averageScamScore: number;
  highestScamScore: number;
  lowestScamScore: number;
  countries: string[];
  goddesses: string[];
  totalScammed: number;
  totalFairDeals: number;
}

interface PurchaseHistory {
  itemName: string;
  pricePaid: number;
  currency: string;
  country: string;
  scamScore: number;
  goddess: string;
  timestamp: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchPurchaseHistory();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/analytics', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analytics data received:', data);
        setAnalytics(data.data);
      } else {
        const errorData = await response.json();
        console.error('Analytics fetch failed:', errorData);
        setError(`Failed to fetch analytics: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error fetching analytics');
      console.error('Analytics fetch error:', err);
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/history', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Purchase history data received:', data);
        setPurchaseHistory(data.data.purchases);
      } else {
        const errorData = await response.json();
        console.error('Purchase history fetch failed:', errorData);
        setError(`Failed to fetch purchase history: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error fetching purchase history');
      console.error('Purchase history fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScamScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScamScoreBg = (score: number) => {
    if (score <= 30) return 'bg-green-500/20';
    if (score <= 70) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  if (loading) {
    return (
      <div className="relative min-h-screen font-sans">
        <Image src="/images/background.png" alt="Background" fill className="object-cover -z-10" priority />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-emerald-200 text-xl">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen font-sans">
        <Image src="/images/background.png" alt="Background" fill className="object-cover -z-10" priority />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
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

        {/* Analytics Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-emerald-200 mb-8 text-center">Analytics</h1>
          
          {analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Purchases */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1a1c2d]/90 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{analytics.totalPurchases || 0}</div>
                  <div className="text-emerald-200">Total Purchases</div>
                </div>
              </motion.div>

              {/* Average Scam Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1a1c2d]/90 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30"
              >
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScamScoreColor(analytics.averageScamScore || 0)}`}>
                    {(analytics.averageScamScore || 0).toFixed(1)}%
                  </div>
                  <div className="text-emerald-200">Average Scam Score</div>
                </div>
              </motion.div>

              {/* Fair Deals */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1a1c2d]/90 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{analytics.totalFairDeals || 0}</div>
                  <div className="text-emerald-200">Fair Deals</div>
                </div>
              </motion.div>

              {/* Scammed Count */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1a1c2d]/90 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">{analytics.totalScammed || 0}</div>
                  <div className="text-emerald-200">Times Scammed</div>
                </div>
              </motion.div>

              {/* Countries Visited */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[#1a1c2d]/90 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{analytics.countries?.length || 0}</div>
                  <div className="text-emerald-200">Countries</div>
                </div>
              </motion.div>

              {/* Goddesses Met */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-[#1a1c2d]/90 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.goddesses?.length || 0}</div>
                  <div className="text-emerald-200">Goddesses Met</div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center text-emerald-300/70 mb-8">
              No analytics data available yet. Start making purchases to see your statistics!
            </div>
          )}

          {/* Purchase History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[#1a1c2d]/90 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30"
          >
            <h2 className="text-2xl font-bold text-emerald-200 mb-6">Recent Purchases</h2>
            
            {purchaseHistory.length > 0 ? (
              <div className="space-y-4">
                {purchaseHistory.map((purchase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-[#2a2d3a]/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-emerald-200 font-medium">{purchase.itemName}</div>
                      <div className="text-emerald-300/70 text-sm">
                        {purchase.country} • {purchase.pricePaid} {purchase.currency}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-emerald-300/70 text-sm">{purchase.goddess}</div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScamScoreBg(purchase.scamScore)} ${getScamScoreColor(purchase.scamScore)}`}>
                        {purchase.scamScore}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-emerald-300/70">
                No purchase history available yet.
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 opacity-20"
        >
          <div className="w-full h-full bg-emerald-500 rounded-full"></div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-12 h-12 opacity-15"
        >
          <div className="w-full h-full bg-emerald-400 rounded-full"></div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 left-1/3 w-20 h-20 opacity-10"
        >
          <div className="w-full h-full bg-emerald-300 rounded-full"></div>
        </motion.div>

        {/* Greek pattern decoration */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-8 opacity-20"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 400 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 H20 V5 H40 V15 H60 V5 H80 V15 H100 V5 H120 V15 H140 V5 H160 V15 H180 V5 H200 V15 H220 V5 H240 V15 H260 V5 H280 V15 H300 V5 H320 V15 H340 V5 H360 V15 H380 V5 H400"
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
