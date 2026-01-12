import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import './BookingForm.css'; // Reusing the inverted theme styles

export default function Confirmation() {
    const location = useLocation();
    const booking = location.state?.booking;

    useEffect(() => {
        if (booking) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [booking]);

    if (!booking) {
        return (
            <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '1rem' }}>No Booking Found</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>It looks like you haven't placed an order yet.</p>
                    <Link to="/catalog" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                        Browse Catalog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-wrapper">
            <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '800px' }}>
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>

                    {/* Decoration Background Glow */}
                    <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translate(-50%, 0)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ background: 'rgba(74, 222, 128, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <CheckCircle size={48} color="#4ade80" />
                        </div>

                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Order Confirmed!</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                            Thank you for purchasing with <span style={{ color: '#38bdf8', fontWeight: 600 }}>United Associates Agencies</span>.
                        </p>

                        {/* Order Details: Removed hardcoded dark bg, let glass variables handle it */}
                        <div style={{ textAlign: 'left', background: 'var(--glass-bg)', padding: '2rem', borderRadius: '1rem', marginBottom: '2.5rem', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Reference</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', marginTop: '0.2rem' }}>#{booking.id.slice(0, 8).toUpperCase()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</div>
                                    <div style={{ fontSize: '1rem', marginTop: '0.2rem' }}>{new Date().toLocaleDateString()}</div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Items Ordered</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {booking.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}><span style={{ fontWeight: 500 }}>{item.quantity}x</span> {item.name}</span>
                                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>Total Amount</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38bdf8' }}>₹{booking.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                                Return to Home Page
                            </Link>
                            <Link to="/catalog" className="btn btn-outline" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                                <ShoppingBag size={20} style={{ marginRight: '0.5rem' }} /> Shop More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
