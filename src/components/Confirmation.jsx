import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Printer, Home } from 'lucide-react';

export default function Confirmation() {
    const location = useLocation();
    const booking = location.state?.booking;

    if (!booking) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="glass-panel">
                    <h2>No Booking Found</h2>
                    <Link to="/" className="btn btn-primary">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '800px' }}>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                <CheckCircle size={64} color="#4ade80" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    Thank you, {booking.name}. Your order has been placed successfully.
                </p>
                <p style={{ marginBottom: '2rem' }}>Order Reference: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{booking.id}</code></p>

                <div style={{ textAlign: 'left', background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginTop: 0 }}>Order Details</h3>
                    {booking.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>${item.price * item.quantity}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span>${booking.totalPrice}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => window.print()} className="btn btn-outline">
                        <Printer size={18} /> Print Receipt
                    </button>
                    <Link to="/" className="btn btn-primary">
                        <Home size={18} /> Return to Catalog
                    </Link>
                </div>
            </div>
        </div>
    );
}
