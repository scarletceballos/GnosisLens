"use client";

import { useAuth } from './AuthContext';
import { motion } from '../components/motion-polyfill';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleAnalytics = () => {
    router.push('/analytics');
  };

  return (
    <header className="w-full flex items-center py-4 px-6 relative">
      {/* Center - Logo/Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-3xl font-bold text-emerald-600">GnosisLens</h1>
      </div>

      {/* Right side - User info and actions */}
      <div className="flex items-center gap-4 ml-auto">
        {user && (
          <>
            <span className="text-emerald-300">
              Welcome, {user.firstName || user.username}!
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalytics}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Analytics
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors mr-16"
            >
              Logout
            </motion.button>
          </>
        )}
      </div>
    </header>
  );
}
