import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart({ cart, updateQuantity, removeFromCart }) {
    const navigate = useNavigate();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleRedirect = () => {
        if (cart.length === 0) return;
        // Redirect to external store
        window.location.href = 'https://uaastore.vercel.app/catalogue';
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '6rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>

                    {/* Background blob for visual interest */}
                    <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>

                    <div style={{ marginBottom: '2rem', display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <ShoppingBag size={48} color="#38bdf8" />
                    </div>

                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Your Collection Awaits
                    </h2>

                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                        Your cart is currently empty. Explore our premium catalog to find your next signature look.
                    </p>

                    <button onClick={() => navigate('/catalog')} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        Discover Catalog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>You're almost there...</h2>

            <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Cart Summary ({totalItems} items)</h3>
                    <button onClick={handleRedirect} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                        Proceed <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                        <div key={item.firebaseId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {/* Optional: Add Image if available */}
                                {item.imageUrl && (
                                    <div style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.name}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>₹{item.price}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '4px' }}>
                                    <button onClick={() => updateQuantity(item.firebaseId, -1)} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', color: 'var(--text-primary)' }}>-</button>
                                    <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.firebaseId, 1)} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', color: 'var(--text-primary)' }}>+</button>
                                </div>
                                <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                                <button onClick={() => removeFromCart(item.firebaseId)} className="btn btn-ghost" style={{ color: '#f87171', padding: '0.5rem' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Amount</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>₹{totalPrice.toLocaleString()}</div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleRedirect}
                        className="btn btn-primary"
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.2rem',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)'
                        }}
                    >
                        Proceed to Booking Request <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    You will be redirected to our partner store to complete your request.
                </p>
            </div>
        </div>
    );
}
