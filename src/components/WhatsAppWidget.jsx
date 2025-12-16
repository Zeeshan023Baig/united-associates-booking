import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget() {
    // Replace with actual number
    const phoneNumber = "919381054712";
    const message = encodeURIComponent("Hello! I'm interested in your eyewear collection.");

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#25D366',
                color: 'white',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 1000,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Chat on WhatsApp"
        >
            <MessageCircle size={32} />
        </a>
    );
}
