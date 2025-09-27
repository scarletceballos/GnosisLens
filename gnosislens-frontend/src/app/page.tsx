"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SpeechBubbleInput from "../../components/SpeechBubbleInput";
import ConversationalUI from "../components/ConversationalUI";
import { useState } from 'react';
import TypewriterText from "../components/TypewriterText"
import TextInput from "../../components/TextInput";

export default function Home() {
    const router = useRouter();
    const [typingDone, setTypingDone] = useState(false); // 👈 add this
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

                <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
                    <li className="mb-2 tracking-[-.01em]">
                        What doth thou wish to purchase?{" "}
                        <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
                            Speak, so I may assist.<code />
                            <div className="mb-2 text-center max-w-md"><div />
                                <p className="text-sm font-mono">
                                    <TypewriterText
                                        text="What doth thou wish to purchase? Speak, so I may assist."
                                        speed={60}
                                        onComplete={() => setTypingDone(true)} // 👈 enable button
                                        className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded"
                                    />
                                </p>
                                <ol />
                                <div className="UserTextInput">
                                    <SpeechBubbleInput />
                                    <button
                                        type="button"
                                        className="Athena Button"
                                        onClick={() => router.push('/loadingpage')}
                                        disabled={!typingDone}
                                    >
                                        Speak to Athena
                                    </button>
                                </div>

                                <ConversationalUI />
                            </div>
                        </code>
                    </li>
                </ol>
            </main>
        </div>
    )
}
