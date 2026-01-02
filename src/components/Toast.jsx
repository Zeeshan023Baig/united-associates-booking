import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-dismiss after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderRadius: '12px',
            // Glassmorphism background suitable for both light/dark modes (uses variables if available or generic)
            background: 'var(--glass-bg, rgba(255, 255, 255, 0.9))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(0)',
            animation: 'slideIn 0.3s ease-out forwards',
            color: 'var(--text-primary, #1f2937)',
            minWidth: '320px',
            maxWidth: '90vw'
        }}>
            <style>
                {`
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateX(100%); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                `}
            </style>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: isSuccess ? '#10b981' : '#ef4444'
            }}>
                {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: 600 }}>{isSuccess ? 'Success' : 'Error'}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)' }}>{message}</p>
            </div>

            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary, #9ca3af)',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
