import React, { useEffect, useRef, useState } from 'react';

const FEATURES = [
    {
        title: "PREMIUM LENSES",
        subtitle: "Uncompromising Clarity",
        image: "/assets/quality_lens.png",
        accentColor: "#fbbf24", // Amber
        align: 'left'
    },
    {
        title: "ARTISAN QUALITY",
        subtitle: "Hand-Polished Acetate",
        image: "/assets/quality_materials.png",
        accentColor: "#38bdf8", // Sky Blue
        align: 'right'
    },
    {
        title: "OPTICAL FRAMES",
        subtitle: "Prescription Ready",
        image: "/assets/type_optical.png",
        accentColor: "#f472b6", // Pink
        align: 'left'
    },
    {
        title: "SUNGLASSES",
        subtitle: "UV Protection",
        image: "/assets/type_sun.png",
        accentColor: "#34d399", // Emerald
        align: 'right'
    }
];

// Animation Helper Component
const Reveal = ({ children, width = '100%' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, {
            threshold: 0.2, // Trigger when 20% visible
            rootMargin: "0px 0px -100px 0px" // Trigger slightly before leaving view
        });

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.disconnect();
        };
    }, []);

    return (
        <div ref={ref} style={{
            width,
            opacity: isVisible ? 1 : 0,
            // Pop In: Scale 1, Translate 0 | Pop Out: Scale 0.95, Translate 50px
            transform: isVisible
                ? 'scale(1) translateY(0)'
                : 'scale(0.95) translateY(50px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'opacity, transform'
        }}>
            {children}
        </div>
    );
};

export default function FeatureHighlights() {
    return (
        <div style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '4rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'repeat(2, minmax(500px, auto))', // Smart height: at least 500px, grows if needed
            gap: '1.5rem'
        }}>
            {FEATURES.map((feature, index) => {
                // Dynamic Grid: 
                // Row 1: Big Left (8), Small Right (4)
                // Row 2: Small Left (4), Big Right (8)
                const isEvenRow = Math.floor(index / 2) % 2 === 0;
                const isFirstInRow = index % 2 === 0;

                let colSpan;
                if (isEvenRow) {
                    colSpan = isFirstInRow ? 'span 8' : 'span 4';
                } else {
                    colSpan = isFirstInRow ? 'span 4' : 'span 8';
                }

                // Mobile fallback helper
                const gridClass = `span-${colSpan.split(' ')[1]}`;

                return (
                    <div
                        key={index}
                        className="bento-card" // Check index.css for hover effects
                        style={{
                            gridColumn: colSpan,
                            position: 'relative',
                            borderRadius: '30px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            background: 'rgba(255,255,255,0.03)', // Dark Glass base
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(0.98)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {/* Conditional Rendering: Video or Image */}
                        {feature.image.endsWith('.mp4') ? (
                            <video
                                src={feature.image}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.6s ease',
                                    zIndex: 0,
                                    opacity: 0.8
                                }}
                                className="card-bg"
                            />
                        ) : (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${feature.image})`,
                                backgroundSize: feature.isLogo ? '40%' : 'cover', // Standard cover
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                transition: 'transform 0.6s ease',
                                zIndex: 0,
                                opacity: feature.isLogo ? 0.8 : 1
                            }} className="card-bg" />
                        )}

                        {/* Stronger Dark Gradient Overlay for Text Readability */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)`, // Deeper, taller fade
                            zIndex: 1
                        }} />

                        {/* Content */}
                        <div style={{
                            position: 'relative',
                            zIndex: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '2rem' // Reduced padding for more space
                        }}>
                            <h4 style={{
                                color: feature.accentColor,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                marginBottom: '0.5rem',
                                textShadow: '0 2px 4px rgba(0,0,0,0.8)' // Added shadow
                            }}>
                                {feature.subtitle}
                            </h4>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                marginBottom: '0.5rem',
                                lineHeight: 1.1,
                                color: '#fff',
                                textShadow: '0 2px 10px rgba(0,0,0,0.8)' // Added shadow
                            }}>
                                {feature.title}
                            </h2>
                            <p style={{
                                color: 'rgba(255,255,255,0.9)', // Brighter text
                                fontSize: '0.9rem', // Optimized for fit
                                lineHeight: '1.5',
                                maxWidth: '100%',
                                display: 'block',
                                // WebkitLineClamp: 4, // Removed
                                // WebkitBoxOrient: 'vertical', // Removed
                                overflow: 'visible',
                                textShadow: '0 1px 4px rgba(0,0,0,0.8)', // Added shadow
                                fontWeight: '500'
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    </div>
                );
            })}

            <style>{`
                @media (max-width: 768px) {
                    div[style*="display: grid"] {
                        display: flex !important;
                        flex-direction: column;
                        height: auto !important;
                    }
                    .bento-card {
                        height: 550px;
                        width: 100%;
                    }
                }
                .bento-card:hover .card-bg {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}
