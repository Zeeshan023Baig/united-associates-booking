import React, { useRef } from 'react';
import ModelCatalog from './ModelCatalog';
import FeatureHighlights from './FeatureHighlights';
import { ChevronDown } from 'lucide-react';

export default function Home({ addToCart, cart }) {
    const catalogRef = useRef(null);

    const scrollToCatalog = () => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Full Screen Hero with Dark Premium Gradient */}
            <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: '#0a0a0a' }}>

                {/* Deep Dark Glows */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '60%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)', // Indigo glow
                    filter: 'blur(80px)',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '50%',
                    height: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%)', // Purple glow
                    filter: 'blur(80px)',
                    zIndex: 0
                }} />

                <div className="container hero-split-layout" style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    zIndex: 1
                }}>
                    {/* Left Column: Text Content */}
                    <div style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        paddingRight: '2rem',
                        zIndex: 2
                    }}>
                        {/* Premium Glass Badge */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            padding: '0.4rem 1.2rem',
                            borderRadius: '50px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '2rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            animation: 'fadeInUp 0.8s ease-out',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}>
                            New Collection 2025
                        </div>

                        {/* Dark Mode Title */}
                        <h1 style={{
                            fontSize: 'clamp(3rem, 5vw, 5.5rem)',
                            fontWeight: '800',
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            color: '#fff',
                            letterSpacing: '-0.03em',
                            animation: 'fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards',
                            opacity: 0,
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                            United Associates<br />
                            <span style={{
                                background: 'linear-gradient(to right, #818cf8, #c084fc)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Agencies</span>
                        </h1>

                        <p style={{
                            fontSize: '1.125rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            maxWidth: '500px',
                            marginBottom: '2.5rem',
                            lineHeight: 1.6,
                            opacity: 0,
                            animation: 'fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards'
                        }}>
                            Curating the world's finest optical collection for the modern visionary. Experience the perfect blend of style and innovation.
                        </p>

                        <button
                            onClick={scrollToCatalog}
                            style={{
                                fontSize: '1rem',
                                padding: '1rem 2.5rem',
                                borderRadius: '50px',
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: 0,
                                animation: 'fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s forwards',
                                boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            Explore Collection
                        </button>
                    </div>

                    {/* Right Column: Hero Visual */}
                    <div className="hero-visual" style={{
                        flex: '1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        animation: 'fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s forwards',
                        opacity: 0
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '600px',
                            aspectRatio: '4/3',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)',
                            transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                            transition: 'transform 0.2s ease-out',
                            background: '#000',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;

                                // Calculate tilt
                                const centerX = rect.width / 2;
                                const centerY = rect.height / 2;
                                const rotateX = ((y - centerY) / centerY) * -5;
                                const rotateY = ((x - centerX) / centerX) * 5;

                                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(2deg) scale(1)';
                            }}
                        >
                            <video
                                src="https://india.ray-ban.com/discover/image/3sep-main-vdo.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    opacity: 1
                                }}
                            />
                            {/* Gloss overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 40%)',
                                pointerEvents: 'none',
                                zIndex: 2
                            }} />
                        </div>
                    </div>
                </div>

                <div
                    onClick={scrollToCatalog}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        cursor: 'pointer',
                        animation: 'bounce 2s infinite',
                        opacity: 0.6,
                        color: '#fff', // White arrow
                        zIndex: 10
                    }}
                >
                    <ChevronDown size={32} />
                </div>
            </div>

            {/* Feature Highlights Section */}
            <FeatureHighlights />

            {/* Embedded Catalog */}
            <div ref={catalogRef} style={{ paddingTop: '4rem' }}>
                <ModelCatalog addToCart={addToCart} cart={cart} />
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scaleX(0);
                    }
                    to {
                        opacity: 1;
                        transform: scaleX(1);
                    }
                }
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }

                @media (max-width: 968px) {
                    .hero-split-layout {
                        flex-direction: column !important;
                        justify-content: center !important;
                        text-align: center !important;
                        padding-top: 6rem !important;
                    }
                    /* Since text-align is left inline, we need to target the internal div or override generally */
                    .hero-split-layout > div {
                        align-items: center !important;
                        text-align: center !important;
                        padding-right: 0 !important;
                        width: 100%;
                    }
                    .hero-visual {
                        margin-top: 3rem;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
