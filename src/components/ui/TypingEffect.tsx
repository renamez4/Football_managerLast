"use client";

import { useState, useEffect } from "react";

interface TypingEffectProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    onComplete?: () => void;
}

export function TypingEffect({ text, speed = 50, delay = 0, className = "", onComplete }: TypingEffectProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed, onComplete]);

    return (
        <span className={`${className} ${displayedText.length < text.length ? 'typing-cursor' : ''}`}>
            {displayedText}
        </span>
    );
}
