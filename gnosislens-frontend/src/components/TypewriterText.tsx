import React, { useState, useEffect } from "react";

interface Props {
    text: string;
    speed?: number;   // ms per character
    className?: string; // optional styling
    onComplete?: () => void; // 👈 NEW
}

const TypewriterText: React.FC<Props> = ({ text, speed = 100, className }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[i]);
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return <p className={className}>{displayedText}</p>;
};

export default TypewriterText;