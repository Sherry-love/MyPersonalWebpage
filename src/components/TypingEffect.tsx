import React, { useState, useEffect, useCallback } from 'react';

interface TypingEffectProps {
    text: string;
    speed?: number;
    className?: string;
    loop?: boolean;
    loopDelay?: number; // delay in ms before restarting
}

const TypingEffect: React.FC<TypingEffectProps> = ({
                                                       text,
                                                       speed = 100,
                                                       className = '',
                                                       loop = false,
                                                       loopDelay = 30000,
                                                   }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const resetAnimation = useCallback(() => {
        setCurrentIndex(0);
        setDisplayedText('');
    }, []);

    // Effect to reset when the text prop changes, ensuring the animation restarts if the source text is updated.
    useEffect(() => {
        resetAnimation();
    }, [text, resetAnimation]);

    useEffect(() => {
        // When typing is complete
        if (currentIndex >= text.length) {
            // If looping is enabled, wait for the delay then reset.
            if (loop) {
                const timer = setTimeout(() => {
                    resetAnimation();
                }, loopDelay);
                return () => clearTimeout(timer); // Cleanup the timer
            }
            // If not looping, do nothing.
            return;
        }

        // The core typing animation interval
        const timer = setTimeout(() => {
            setDisplayedText((prev) => prev + text[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
        }, speed);

        return () => clearTimeout(timer); // Cleanup the timer
    }, [currentIndex, text, speed, loop, loopDelay, resetAnimation]);

    return <span className={className}>{displayedText}</span>;
};

export default TypingEffect;