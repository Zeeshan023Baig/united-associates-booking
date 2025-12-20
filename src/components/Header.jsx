import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="container nav-content" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '90px' }}>
                <Link to="/" className="nav-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 101, marginLeft: '-1rem' }}>
                    <img src="/logo_uaa.png" alt="United Associates Agencies" style={{ height: '70px' }} />
                    <span style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '0.05em',
                        marginTop: '2px',
                        fontWeight: '400',
                        textTransform: 'uppercase',
                        paddingLeft: '5px'
                    }}>Your Vision, Elevated.</span>
                </Link>

                {/* Desktop Navigation - Centered Absolute */}
                <div className="desktop-nav hide-on-mobile" style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3rem'
                }}>
                    <Link to="/catalog" className="btn btn-outline" style={{ border: 'none', fontSize: '1.3rem', fontWeight: '700' }}>
                        Catalog
                    </Link>
                    <Link to="/stores" className="btn btn-outline" style={{ border: 'none', fontSize: '1.3rem', fontWeight: '700' }}>
                        Stores
                    </Link>
                    <Link to="/booking" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', border: 'none', fontSize: '1.3rem', fontWeight: '700' }}>
                        <ShoppingBag size={26} />
                        <span>Booking Request ({cartCount})</span>
                    </Link>
                </div>

                {/* Spacer for right side layout balance or Account/Cart if needed later */}
                <div className="desktop-nav hide-on-mobile" style={{ width: '70px' }}></div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle" style={{ display: 'none' }}>
                    <button
                        onClick={toggleMenu}
                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.5rem' }}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    {/* Cart Icon for Mobile always visible */}
                    <Link to="/booking" style={{ color: 'white', marginLeft: '1rem', position: 'relative' }}>
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: 'var(--accent-color)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>{cartCount}</span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links">
                    <Link to="/catalog" onClick={closeMenu}>Catalog</Link>
                    <Link to="/stores" onClick={closeMenu}>Stores</Link>
                    <Link to="/booking" onClick={closeMenu}>Booking Request</Link>
                </div>
            </div>

            <style>{`
                .mobile-nav-overlay {
                    display: none;
                }

                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-toggle {
                        display: flex !important;
                        align-items: center;
                        z-index: 102;
                    }
                    
                    .mobile-nav-overlay {
                        display: flex;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100vh;
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(10px);
                        z-index: 100;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s ease;
                    }
                    
                    .mobile-nav-overlay.open {
                        opacity: 1;
                        pointer-events: all;
                    }
                    
                    .mobile-nav-links {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                        text-align: center;
                    }
                    
                    .mobile-nav-links a {
                        font-size: 1.5rem;
                        color: white;
                        font-weight: 600;
                    }
                }
            `}</style>
        </nav>
    );
}
