import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { seedDatabase, clearDatabase } from '../utils/seed';
import { ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react';

export default function ModelCatalog({ addToCart }) {
    const { products, loading, error } = useInventory();

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading inventory...</div>;

    if (error) return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="glass-panel" style={{ borderColor: '#f87171' }}>
                <h3 style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle /> Connection Error
                </h3>
                <p>{error}</p>
                <p>Please ensure your Firebase configuration in <code>src/lib/firebase.js</code> is correct.</p>
            </div>
        </div>
    );

    if (products.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="glass-panel">
                    <h2>Catalog Initialization</h2>
                    <p>Database is empty. Initialize with demo data?</p>
                    <button onClick={async () => {
                        try {
                            await seedDatabase();
                            window.location.reload();
                        } catch (e) {
                            alert("Error seeding (Check Console): " + e.message);
                        }
                    }} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Load 10 Brand Examples
                    </button>
                </div>
            </div>
        );
    }

    const handleReset = async () => {
        if (!confirm("This will DELETE all current products/stock and reset to the 10 Demo Items. Continue?")) return;
        try {
            await clearDatabase(); // Clear old
            await seedDatabase();  // Add new
            window.location.reload();
        } catch (e) {
            alert("Error resetting: " + e.message);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <header style={{ padding: '4rem 0 2rem 0', textAlign: 'center', position: 'relative' }}>
                <h1>Unitder Associates</h1>
                <p style={{ fontSize: '1.2rem' }}>Premium Optical Collection</p>

                <button onClick={handleReset} className="btn btn-outline" style={{ position: 'absolute', top: '1rem', right: '0', fontSize: '0.8rem' }}>
                    <RefreshCw size={14} style={{ marginRight: '0.5rem' }} /> Reset Catalog
                </button>
            </header>

            <div className="product-grid">
                {products.map(product => {
                    const isSoldOut = product.stock <= 0;
                    return (
                        <div key={product.firebaseId} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0', overflow: 'hidden' }}>
                            {/* Image Area */}
                            <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#000' }}>
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>No Image</div>
                                )}
                            </div>

                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{product.brand}</div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{product.name}</h3>
                                    </div>
                                    <span className={`badge ${isSoldOut ? 'badge-danger' : product.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                                        {isSoldOut ? 'SOLD OUT' : `Stock: ${product.stock}`}
                                    </span>
                                </div>

                                <p style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{product.description}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${product.price}</span>

                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={isSoldOut}
                                        className="btn btn-primary"
                                        style={{ opacity: isSoldOut ? 0.5 : 1 }}
                                    >
                                        {isSoldOut ? 'Unavailable' : 'Book Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
