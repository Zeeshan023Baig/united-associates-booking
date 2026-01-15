import React from 'react';

export default function AboutUs() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: "url('/about-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed', // Parallax effect
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Dark Overlay REMOVED */}

            {/* Content Contentier - Switched to White Glass */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '800px',
                margin: '0 2rem',
                padding: '3rem',
                backgroundColor: 'rgba(255, 255, 255, 0.85)', // Stronger white glass
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                fontFamily: "'Outfit', sans-serif",
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    color: '#1f2937',
                    textShadow: 'none'
                }}>About Us</h1>

                <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.15rem', color: '#334155', textAlign: 'justify' }}>
                    Founded with a clear vision to serve customers with honesty and professionalism, we are a
                    growing organization driven by purpose and passion. Our journey began with a simple belief
                    — that quality products and sincere service form the foundation of any successful business.
                    Over time, we have evolved by understanding customer needs, adapting to market trends, and
                    continuously improving our offerings. We take pride in building meaningful relationships
                    with customers, partners, and brands, based on mutual respect and trust.
                </p>

                <p style={{ lineHeight: '1.8', marginBottom: '0', fontSize: '1.15rem', color: '#334155', textAlign: 'justify' }}>
                    Today, we operate with a strong commitment to ethical practices, attention to detail, and
                    customer satisfaction. As we move forward, we remain focused on sustainable growth while
                    staying true to the values on which we were built.
                </p>
            </div>
        </div>
    );
}
