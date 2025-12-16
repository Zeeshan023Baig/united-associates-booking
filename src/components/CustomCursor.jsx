import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        // Use refs for mutable state to avoid re-renders on every frame
        const pos = { x: 0, y: 0 };
        const mouse = { x: 0, y: 0 };
        const speed = 0.15; // The "lag" factor

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Direct update for the main dot (instant)
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
            }

            // Check if hovering clickable
            const target = e.target;
            const isClickable = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.clickable') || window.getComputedStyle(target).cursor === 'pointer';
            setHovering(!!isClickable);
        };

        const loop = () => {
            // Lerp for the follower
            pos.x += (mouse.x - pos.x) * speed;
            pos.y += (mouse.y - pos.y) * speed;

            if (followerRef.current) {
                followerRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
            }
            requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', handleMouseMove);
        const loopId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(loopId);
        };
    }, []);

    return (
        <>
            {/* Main Dot */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    backgroundColor: hovering ? '#6366f1' : '#fff', // Indigo when hovering
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate3d(0,0,0)',
                    transition: 'background-color 0.2s ease, width 0.2s ease, height 0.2s ease',
                    marginTop: '-4px',
                    marginLeft: '-4px',
                    mixBlendMode: 'difference' // Cool effect
                }}
            />
            {/* Follower Ring */}
            <div
                ref={followerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: hovering ? '50px' : '30px',
                    height: hovering ? '50px' : '30px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    backgroundColor: hovering ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transform: 'translate3d(0,0,0)',
                    transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease',
                    marginTop: hovering ? '-25px' : '-15px',
                    marginLeft: hovering ? '-25px' : '-15px',
                }}
            />
            <style>{`
                /* Hide default cursor only on devices with fine pointer */
                @media (pointer: fine) {
                    body {
                        cursor: none;
                    }
                    a, button, input {
                        cursor: none;
                    }
                }
            `}</style>
        </>
    );
}
