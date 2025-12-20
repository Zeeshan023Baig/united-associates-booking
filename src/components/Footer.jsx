import React from 'react';

export default function Footer() {
    return (
        <footer style={{
            marginTop: 'auto',
            padding: '2rem',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)'
        }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                &copy; {new Date().getFullYear()} United Associates Agencies. All rights reserved.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Excellence in Optics
            </p>
        </footer>
    );
}
