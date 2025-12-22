import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { ArrowRight, Star, ShoppingCart, Filter, Search, RotateCcw, AlertCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { DATA_VERSION, clearDatabase, seedDatabase } from '../utils/seed';

export default function ModelCatalog({ addToCart, cart = [] }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { products, loading, error } = useInventory();

    // Navigation State - Initialize from SessionStorage
    // Navigation State
    const [viewMode, setViewMode] = useState(() => {
        if (location.pathname === '/') return 'main'; // Always show main categories on Home
        try {
            const saved = sessionStorage.getItem('catalog_state');
            return saved ? JSON.parse(saved).viewMode : 'main';
        } catch { return 'main'; }
    });

    // Helper to safe-parse storage
    const getSavedState = (key) => {
        try {
            const saved = sessionStorage.getItem('catalog_state');
            return saved ? JSON.parse(saved)[key] : null;
        } catch { return null; }
    };

    const [selectedCategory, setSelectedCategory] = useState(() => getSavedState('selectedCategory'));
    const [selectedOrigin, setSelectedOrigin] = useState(() => getSavedState('selectedOrigin'));

    // Advanced Filters
    const [filters, setFilters] = useState(() => getSavedState('filters') || { faceShape: '', frameShape: '', size: '' });
    const [filterBrand, setFilterBrand] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Persist State Changes
    useEffect(() => {
        const stateToSave = { viewMode, selectedCategory, selectedOrigin, filters };
        sessionStorage.setItem('catalog_state', JSON.stringify(stateToSave));
    }, [viewMode, selectedCategory, selectedOrigin, filters]);

    // Auto-refresh data if version changes
    useEffect(() => {
        const checkDataVersion = async () => {
            const currentVersion = localStorage.getItem('catalog_version');
            if (currentVersion !== DATA_VERSION) {
                console.log("New catalog version detected. Refreshing data...");
                await clearDatabase();
                await seedDatabase();
                localStorage.setItem('catalog_version', DATA_VERSION);
                window.location.reload();
            }
        };
        checkDataVersion();
    }, []);

    // Handle incoming navigation from Home (Deep Links Override Storage)
    useEffect(() => {
        if (location.state?.startCategory) {
            setSelectedCategory(location.state.startCategory);
            setViewMode('subcategory');
        }
    }, [location]);

    // Reset view when products change or on mount
    useEffect(() => {
        if (!loading && products.length === 0) {
            // allow seed view
        }
    }, [products, loading]);

    const handleCategorySelect = (category) => {
        if (location.pathname === '/') {
            navigate('/catalog', { state: { startCategory: category } });
            window.scrollTo(0, 0);
        } else {
            setSelectedCategory(category);
            setViewMode('subcategory');
        }
    };

    const handleOriginSelect = (origin) => {
        setSelectedOrigin(origin);
        setViewMode('products');
    };

    const goBack = () => {
        if (viewMode === 'products') {
            setViewMode('subcategory');
            setSelectedOrigin(null);
        } else if (viewMode === 'subcategory') {
            if (location.state?.startCategory) {
                navigate('/');
            } else {
                setViewMode('main');
                setSelectedCategory(null);
            }
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading inventory...</div>;

    if (error) return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="glass-panel" style={{ borderColor: '#f87171' }}>
                <h3 style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle /> Connection Error
                </h3>
                <p>{error}</p>
            </div>
        </div>
    );

    // Initial Seeding View if Empty
    if (products.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="glass-panel">
                    <h2>Catalog Initialization</h2>
                    <p>Database is empty. Initialize with categorized data?</p>
                    <button onClick={async () => {
                        try {
                            await seedDatabase();
                            window.location.reload();
                        } catch (e) {
                            alert("Error seeding: " + e.message);
                        }
                    }} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Load Categorized Inventory
                    </button>
                </div>
            </div>
        );
    }

    const filteredProducts = products.filter(p => {
        const matchCategory = p.category === selectedCategory && p.origin === selectedOrigin;
        if (!matchCategory) return false;

        const matchFace = !filters.faceShape || p.faceShape === filters.faceShape;
        const matchFrame = !filters.frameShape || p.frameShape === filters.frameShape;
        const matchSize = !filters.size || p.size === filters.size;

        return matchFace && matchFrame && matchSize;
    });

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>

            {/* Header & Breadcrumbs / Back Button */}
            <header style={{ padding: '0 0 2rem 0', textAlign: 'center', position: 'relative' }}>
                {viewMode !== 'main' && (
                    <button onClick={goBack} className="btn btn-outline" style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                )}

                <h1>
                    {viewMode === 'main' && "United Collections"}
                    {viewMode === 'subcategory' && (selectedCategory === 'brand' ? "Brands" : "Lenses")}
                    {viewMode === 'products' && (selectedOrigin === 'in-house' ? "In-House Collection" : selectedOrigin === 'international' ? "International Collection" : "Indian Collection")}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'absolute', top: 0, right: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <ShoppingCart size={24} style={{ cursor: 'pointer' }} onClick={() => navigate('/booking')} />
                        {cart.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                background: '#38bdf8',
                                color: '#000',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>
                                {cart.length}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* LEVEL 1: MAIN SELECTION */}
            {viewMode === 'main' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Brands Card */}
                    <div
                        className="glass-panel"
                        onClick={() => handleCategorySelect('brand')}
                        style={{ padding: '3rem', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#38bdf8' }}>Brands</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Explore our curated collection of eyewear frames.</p>
                        <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', color: '#38bdf8' }}>
                            Browse Collection <ChevronRight size={20} />
                        </div>
                    </div>

                    {/* Lenses Card */}
                    <div
                        className="glass-panel"
                        onClick={() => handleCategorySelect('lens')}
                        style={{ padding: '3rem', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#a78bfa' }}>Lenses</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Advanced optical solutions for every vision need.</p>
                        <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', color: '#a78bfa' }}>
                            View Options <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            )}

            {/* LEVEL 2: ORIGIN SELECTION */}
            {viewMode === 'subcategory' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {['in-house', 'international', 'indian'].map(origin => (
                        <div
                            key={origin}
                            className="glass-panel"
                            onClick={() => handleOriginSelect(origin)}
                            style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                        >
                            <h3 style={{ textTransform: 'capitalize', fontSize: '1.5rem', marginBottom: '1rem' }}>
                                {origin.replace('-', ' ')} {selectedCategory === 'brand' ? 'Brands' : 'Lenses'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {origin === 'in-house' && "Our exclusive proprietary collection ensuring quality and value."}
                                {origin === 'international' && "World-renowned labels offering superior technology and style."}
                                {origin === 'indian' && "Trusted manufacturing excellence from leading Indian companies."}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* LEVEL 3: PRODUCT GRID */}
            {viewMode === 'products' && (
                <div className="flex-stack-mobile" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                    {/* Filter Sidebar */}
                    <div className="glass-panel w-full-mobile" style={{ width: '250px', padding: '1.5rem', height: 'fit-content', alignSelf: 'start' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Filters
                            {/* Clear Filters Button */}
                            {(filters.faceShape || filters.frameShape || filters.size) && (
                                <button
                                    onClick={() => setFilters({ faceShape: '', frameShape: '', size: '' })}
                                    style={{ fontSize: '0.7rem', marginLeft: 'auto', background: 'none', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Clear
                                </button>
                            )}
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Face Shape</label>
                            <select
                                value={filters.faceShape}
                                onChange={e => setFilters({ ...filters, faceShape: e.target.value })}
                                className="form-input"
                                style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}
                            >
                                <option value="">All</option>
                                <option value="oval">Oval</option>
                                <option value="round">Round</option>
                                <option value="square">Square</option>
                                <option value="heart">Heart</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Frame Shape</label>
                            <select
                                value={filters.frameShape}
                                onChange={e => setFilters({ ...filters, frameShape: e.target.value })}
                                className="form-input"
                                style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}
                            >
                                <option value="">All</option>
                                <option value="wayfarer">Wayfarer</option>
                                <option value="aviator">Aviator</option>
                                <option value="round">Round</option>
                                <option value="cat-eye">Cat Eye</option>
                                <option value="rectangle">Rectangle</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Size</label>
                            <select
                                value={filters.size}
                                onChange={e => setFilters({ ...filters, size: e.target.value })}
                                className="form-input"
                                style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}
                            >
                                <option value="">All</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div style={{ flex: 1 }}>
                        {filteredProducts.length === 0 ? (
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                                <h3>No items found in this section yet.</h3>
                                {(filters.faceShape || filters.frameShape || filters.size) && <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Try clearing some filters.</p>}
                                <button onClick={goBack} className="btn btn-outline" style={{ marginTop: '1rem' }}>Go Back</button>
                            </div>
                        ) : (
                            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                                {filteredProducts.map(product => {
                                    const isSoldOut = product.stock <= 0;
                                    return (
                                        <div
                                            key={product.id} // use id or firebaseId depending on what useInventory returns. useInventory usually maps doc.id to firebaseId
                                            onClick={() => navigate(`/product/${product.firebaseId || product.id}`)}
                                            className="glass-panel product-card"
                                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0', overflow: 'hidden' }}
                                        >
                                            <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#000' }}>
                                                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textTransform: 'uppercase' }}>{product.brand}</div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{product.name}</h3>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {product.faceShape && <span style={{ marginRight: '0.5rem' }}>Face: {product.faceShape}</span>}
                                                </div>

                                                {/* Stock & Cart Status */}
                                                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                                                    <span style={{ color: product.stock < 10 ? '#f87171' : '#4ade80' }}>
                                                        {product.stock} in stock
                                                    </span>
                                                    {cart.find(c => c.firebaseId === product.firebaseId)?.quantity > 0 && (
                                                        <span style={{ color: 'var(--accent-color)' }}>
                                                            In Cart: {cart.find(c => c.firebaseId === product.firebaseId).quantity}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{product.price}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                        disabled={isSoldOut}
                                                        className="btn btn-primary"
                                                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                                    >
                                                        {isSoldOut ? 'Sold Out' : 'Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
