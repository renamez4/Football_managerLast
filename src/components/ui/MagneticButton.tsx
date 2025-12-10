
"use client";

import React, { useRef, useEffect } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic strength
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        };

        const handleMouseLeave = () => {
            btn.style.transform = 'translate(0px, 0px)';
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <button ref={btnRef} className={className} {...props}>
            {children}
        </button>
    );
}
