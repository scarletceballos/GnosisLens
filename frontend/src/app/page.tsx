"use client";
import Image from "next/image";
import { useAuth } from "../components/AuthContext";
import AuthPage from "../components/AuthPage";
import ProtectedOracle from "../components/ProtectedOracle";
import Header from "../components/Header";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-emerald-200 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center min-h-screen p-4 sm:p-6 gap-4">
      <Header />
      
      <main className="w-full flex flex-col items-center">
        <ProtectedOracle />
      </main>
    </div>
  );
}
