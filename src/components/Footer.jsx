import React from 'react';

export default function Footer() {
    return (
        <footer style={{
            marginTop: 'auto',
            padding: '2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-footer)',
            backdropFilter: 'blur(10px)',
            color: 'var(--text-secondary)',
            transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
        }}>
            <p style={{ fontSize: '0.9rem', color: 'inherit', marginBottom: '0.5rem', opacity: 0.8 }}>
                &copy; {new Date().getFullYear()} United Associates Agencies. All rights reserved.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'inherit', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>
                Excellence in Optics
            </p>
        </footer>
    );
}
