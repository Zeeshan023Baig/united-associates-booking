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
            {/* Dark Overlay for readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.7)', // Darkened for text contrast
                backdropFilter: 'blur(5px)',
                zIndex: 1
            }}></div>

            {/* Content Contentier */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '800px',
                margin: '0 2rem',
                padding: '3rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)', // Glass effect
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: "'Outfit', sans-serif"
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>About Us</h1>

                <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.15rem', color: '#e2e8f0', textAlign: 'justify' }}>
                    Founded with a clear vision to serve customers with honesty and professionalism, we are a
                    growing organization driven by purpose and passion. Our journey began with a simple belief
                    — that quality products and sincere service form the foundation of any successful business.
                    Over time, we have evolved by understanding customer needs, adapting to market trends, and
                    continuously improving our offerings. We take pride in building meaningful relationships
                    with customers, partners, and brands, based on mutual respect and trust.
                </p>

                <p style={{ lineHeight: '1.8', marginBottom: '0', fontSize: '1.15rem', color: '#e2e8f0', textAlign: 'justify' }}>
                    Today, we operate with a strong commitment to ethical practices, attention to detail, and
                    customer satisfaction. As we move forward, we remain focused on sustainable growth while
                    staying true to the values on which we were built.
                </p>
            </div>
        </div>
    );
}
