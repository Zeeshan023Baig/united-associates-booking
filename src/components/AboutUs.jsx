import React from 'react';

export default function AboutUs() {
    return (
        <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem', fontFamily: "'Outfit', sans-serif" }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>About Us</h1>

            <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem', color: '#eee' }}>
                Founded with a clear vision to serve customers with honesty and professionalism, we are a
                growing organization driven by purpose and passion. Our journey began with a simple belief
                — that quality products and sincere service form the foundation of any successful business.
                Over time, we have evolved by understanding customer needs, adapting to market trends, and
                continuously improving our offerings. We take pride in building meaningful relationships
                with customers, partners, and brands, based on mutual respect and trust.
            </p>

            <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem', color: '#eee' }}>
                Today, we operate with a strong commitment to ethical practices, attention to detail, and
                customer satisfaction. As we move forward, we remain focused on sustainable growth while
                staying true to the values on which we were built.
            </p>
        </div>
    );
}
