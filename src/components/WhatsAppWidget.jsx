import React from 'react';
import { Phone } from 'lucide-react';

export default function WhatsAppWidget() {
    // Replace with actual number
    const phoneNumber = "+919444058453"; // Added + for international calling format if needed, or keep as is. The user had 91... which acts as country code. 
    // User had "919444058453". `tel:919444058453` might work locally, but `+91` is safer. 
    // The previous code had `wa.me/919444058453`. 
    // I will use `+919444058453` for the tel link.

    return (
        <a
            href={`tel:${phoneNumber}`}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#25D366', // Keep green or change to a standard phone color? Green is standard for "Call" too.
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
                cursor: 'pointer',
                textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Call Us"
        >
            <Phone size={32} />
        </a>
    );
}
