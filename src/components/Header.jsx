import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="site-header">
            {/* Top Announcement Bar - Marquee */}
            <div className="top-bar">
                <div className="marquee-container">
                    <div className="marquee-content">
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                        <span>Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; Premium Optics &nbsp;&bull;&nbsp; Free Shipping &nbsp;&bull;&nbsp; 10+ years &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="navbar">
                <div className="container nav-content">
                    {/* Left: Logo & Tagline */}
                    <div className="nav-left hide-on-mobile">
                        <Link to="/" className="nav-brand">
                            <img src="/logo_uaa.png" alt="United Associates Agencies" className="brand-logo" />
                            <span className="brand-tagline">Your Vision, Elevated.</span>
                        </Link>
                    </div>

                    {/* Centered Navigation Links */}
                    <div className="nav-center hide-on-mobile">
                        <Link to="/about" className="nav-link">About Us</Link>
                        <span className="nav-divider">|</span>
                        <Link to="/catalog" className="nav-link">Catalog</Link>
                        <span className="nav-divider">|</span>
                        <Link to="/brands" className="nav-link">Brands</Link>
                        <span className="nav-divider">|</span>
                        <Link to="/why-us" className="nav-link">Why Us</Link>
                        <span className="nav-divider">|</span>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <span className="nav-divider">|</span>
                        <Link to="/booking" className="nav-link booking-link">
                            Booking Request ({cartCount || 0})
                        </Link>
                    </div>

                    {/* Mobile Toggle (Visible on Mobile) */}
                    <button className="mobile-toggle-btn hide-on-desktop" onClick={toggleMenu}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    {/* Mobile Logo for context */}
                    <div className="mobile-logo hide-on-desktop">
                        <Link to="/">
                            <img src="/logo_uaa.png" alt="UAA" style={{ height: '40px' }} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links">
                    <Link to="/about" onClick={closeMenu}>About Us</Link>
                    <Link to="/catalog" onClick={closeMenu}>Catalog</Link>
                    <Link to="/brands" onClick={closeMenu}>Brands</Link>
                    <Link to="/why-us" onClick={closeMenu}>Why Us</Link>
                    <Link to="/contact" onClick={closeMenu}>Contact</Link>
                    <Link to="/booking" onClick={closeMenu}>Booking Request</Link>
                </div>
            </div>

            <style>{`
                /* Header Container */
                .site-header {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background-color: #000;
                    color: #fff;
                    font-family: 'Outfit', sans-serif;
                }

                /* Top Bar - Marquee */
                .top-bar {
                    background-color: #111;
                    color: #ccc;
                    font-size: 0.75rem;
                    padding: 0.5rem 0;
                    overflow: hidden;
                    border-bottom: 1px solid #222;
                }
                .marquee-container {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .marquee-content {
                    display: inline-block;
                    white-space: nowrap;
                    animation: marquee 30s linear infinite;
                }
                .marquee-content span {
                    display: inline-block;
                    padding-right: 2rem;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                /* Navbar Layout */
                .navbar {
                    height: 80px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #222;
                    justify-content: center;
                }
                .nav-content {
                    display: flex;
                    justify-content: center; /* Center content */
                    align-items: center;
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    position: relative;
                }

                /* Left: Logo & Tagline */
                .nav-left {
                    position: absolute;
                    left: 2rem;
                    display: flex;
                    align-items: center;
                }
                .nav-brand {
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Centered alignment */
                    text-decoration: none;
                }
                .brand-logo {
                    height: 50px;
                    width: auto;
                    margin-bottom: 4px; 
                }
                .brand-tagline {
                    color: #fff;
                    font-size: 0.7rem; 
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-weight: 500;
                    text-align: center;
                    opacity: 0.9;
                }

                /* Centered Navigation */
                .nav-center {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }
                .nav-link {
                    color: #fff;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-decoration: none;
                    transition: color 0.2s ease;
                    white-space: nowrap;
                }
                .nav-link:hover {
                    color: #aaa;
                }
                .nav-divider {
                    color: #444;
                    font-size: 0.9rem;
                }
                .booking-link {
                    /* Special style for booking if needed, currently same */
                }


                /* Utility Classes */
                .hide-on-mobile {
                    display: flex;
                }
                .hide-on-desktop {
                    display: none;
                }

                /* Mobile Toggle */
                .mobile-toggle-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    position: absolute; /* Position absolute to not affect centering if we had other elements, effectively left aligned here */
                    left: 20px;
                }
                .mobile-logo {
                    position: absolute;
                    right: 20px;
                }

                /* Responsive */
                @media (max-width: 768px) {
                     .hide-on-mobile {
                        display: none;
                     }
                     .hide-on-desktop {
                        display: block;
                     }
                     .nav-content {
                        justify-content: center; /* Center items for mobile too */
                     }
                }

                /* Mobile Menu Overlay */
                .mobile-nav-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.98);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                .mobile-nav-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .mobile-nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    text-align: center;
                }
                .mobile-nav-links a {
                    color: #fff;
                    font-size: 1.4rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-decoration: none;
                }
            `}</style>
        </header>
    );
}
