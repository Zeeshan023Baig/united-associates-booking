import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Header({ cartCount }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const toggleMenu = () => {
        if (isMobileMenuOpen) {
            // Closing functionality - Go to Home
            setIsMobileMenuOpen(false);
            navigate('/');
        } else {
            // Opening functionality
            setIsMobileMenuOpen(true);
        }
    };

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
                            <img
                                src={theme === 'light' ? "/logo_light_new.jpg" : "/logo_dark_new.png"}
                                alt="United Associates Agencies"
                                className="brand-logo"
                                style={{
                                    height: '50px',
                                    objectFit: 'contain',
                                    borderRadius: theme === 'light' ? '8px' : '0' // Optional: rounded corners for the card-like jpg
                                }}
                            />
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
                        <a href="https://uaastore.vercel.app/catalog" className="nav-link" target="_blank" rel="noopener noreferrer">Booking Request</a>
                        <span className="nav-divider">|</span>
                        <Link to="/cart" className="nav-link booking-link">
                            Cart ({cartCount || 0})
                        </Link>

                        {/* Theme Toggle After Booking Request */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                marginLeft: '1.5rem',
                                color: 'var(--header-text)',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: 0.8,
                                transition: 'opacity 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>

                    {/* Mobile Controls (Visible ONLY on Mobile) */}
                    <div className="mobile-controls hide-on-desktop">
                        <button className="theme-toggle-btn-mobile" onClick={toggleTheme}>
                            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                        </button>
                        <button className="mobile-toggle-btn" onClick={toggleMenu}>
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* Mobile Logo for context */}
                    <div className="mobile-logo hide-on-desktop">
                        <Link to="/" className="mobile-brand">
                            <img
                                src={theme === 'light' ? "/logo_light_new.jpg" : "/logo_dark_new.png"}
                                alt="UAA"
                                style={{
                                    height: '40px',
                                    borderRadius: theme === 'light' ? '6px' : '0',
                                    objectFit: 'contain'
                                }}
                            />
                            <span className="mobile-tagline">Your Vision, Elevated.</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <button className="mobile-close-btn" onClick={toggleMenu}>
                    <X size={28} />
                </button>
                <div className="mobile-nav-links">
                    <Link to="/" onClick={closeMenu}>Home</Link>
                    <Link to="/about" onClick={closeMenu}>About Us</Link>
                    <Link to="/catalog" onClick={closeMenu}>Catalog</Link>
                    <Link to="/brands" onClick={closeMenu}>Brands</Link>
                    <Link to="/why-us" onClick={closeMenu}>Why Us</Link>
                    <Link to="/contact" onClick={closeMenu}>Contact</Link>
                    <Link to="/cart" onClick={closeMenu}>Cart</Link>
                </div>
            </div>

            <style>{`
                /* Header Container */
                /* Header Position Fix: Relative so it scrolls away */
                .site-header {
                    position: relative; 
                    top: 0;
                    z-index: 1000;
                    background-color: var(--bg-header);
                    color: var(--header-text);
                    font-family: 'Outfit', sans-serif;
                    border-bottom: 1px solid var(--border-color);
                    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
                }

                /* Top Bar - Marquee */
                .top-bar {
                    background-color: var(--bg-secondary);
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                    padding: 0.5rem 0;
                    overflow: hidden;
                    border-bottom: 1px solid var(--border-color);
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
                    border-bottom: 1px solid var(--border-color);
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
                    color: var(--header-text);
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
                    color: var(--header-text);
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-decoration: none;
                    transition: color 0.2s ease;
                    white-space: nowrap;
                }
                .nav-link:hover {
                    color: var(--accent-color);
                }
                .nav-divider {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .booking-link {
                    /* Special style for booking if needed, currently same */
                }

                /* Theme Toggle Button Desktop */
                .theme-toggle-btn {
                    position: absolute;
                    right: 2rem;
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--header-text);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                .theme-toggle-btn:hover {
                    background-color: var(--bg-secondary);
                    border-color: var(--accent-color);
                    color: var(--accent-color);
                }

                /* Utility Classes */
                .hide-on-mobile {
                    display: flex;
                }
                .hide-on-desktop {
                    display: none;
                }

                /* Mobile Controls */
                .mobile-controls {
                    position: absolute;
                    right: 20px; /* Moved to right */
                    display: none; /* Hidden by default on desktop */
                    align-items: center;
                    gap: 15px;
                    z-index: 2002; /* Higher than overlay so it remains clickable */
                }

                /* Mobile Toggle */
                .mobile-toggle-btn {
                    background: none;
                    border: none;
                    color: var(--header-text);
                    cursor: pointer;
                    padding: 0;
                }
                .theme-toggle-btn-mobile {
                    background: none;
                    border: none;
                    color: var(--header-text);
                    cursor: pointer;
                    padding: 0;
                }
                
                .mobile-logo {
                    position: absolute;
                    left: 20px; /* Moved to left */
                    right: auto;
                    transform: none;
                    z-index: 2001;
                    display: flex;
                    justify-content: flex-start; /* Align start */
                    width: auto;
                    pointer-events: none;
                }
                @media (min-width: 769px) { /* Explicitly hide on desktop */
                    .mobile-logo { display: none !important; }
                }
                .mobile-brand {
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Align center */
                    text-decoration: none;
                    pointer-events: auto;
                }
                .mobile-tagline {
                    color: var(--header-text);
                    font-size: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-weight: 500;
                    margin-top: 2px;
                    opacity: 1; /* Increased opacity for clarity */
                    text-align: center; /* Ensure text is centered relative to the stack */
                }

                /* Responsive */
                @media (max-width: 768px) {
                     .hide-on-mobile {
                        display: none !important;
                     }
                     .hide-on-desktop {
                        display: block;
                     }
                     .mobile-controls {
                        display: flex;
                     }
                     .nav-content {
                        justify-content: center;
                     }
                }

                /* Mobile Menu Overlay */
                .mobile-nav-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: var(--bg-header);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                    backdrop-filter: blur(10px); /* Added blur for cleaner look */
                }
                .mobile-nav-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .mobile-close-btn {
                    display: none;
                }
                
                .mobile-nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem; /* Increased gap */
                    text-align: center;
                    width: 100%;
                    padding: 2rem;
                    box-sizing: border-box;
                }
                .mobile-nav-links a {
                    color: var(--header-text);
                    font-size: 1.5rem; /* Larger font */
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    opacity: 0.8;
                }
                .mobile-nav-links a:hover {
                    color: var(--accent-color);
                    opacity: 1;
                    transform: scale(1.05);
                }
            `}</style>
        </header>
    );
}
