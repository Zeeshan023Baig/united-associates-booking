import React from 'react';

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#020617', // Very dark slate, almost black
            color: '#94a3b8',           // Slate-400 for text
            padding: '2rem 1rem',
            textAlign: 'center',
            marginTop: 'auto',          // Push to bottom if flex container
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <div style={{ fontSize: '0.9rem', color: '#38bdf8' }}>
                &copy; 2025 United Associates Agencies. All rights reserved.
            </div>
            <div style={{
                fontSize: '0.8rem',
                color: '#d97706',       // Amber-600 for tagline
                marginTop: '0.5rem',
                letterSpacing: '0.05em'
            }}>
                Excellence in Optics
            </div>
        </footer>
    );
}
