
import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
    text: string;
    speed?: number;
    className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 100, className = '' }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayedText('');
        setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timeoutId);
        }
    }, [currentIndex, text, speed]);

    return <span className={className}>{displayedText}</span>;
};

export default TypingEffect;
