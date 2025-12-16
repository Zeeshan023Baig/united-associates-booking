import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount }) {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="/logo_uaa.png" alt="United Associates Agencies" style={{ height: '70px' }} />
                    <span style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '0.05em',
                        marginTop: '2px',
                        fontWeight: '400',
                        textTransform: 'uppercase'
                    }}>Your Vision, Elevated.</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/catalog" className="btn btn-outline" style={{ border: 'none' }}>
                        Catalog
                    </Link>
                    <Link to="/stores" className="btn btn-outline" style={{ border: 'none' }}>
                        Stores
                    </Link>
                    <Link to="/booking" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}>
                        <ShoppingBag size={20} />
                        <span>Booking Request ({cartCount})</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
