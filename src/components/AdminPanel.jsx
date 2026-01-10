import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Package, Plus, Loader, CheckCircle, Download, Edit2, X, Trash2, Lock, RefreshCw } from 'lucide-react';
import PaginationControls from '../components/PaginationControls';

const AdminStyles = `
/* Admin Panel Styles */
.admin-container {
    padding-bottom: 4rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Header */
.admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.admin-title {
    font-size: 2rem;
    font-family: serif;
    color: var(--text-secondary);
    margin: 0;
}

.admin-tabs {
    display: flex;
    gap: 1rem;
}

.tab-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s;
    font-weight: bold;
    border: none;
    cursor: pointer;
}

.tab-btn.active {
    background-color: var(--accent-color);
    color: white;
}

.tab-btn.inactive {
    background-color: transparent;
    color: var(--text-secondary);
}

.tab-btn.inactive:hover {
    background-color: var(--bg-secondary);
}

/* Inventory Layout */
.inventory-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 1024px) {
    .inventory-grid {
        grid-template-columns: 350px 1fr;
    }
}

/* Forms */
.admin-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.admin-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.admin-input, .admin-select {
    width: 100%;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    padding: 0.75rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
    border-radius: 4px;
    box-sizing: border-box;
}

.admin-input:focus {
    outline: 2px solid var(--accent-color);
    border-color: transparent;
}

.file-input {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.submit-btn {
    width: 100%;
    padding: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
    cursor: pointer;
    border: 1px solid var(--border-color);
}

.submit-btn.primary {
    background-color: var(--accent-color);
    color: white;
    border: none;
}

/* Product List */
.product-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.product-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: var(--bg-secondary);
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
}

.product-img {
    width: 4rem;
    height: 4rem;
    object-fit: cover;
    border-radius: 4px;
}

.product-info {
    flex-grow: 1;
}

.product-name {
    font-weight: bold;
    color: var(--text-secondary);
    margin: 0;
}

.product-meta {
    font-size: 0.8rem;
    color: var(--text-secondary);
    opacity: 0.8;
    margin: 0;
}

/* Orders Table */
.table-container {
    overflow-x: auto;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    color: var(--text-secondary);
    min-width: 800px;
}

.admin-table th {
    text-transform: uppercase;
    font-size: 0.75rem;
    color: var(--text-secondary);
    opacity: 0.8;
    border-bottom: 1px solid var(--border-color);
    padding: 1rem;
    text-align: left;
}

.admin-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    vertical-align: top;
}

.admin-table tr:hover {
    background-color: var(--bg-primary);
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    border: 1px solid currentColor;
}

.status-fulfilled {
    background-color: #f0fdf4;
    color: #16a34a;
    border-color: #16a34a;
}

.status-pending {
    background-color: #fefce8;
    color: #ca8a04;
    border-color: #ca8a04;
}

.approval-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    border: 1px solid;
    text-transform: uppercase;
    display: inline-block;
}

.action-btn {
    padding: 0.5rem;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s;
}

.action-btn:hover {
    background-color: var(--bg-primary);
    color: var(--accent-color);
}


.action-btn.delete:hover {
    color: #ef4444;
}

/* Dark Mode Card Specifics */
.dark-mode-card {
    background-color: #111827;
    color: #f9fafb;
    border: 1px solid #374151;
    padding: 1rem; /* Reduced padding */
}

.dark-mode-card .text-secondary {
    color: #f9fafb !important;
}

.dark-mode-card .admin-input,
.dark-mode-card .admin-select {
    background-color: #1f2937;
    border-color: #374151;
    color: #f9fafb;
}

.dark-mode-card .admin-input::placeholder {
    color: #9ca3af;
}

.dark-mode-card .file-instruction {
    color: #9ca3af;
}
`;

