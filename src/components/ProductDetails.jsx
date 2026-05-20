import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Heart, ZoomIn } from 'lucide-react';

export default function ProductDetails({ addToCart, cart = [], updateQuantity, removeFromCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { products, loading } = useInventory();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const previousState = location.state || {};

    if (loading) return (
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading...
        </div>
    );

    const product = products.find(p => p.firebaseId === id);

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Product Not Found</h2>
                <button onClick={() => navigate('/catalog')} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to Catalog
                </button>
            </div>
        );
    }

    const isSoldOut = product.stock <= 0;
    const isLowStock = !isSoldOut && product.stock < 10;
    const cartItem = cart.find(c => c.firebaseId === product.firebaseId);
    const inCartQty = cartItem ? cartItem.quantity : 0;
    const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl || product.image];

    const faceShapes = product.faceShape
        ? (Array.isArray(product.faceShape) ? product.faceShape : [product.faceShape])
        : [];

    const allFaceShapes = ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond'];

    return (
        <div style={{ paddingTop: '5rem', paddingBottom: '4rem', background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/catalog', { state: previousState })}
                    className="btn btn-outline"
                    style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                >
                    <ArrowLeft size={16} /> Back to Catalog
                </button>

                {/* Main Product Panel */}
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '3rem', alignItems: 'start' }}>

                        {/* Left: Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '4/3',
                                borderRadius: '0.75rem',
                                overflow: 'hidden',
                                background: '#0d0d0d',
                                marginBottom: '1rem',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                position: 'relative',
                                cursor: 'zoom-in'
                            }}>
                                <img
                                    src={images[activeImageIndex]}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={e => { e.target.src = 'https://via.placeholder.com/600x450?text=No+Image'; }}
                                />
                                {/* Stock badge overlay */}
                                {isLowStock && (
                                    <div style={{
                                        position: 'absolute', top: '1rem', left: '1rem',
                                        background: '#fbbf24', color: '#000',
                                        padding: '0.3rem 0.8rem', borderRadius: '50px',
                                        fontSize: '0.75rem', fontWeight: '700'
                                    }}>
                                        Low Stock
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute', bottom: '1rem', right: '1rem',
                                    background: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                                    padding: '0.5rem', display: 'flex', backdropFilter: 'blur(4px)'
                                }}>
                                    <ZoomIn size={18} color="white" />
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            style={{
                                                width: '80px', height: '80px', flexShrink: 0,
                                                borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                                                border: idx === activeImageIndex ? '2px solid var(--accent-color)' : '2px solid var(--border-color)',
                                                opacity: idx === activeImageIndex ? 1 : 0.5,
                                                transition: 'all 0.2s',
                                                background: '#0d0d0d'
                                            }}
                                        >
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Stock Status */}
                            <div style={{
                                fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
                                color: isSoldOut ? '#f87171' : '#4ade80'
                            }}>
                                {isSoldOut ? '✗ Out of Stock' : '✓ In Stock'}
                            </div>

                            {/* Name & Brand */}
                            <div>
                                <h1 style={{ fontSize: '2.2rem', fontWeight: '700', margin: '0 0 0.25rem', lineHeight: 1.2, color: 'var(--text-primary)' }}>
                                    {product.name}
                                </h1>
                                <div style={{ fontSize: '1.1rem', color: 'var(--accent-color)', fontWeight: '500' }}>
                                    {product.brand}
                                </div>
                            </div>

                            {/* Price */}
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                ₹{product.price}
                            </div>

                            {/* Size Specs */}
                            {(product.lensWidth || product.bridgeWidth || product.templeLength || product.frameWidth) && (
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Lens', value: product.lensWidth, unit: 'mm' },
                                        { label: 'Bridge', value: product.bridgeWidth, unit: 'mm' },
                                        { label: 'Temple', value: product.templeLength, unit: 'mm' },
                                        { label: 'Frame', value: product.frameWidth, unit: 'mm' },
                                    ].filter(s => s.value).map(({ label, value, unit }) => (
                                        <div key={label} style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            padding: '0.5rem 0.9rem',
                                            background: 'rgba(99,102,241,0.1)',
                                            border: '1px solid rgba(99,102,241,0.3)',
                                            borderRadius: '0.5rem',
                                            minWidth: '64px'
                                        }}>
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{value}{unit}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-secondary)', margin: 0, paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                                    {product.description}
                                </p>
                            )}

                            {/* Face Shape */}
                            {faceShapes.length > 0 && (
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>Best For:</strong>{' '}
                                    {faceShapes.join(', ')} face shapes
                                </div>
                            )}

                            {/* Category / Origin tags */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {product.category && (
                                    <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600' }}>
                                        {product.category}
                                    </span>
                                )}
                                {product.origin && (
                                    <span style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                                        {product.origin === 'in-house' ? '🏠 In-House' : product.origin === 'international' ? '🌍 International' : '🇮🇳 Domestic'}
                                    </span>
                                )}
                            </div>

                            {/* Quantity + Add to Cart */}
                            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                                {inCartQty > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {/* Quantity Selector */}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Quantity</div>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '1.5rem',
                                                border: '1px solid var(--border-color)', borderRadius: '50px',
                                                padding: '0.5rem 1.5rem',
                                                background: 'rgba(255,255,255,0.03)'
                                            }}>
                                                <button
                                                    onClick={() => { if(inCartQty === 1) { if(removeFromCart) removeFromCart(product.firebaseId); } else { if(updateQuantity) updateQuantity(product.firebaseId, -1); } }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-primary)', padding: 0 }}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent-color)', minWidth: '24px', textAlign: 'center' }}>{inCartQty}</span>
                                                <button
                                                    onClick={() => { if(updateQuantity) updateQuantity(product.firebaseId, 1); }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-primary)', padding: 0 }}
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: '500' }}>
                                            ✓ {inCartQty} item{inCartQty > 1 ? 's' : ''} in your cart
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={isSoldOut}
                                        className="btn btn-primary"
                                        style={{
                                            width: '100%', padding: '1rem', fontSize: '1.1rem',
                                            justifyContent: 'center', display: 'flex', alignItems: 'center',
                                            gap: '0.5rem', borderRadius: '0.5rem',
                                            opacity: isSoldOut ? 0.5 : 1,
                                            cursor: isSoldOut ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <ShoppingCart size={20} />
                                        {isSoldOut ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Info Panels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                    {/* Size Guide */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1rem' }}>Size Guide</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>These measurements help you find the perfect fit.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            {[
                                { label: 'Lens Width', value: product.lensWidth ? `${product.lensWidth}mm` : '—' },
                                { label: 'Bridge Width', value: product.bridgeWidth ? `${product.bridgeWidth}mm` : '—' },
                                { label: 'Temple Length', value: product.templeLength ? `${product.templeLength}mm` : '—' },
                                { label: 'Frame Width', value: product.frameWidth ? `${product.frameWidth}mm` : '—' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{value}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best For Face Shapes */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '0.5rem' }}>Best For Face Shapes</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>These frame shapes suit you best.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                            {allFaceShapes.map(shape => {
                                const isMatch = faceShapes.some(f => f.toLowerCase() === shape.toLowerCase());
                                return (
                                    <div key={shape} style={{
                                        textAlign: 'center', padding: '0.75rem 0.5rem',
                                        background: isMatch ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                                        borderRadius: '0.5rem',
                                        border: isMatch ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border-color)',
                                        opacity: isMatch ? 1 : 0.4
                                    }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: isMatch ? '#818cf8' : 'var(--text-secondary)' }}>{shape}</div>
                                        {isMatch && <div style={{ fontSize: '0.65rem', color: '#818cf8', marginTop: '0.15rem' }}>✓</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Why You'll Love It */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1rem' }}>Why You'll Love It</h3>
                        {product.features && product.features.length > 0 ? (
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {product.features.map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        <span style={{ color: 'var(--accent-color)', fontSize: '1rem' }}>✦</span> {f}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['Lightweight & Comfortable', 'Premium Quality Frames', 'Classic Design, Everyday Style', 'Unisex – For Everyone'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        <span style={{ color: 'var(--accent-color)', fontSize: '1rem' }}>✦</span> {f}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Responsive Styles */}
                <style>{`
                    @media (max-width: 768px) {
                        .glass-panel > div[style*="grid-template-columns"] {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}

