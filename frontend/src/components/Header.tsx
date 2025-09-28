"use client";

import { useAuth } from './AuthContext';
import { motion } from '../components/motion-polyfill';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="w-full flex justify-between items-center py-4 px-6">
      {/* Left side - Logo/Title */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-emerald-200">GnosisLens</h1>
      </div>

      {/* Right side - User info and actions */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-emerald-300">
              Welcome, {user.firstName || user.username}!
            </span>
            
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