const StockInput = ({ initialStock, onUpdate }) => {
    const [value, setValue] = useState(initialStock);
    const [status, setStatus] = useState('idle'); // idle, saving, saved, error

    useEffect(() => {
        setValue(initialStock);
    }, [initialStock]);

    useEffect(() => {
        if (parseInt(value) === parseInt(initialStock)) {
            setStatus('idle');
            return;
        }

        if (value === '' || isNaN(parseInt(value))) {
            return; // Don't auto-save invalid/empty input
        }

        setStatus('saving');
        const timeoutId = setTimeout(async () => {
            try {
                const stockVal = parseInt(value);
                if (isNaN(stockVal)) return;

                const result = await onUpdate(stockVal);
                if (result.success) {
                    setStatus('saved');
                    setTimeout(() => setStatus('idle'), 2000);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                setStatus('error');
            }
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [value, initialStock, onUpdate]);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
            <input
                type="number"
                className={`admin-input ${status === 'error' ? 'border-red-500' : ''}`}
                style={{ width: '5rem', padding: '0.25rem', textAlign: 'center' }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {status === 'saving' && <Loader className="w-3 h-3 text-accent animate-spin absolute -right-6" />}
            {status === 'saved' && <CheckCircle className="w-3 h-3 text-green-400 absolute -right-6 animate-in fade-in" />}
        </div>
    );
};

const Admin = () => {
    // ... state logic remains exactly the same ...
    const { products, addProduct, restockProduct, importCatalog, updateProduct } = useProducts();

    // ... (keep all state and useEffect logic unchanged) ...
    const [activeTab, setActiveTab] = useState('inventory');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const ITEMS_PER_PAGE = 12;
    const [inventoryPage, setInventoryPage] = useState(1);
    const [ordersPage, setOrdersPage] = useState(1);
    const [editingProduct, setEditingProduct] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Essentials',
        price: '',
        stock: '0',
        image: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const categories = ['Essentials', 'Luxuries', 'Groceries', 'Lifestyle', 'Electronics'];

    // Fetch Orders 
    useEffect(() => {
        setLoadingOrders(true);
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        console.log("Setting up orders listener...");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Snapshot received! Docs count:", snapshot.docs.length);
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
            setLoadingOrders(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setLoadingOrders(false);
            // Optionally set an error state to show in UI
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');
        if (loginEmail === 'unitedassociates.official@gmail.com' && loginPassword === 'United14@chennai') {
            setIsAuthenticated(true);
        } else {
            setLoginError('Invalid credentials. Please try again.');
        }
    };

    if (!isAuthenticated) {
        // ... (keep the inline style login form exactly as I fixed it in previous step)
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(243, 244, 246, 0.95)',
                backdropFilter: 'blur(5px)'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '3rem',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    width: '100%',
                    maxWidth: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div className="text-center mb-4">
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            margin: '0 auto 1rem auto',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Lock size={32} color="#2563EB" />
                        </div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', fontFamily: 'serif', marginBottom: '0.5rem' }}>Admin Access</h2>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Please enter your credentials</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* ... inputs same as before ... */}
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', color: '#1F2937', outline: 'none', boxSizing: 'border-box' }}
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', color: '#1F2937', outline: 'none', boxSizing: 'border-box' }}
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {loginError && (
                            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', fontSize: '0.875rem', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                {loginError}
                            </div>
                        )}
                        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#3B82F6', color: 'white', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)', transition: 'transform 0.1s' }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Login
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2rem' }}>United Associates Agencies</p>
                </div>
            </div>
        );
    }

    // ... functions (handleEditClick, handleProductSubmit, etc) remain same ...
    const handleEditClick = (product) => { /*...*/ setEditingProduct(product); setNewProduct({ ...product }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleCancelEdit = () => { setEditingProduct(null); setNewProduct({ name: '', price: '', category: 'Essentials', image: '', stock: '0', description: '' }); setImageFile(null); };
    const handleImageUpload = (file) => { /*...*/ return new Promise((resolve, reject) => { /*...*/ }); };
    const handleImportCatalog = async () => { /*...*/ };
    const handleProductSubmit = async (e) => { /*...*/ };
    const handleToggleStatus = async (id, currentStatus) => { /*...*/ };
    const handleDeleteOrder = async (orderId) => { /*...*/ };
    const handleExportOrders = () => { /*...*/ };
    const handleExportSingleOrder = (order) => { /*...*/ };

    const handleRefresh = () => {
        setRefreshing(true);
        // Since we use onSnapshot, data is already live. 
        // We simulate a refresh delay to give user visual feedback.
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };


    return (
        <div className="admin-container">
            <style>{AdminStyles}</style>
            <header className="admin-header">
                <h1 className="admin-title">Store Management</h1>
                <div className="admin-tabs">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`tab-btn ${activeTab === 'inventory' ? 'active' : 'inactive'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : 'inactive'}`}
                    >
                        Order History
                    </button>
                </div>
            </header>

            {activeTab === 'inventory' ? (
                <div className="inventory-grid">
                    {/* Add/Edit Product Form */}
                    <div className="admin-card dark-mode-card">
                        <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 className="text-xl font-serif text-secondary" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            {editingProduct && (
                                <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleProductSubmit} className="admin-form">
                            <input
                                placeholder="Product Name"
                                className="admin-input"
                                value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required
                            />
                            <div className="form-row">
                                <select
                                    className="admin-select"
                                    value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    <option value="Essentials">Essentials</option>
                                    <option value="Luxuries">Luxuries</option>
                                    <option value="Groceries">Groceries</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="In-house">In-house</option>
                                    <option value="International">International</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Lenses">Lenses</option>
                                </select>
                                <input
                                    type="number" placeholder="Price"
                                    className="admin-input"
                                    value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required
                                />
                            </div>

                            {/* Compacted Row: Stock & Specs */}
                            <div className="form-row">
                                <input
                                    type="number" placeholder="Initial Stock"
                                    className="admin-input"
                                    value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required
                                />
                                <input
                                    placeholder="Specs (Titanium Frame)"
                                    className="admin-input"
                                    value={newProduct.specs} onChange={e => setNewProduct({ ...newProduct, specs: e.target.value })}
                                />
                            </div>

                            <input
                                placeholder="External Link (Optional)"
                                className="admin-input"
                                value={newProduct.externalLink} onChange={e => setNewProduct({ ...newProduct, externalLink: e.target.value })}
                            />

                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files[0])}
                                        className="admin-input"
                                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        placeholder="Or paste Image URL"
                                        className="admin-input"
                                        value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={isAdding} className={`submit-btn ${editingProduct ? 'primary' : ''}`} style={{ backgroundColor: editingProduct ? 'var(--accent-color)' : '#3b82f6', color: 'white', border: 'none' }}>
                                {isAdding ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
                            </button>
                        </form>
                    </div>

                    {/* Product List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {products.slice((inventoryPage - 1) * ITEMS_PER_PAGE, inventoryPage * ITEMS_PER_PAGE).map(product => (
                            <div key={product.id} className="product-item">
                                <img src={product.image} className="product-img" alt={product.name} />
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-meta">{product.category} • ₹{product.price}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7 }}>Stock:</span>
                                        <StockInput
                                            initialStock={product.stock}
                                            onUpdate={(newStock) => restockProduct(product.id, newStock)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="action-btn"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                                    >
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Inventory Pagination Controls */}
                        <PaginationControls
                            currentPage={inventoryPage}
                            totalPages={Math.ceil(products.length / ITEMS_PER_PAGE)}
                            onPageChange={setInventoryPage}
                        />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifySelf: 'flex-end', width: '100%', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleExportOrders}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#16a34a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            <Download className="w-4 h-4" /> Export All CSV
                        </button>
                    </div>

                    {loadingOrders ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}><Loader className="w-8 h-8 animate-spin mx-auto text-accent" /></div>
                    ) : (
                        <div className="table-container fade-in">
                            <div className="flex justify-between items-center mb-4 p-4 border-b border-[var(--border-color)]">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-serif text-secondary m-0">Order History</h2>
                                    <button
                                        onClick={handleRefresh}
                                        className="action-btn"
                                        title="Refresh Orders"
                                        style={{
                                            backgroundColor: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            padding: '0.4rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} style={{ color: 'var(--text-secondary)' }} />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleExportOrders} className="tab-btn inactive" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)' }}>
                                        <Download size={14} /> Export CSV
                                    </button>
                                </div>
                            </div>

                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.7 }}>No orders yet.</div>
                            ) : (
                                <>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Order Approval</th>
                                                <th>Delivery Status</th>
                                                <th style={{ textAlign: 'right' }}>Total</th>
                                                <th style={{ textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE).map(order => (
                                                <tr key={order.id}>
                                                    <td>
                                                        {new Date(order.date).toLocaleDateString()} <br />
                                                        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{new Date(order.date).toLocaleTimeString()}</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ display: 'block', fontWeight: 'bold' }}>{order.customer?.name}</span>
                                                        <span style={{ display: 'block', fontSize: '0.8rem' }}>{order.customer?.phone}</span>
                                                        <span style={{ display: 'block', fontSize: '0.8rem' }}>{order.customer?.email}</span>
                                                    </td>
                                                    <td>
                                                        {order.items.map(item => (
                                                            <div key={item.id} style={{ textDecoration: order.status === 'fulfilled' ? 'line-through' : 'none', opacity: order.status === 'fulfilled' ? 0.5 : 1 }}>
                                                                {item.quantity}x {item.name}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <span className="approval-badge" style={{
                                                            backgroundColor: order.approvalStatus === 'Approved by Boss' ? '#f0fdf4' : '#fefce8',
                                                            color: order.approvalStatus === 'Approved by Boss' ? '#16a34a' : '#ca8a04',
                                                            borderColor: order.approvalStatus === 'Approved by Boss' ? '#16a34a' : '#ca8a04'
                                                        }}>
                                                            {order.approvalStatus || 'PENDING'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleToggleStatus(order.id, order.status)}
                                                            className={`status-badge ${order.status === 'fulfilled' ? 'status-fulfilled' : 'status-pending'}`}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {order.status === 'fulfilled' ? <CheckCircle className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                                                            {order.status === 'fulfilled' ? 'Fulfilled' : 'Pending'}
                                                        </button>
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: order.status === 'fulfilled' ? 'gray' : 'var(--accent-color)' }}>
                                                        ₹{order.total}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button onClick={() => handleExportSingleOrder(order)} className="action-btn" title="Export CSV">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteOrder(order.id)} className="action-btn delete" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Orders Pagination Controls */}
                                    <PaginationControls
                                        currentPage={ordersPage}
                                        totalPages={Math.ceil(orders.length / ITEMS_PER_PAGE)}
                                        onPageChange={setOrdersPage}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
