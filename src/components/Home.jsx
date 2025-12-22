import React, { useRef, useEffect } from 'react';
import ModelCatalog from './ModelCatalog';
import FeatureHighlights from './FeatureHighlights';
import { ChevronDown } from 'lucide-react';

export default function Home({ addToCart, cart }) {
    const catalogRef = useRef(null);

    const scrollToCatalog = () => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll Animation Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const sections = document.querySelectorAll('.fade-in-section');
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Full Screen Hero with Dark Premium Gradient */}
            <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', background: '#0a0a0a' }}>

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
                        {/* Premium Glass Badge Removed */}

                        {/* Dark Mode Title */}
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
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
            <div className="fade-in-section">
                <FeatureHighlights />
            </div>

            {/* Embedded Catalog */}
            <div ref={catalogRef} style={{ paddingTop: '4rem' }} className="fade-in-section">
                <ModelCatalog addToCart={addToCart} cart={cart} />
            </div>

            {/* NEW: Our Technology Section - Moved after Catalog */}
            <section className="container fade-in-section" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Precision Engineered</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#38bdf8' }}>Surgical Grade Steel</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Ultra-lightweight yet practically indestructible frames designed for longevity.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#a78bfa' }}>HD Polarized Lenses</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>100% UV400 protection with advanced anti-glare coating for crystal clear vision.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#34d399' }}>Screwless Hinges</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Patented hinge technology that never loosens, ensuring a perfect fit forever.</p>
                    </div>
                </div>
            </section>

            {/* NEW: Customer Reviews Section - Moved after Catalog */}
            <section className="fade-in-section" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03))', padding: '6rem 0' }}>
                <div className="container" style={{ padding: '0 2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Trusted by Visionaries</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { name: "Aditya R.", role: "Architect", text: "The most comfortable frames I've ever worn. The lens clarity is unmatched.", rating: 5 },
                            { name: "Priya S.", role: "Designer", text: "Absolutely love the aesthetic. Fits my face shape perfectly and feels premium.", rating: 5 },
                            { name: "Vikram M.", role: "Tech Lead", text: "Great service and fast delivery. The computer glasses have saved my eyes.", rating: 4 }
                        ].map((review, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '2rem' }}>
                                <div style={{ color: '#fbbf24', marginBottom: '1rem' }}>{"★".repeat(review.rating)}</div>
                                <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: '#e5e5e5' }}>"{review.text}"</p>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{review.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{review.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
