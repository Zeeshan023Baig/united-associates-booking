import React from 'react';

export default function WhyUs() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: "url('/why-bg.png')",
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

            {/* Content Container */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '800px',
                margin: '4rem 2rem',
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
                }}>Why Us</h1>

                <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.15rem', color: '#e2e8f0', textAlign: 'justify' }}>
                    We are a customer-focused organization committed to delivering quality products and
                    dependable service. Built on strong values of integrity, transparency, and professionalism, our
                    goal is to create long-term relationships with our customers rather than short-term
                    transactions.
                </p>

                <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.15rem', color: '#e2e8f0', textAlign: 'justify' }}>
                    With a deep understanding of our industry and market needs, we carefully curate products
                    and solutions that meet high standards of quality and reliability. Every offering is backed by
                    attentive support, timely delivery, and a genuine intent to add value to our customers’ lives
                    and businesses.
                </p>

                <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.15rem', color: '#e2e8f0', textAlign: 'justify' }}>
                    What sets us apart is our emphasis on trust, consistency, and personalized service. We believe
                    that success comes from listening closely, responding responsibly, and continuously
                    improving to exceed expectations.
                </p>

                <p style={{ lineHeight: '1.8', marginBottom: '0', fontSize: '1.15rem', color: '#e2e8f0', textAlign: 'justify' }}>
                    As we grow, our focus remains unchanged — to serve with honesty, deliver with excellence,
                    and build partnerships that stand the test of time.
                </p>
            </div>
        </div>
    );
}
