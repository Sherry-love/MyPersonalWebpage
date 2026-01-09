
import React, { useEffect, useCallback } from 'react';

const ParticleEffect: React.FC = () => {
    const particleColors = ['#c4b5fd', '#f9a8d4', '#a5b4fc'];

    const createParticle = useCallback((x: number, y: number) => {
        const particle = document.createElement('div');
        document.body.appendChild(particle);

        const size = Math.floor(Math.random() * 10 + 5);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.position = 'fixed';
        particle.style.top = `${y}px`;
        particle.style.left = `${x}px`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];

        const destinationX = x + (Math.random() - 0.5) * 2 * 75;
        const destinationY = y + (Math.random() - 0.5) * 2 * 75;

        const animation = particle.animate([
            {
                transform: `translate(-50%, -50%)`,
                opacity: 1
            },
            {
                transform: `translate(${destinationX - x - size / 2}px, ${destinationY - y - size / 2}px)`,
                opacity: 0
            }
        ], {
            duration: 500 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: 0
        });

        animation.onfinish = () => {
            particle.remove();
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            createParticle(e.clientX, e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [createParticle]);

    return null; // This component does not render anything itself
};

export default ParticleEffect;
