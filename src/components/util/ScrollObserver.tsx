
"use client";

import { useEffect } from 'react';

export function ScrollObserver() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        const handleMutations = () => {
            // Select elements to animate matching ui.js
            const nodes = document.querySelectorAll('.card, .hero, .section-title, .grid > div');
            nodes.forEach((el) => {
                const element = el as HTMLElement;
                if (element.classList.contains('scroll-reveal')) return;

                element.classList.add('scroll-reveal');

                // Staggered delay for grid items
                if (element.parentElement?.classList.contains('grid') || element.parentElement?.classList.contains('position-grid')) {
                    const parent = element.parentElement;
                    const childIndex = Array.from(parent.children).indexOf(element);
                    element.style.transitionDelay = `${childIndex * 100}ms`;
                }

                observer.observe(element);
            });
        };

        // Initial run
        handleMutations();

        // Observe for dynamic content changes
        const mutationObserver = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) shouldUpdate = true;
            });
            if (shouldUpdate) handleMutations();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return null;
}
