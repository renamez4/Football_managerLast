"use client";

import { useRef, useState, useEffect } from "react";

interface MagneticProps {
    children: React.ReactElement;
    strength?: number; // How strong the magnetic pull is (default 0.2)
    active?: boolean;
}

export function Magnetic({ children, strength = 0.2, active = true }: MagneticProps) {
    const ref = useRef<HTMLElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!active) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        setPosition({ x: x * strength, y: y * strength });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    // Clone child to apply styles and events
    return (
        <div
            ref={ref as any}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: position.x === 0 ? "transform 0.5s ease" : "none", // Snap back smoothly, move instantly
                display: "inline-block", // wrapper behavior
                width: "fit-content"
            }}
        >
            {children}
        </div>
    );
}
