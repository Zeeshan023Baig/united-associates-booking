import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount }) {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.jpg" alt="United Associates Agencies" style={{ height: '50px' }} />
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/catalog" className="btn btn-outline" style={{ border: 'none' }}>
                        Catalog
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
