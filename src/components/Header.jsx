import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount }) {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-brand">
                    Unitder Associates
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/booking" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}>
                        <ShoppingBag size={20} />
                        <span>Booking Request ({cartCount})</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
