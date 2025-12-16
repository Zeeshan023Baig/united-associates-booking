import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Shield, Truck } from 'lucide-react';

export default function Home() {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    United Associates Agencies
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                    Explore the world's finest optical collection. Premium eyewear for the modern visionary.
                </p>
                <Link to="/catalog" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
                    <ShoppingBag size={24} style={{ marginRight: '0.5rem' }} /> Browse Catalog
                </Link>
            </section>

            {/* Features Grid */}
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <Eye size={32} color="#38bdf8" />
                    </div>
                    <h3>Premium Lenses</h3>
                    <p>Crystal clear vision with our state-of-the-art scratch resistant and anti-glare coatings.</p>
                </div>

                <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ background: 'rgba(129, 140, 248, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <Shield size={32} color="#818cf8" />
                    </div>
                    <h3>Authenticity Guaranteed</h3>
                    <p>Direct partnerships with top brands including Ray-Ban, Oakley, and Maui Jim.</p>
                </div>

                <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ background: 'rgba(52, 211, 153, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <Truck size={32} color="#34d399" />
                    </div>
                    <h3>Fast Fulfillment</h3>
                    <p>Real-time inventory visualization across all our agency branches and swift dispatch.</p>
                </div>
            </div>
        </div>
    );
}
