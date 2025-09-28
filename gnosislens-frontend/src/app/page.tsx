"use client";
import Image from "next/image";
import ConversationalUI from "../components/ConversationalUI";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center min-h-screen p-4 sm:p-6 gap-4">
      <header className="w-full flex justify-center py-2">
        <Image
          className="dark:invert h-12 w-auto"
          src="/headertext.png"
          alt="Header"
          width={1000}
          height={10}
          priority
        />
      </header>
      
      <main className="w-full flex flex-col items-center">
        <ConversationalUI />
      </main>
    </div>
  );
}
