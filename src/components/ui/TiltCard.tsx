
"use client";

import { useRef, useState, MouseEvent } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function TiltCard({ children, className = "", ...props }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
        background: "transparent",
    });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        setStyle({
            transition: "none",
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        });

        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;

        setGlareStyle({
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`,
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transition: "var(--transition)",
            transform: "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
        });
        setGlareStyle({
            background: "transparent",
        });
    };

    const { style: propStyle, ...otherProps } = props;

    return (
        <div
            ref={cardRef}
            className={`${className} relative overflow-hidden transform-style-3d`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ ...propStyle, ...style }}
            {...otherProps}
        >
            {children}
            <div
                className="glare absolute top-0 left-0 w-full h-full pointer-events-none mix-blend-overlay z-10"
                style={glareStyle}
            />
        </div>
    );
}
