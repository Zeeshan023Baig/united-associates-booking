import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { ArrowLeft, Check, AlertCircle, ShoppingCart } from 'lucide-react';

export default function ProductDetails({ addToCart, cart = [] }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading } = useInventory();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (loading) return <div className="container" style={{ paddingTop: '6rem' }}>Loading details...</div>;

    const product = products.find(p => p.firebaseId === id);

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Product Not Found</h2>
                <button onClick={() => navigate('/catalog')} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to Catalog
                </button>
            </div>
        );
    }

    const isSoldOut = product.stock <= 0;
    const cartItem = cart.find(c => c.firebaseId === product.firebaseId);
    const inCartQty = cartItem ? cartItem.quantity : 0;
    const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <button
                onClick={() => navigate('/catalog')}
                className="btn btn-outline"
                style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={18} /> Back to Catalog
            </button>

            <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', padding: '2rem' }}>

                {/* Left Column: Image Gallery */}
                <div>
                    <div style={{
                        width: '100%',
                        height: '400px',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        background: '#0a0a0a',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                        <img
                            src={images[activeImageIndex]}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: idx === activeImageIndex ? '2px solid #38bdf8' : '2px solid transparent',
                                        opacity: idx === activeImageIndex ? 1 : 0.6,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`} style={{ marginBottom: '1rem' }}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{product.name}</h2>
                        <h3 style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 500 }}>{product.brand}</h3>
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1.5rem 0' }}>
                        ₹{product.price}
                    </div>

                    <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        {product.description}
                    </p>

                    {product.features && product.features.length > 0 && (
                        <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '0.5rem' }}>
                            <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Product Features</h4>
                            <ul style={{ paddingLeft: '1.5rem', margin: 0, color: 'var(--text-secondary)' }}>
                                {product.features.map((feature, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={() => addToCart(product)}
                                disabled={isSoldOut}
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
                            >
                                <ShoppingCart size={20} /> {isSoldOut ? 'Unavailable' : 'Add to Booking'}
                            </button>

                            {inCartQty > 0 && (
                                <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#38bdf8' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{inCartQty}</div>
                                    <span style={{ fontSize: '0.8rem' }}>in cart</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
