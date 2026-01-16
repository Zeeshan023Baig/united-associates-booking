import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Package, Plus, Loader, CheckCircle, Download, Edit2, X, Trash2, Lock, RefreshCw } from 'lucide-react';
import PaginationControls from '../components/PaginationControls';
import './AdminPanel.css';

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
    const { products, addProduct, restockProduct, importCatalog, updateProduct } = useProducts();

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
        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        console.log("Setting up orders listener (bookings)...");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Snapshot received! Docs count:", snapshot.docs.length);
            const ordersData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Map 'bookings' fields to 'orders' schema expected by UI
                    date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.date || new Date().toISOString()),
                    customer: {
                        name: data.name || data.customer?.name || 'Unknown',
                        phone: data.phone || data.customer?.phone || '',
                        email: data.email || data.customer?.email || '',
                        addressLine1: data.addressLine1 || data.customer?.addressLine1 || data.company || data.customer?.company || data.customer?.StoreName || '', // Map new field with fallback
                        address: data.address || data.customer?.address || data.location || data.shippingAddress || data.deliveryAddress || data.fullAddress || data.customer?.branch || ''
                    },
                    total: data.totalPrice || data.total || 0,
                    status: data.status || 'pending',
                    source: data.source || 'Booking Request' // Default to Booking Request if missing
                };
            });
            setOrders(ordersData);
            setLoadingOrders(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setLoadingOrders(false);
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
        return (
            <div className="login-backdrop">
                <div className="login-card">
                    <div className="text-center mb-4">
                        <div className="login-icon-box">
                            <Lock size={32} color="#38bdf8" />
                        </div>
                        <h2 className="login-title">Admin Access</h2>
                        <p className="login-subtitle">Please enter your credentials</p>
                    </div>

                    <form onSubmit={handleLogin} className="admin-form">
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                className="admin-input"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                className="admin-input"
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
                        <button type="submit" className="submit-btn primary">
                            Login
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2rem' }}>United Associates Agencies</p>
                </div>
            </div>
        );
    }

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setNewProduct({ ...product });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setNewProduct({
            name: '',
            category: 'Essentials',
            price: '',
            stock: '0',
            image: '',
            description: ''
        });
        setImageFile(null);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, newProduct);
                setEditingProduct(null);
            } else {
                await addProduct(newProduct);
            }
            setNewProduct({
                name: '',
                category: 'Essentials',
                price: '',
                stock: '0',
                image: '',
                description: ''
            });
            setImageFile(null);
        } catch (error) {
            console.error("Error submitting product:", error);
            alert("Failed to save product");
        }
        setIsAdding(false);
    };


    const handleToggleStatus = async (orderId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'fulfilled' ? 'pending' : 'fulfilled';
            await updateDoc(doc(db, "bookings", orderId), {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteDoc(doc(db, "bookings", orderId));
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    const handleExportOrders = () => {
        const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Location', 'Items', 'Total', 'Status', 'Source'];
        const csvContent = [
            headers.join(','),
            ...orders.map(order => [
                order.id,
                new Date(order.date).toLocaleDateString(),
                `"${order.customer.name}"`,
                order.customer.phone,
                order.customer.email,
                `"${order.customer.address || ''}"`,
                `"${order.items.map(i => `${i.name} (x${i.quantity})`).join('; ')}"`,
                order.total,
                order.status,
                order.source
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleExportSingleOrder = (order) => {
        const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Location', 'Items', 'Total', 'Status', 'Source'];
        const csvContent = [
            headers.join(','),
            [
                order.id,
                new Date(order.date).toLocaleDateString(),
                `"${order.customer.name}"`,
                order.customer.phone,
                order.customer.email,
                `"${order.customer.address || ''}"`,
                `"${order.items.map(i => `${i.name} (x${i.quantity})`).join('; ')}"`,
                order.total,
                order.status,
                order.source
            ].join(',')
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-${order.id}.csv`;
        a.click();
    };

    const handleRefresh = () => {
        setRefreshing(true);
        // Since we use onSnapshot, data is already live. 
        // We simulate a refresh delay to give user visual feedback.
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };


    return (
        <div className="admin-wrapper">
            <div className="admin-container">
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
                        <div className="admin-card">
                            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 className="text-xl font-serif text-secondary" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                {editingProduct && (
                                    <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                        <X className="w-5 h-5" />
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

                                <button type="submit" disabled={isAdding} className={`submit-btn primary`}>
                                    {isAdding ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                            </form>
                        </div>

                        {/* Product List */}
                        <div className="product-list">
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
                        </div>

                        {loadingOrders ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><Loader className="w-8 h-8 animate-spin mx-auto text-accent" /></div>
                        ) : (
                            <div className="table-container fade-in">
                                <div className="flex justify-between items-center mb-4 p-4 border-b border-gray-700" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <h2 className="text-xl font-serif text-secondary m-0" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Order History</h2>
                                        <button
                                            onClick={handleRefresh}
                                            className="action-btn ml-2"
                                            title="Refresh Orders"
                                        >
                                            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleExportOrders}
                                        className="export-btn"
                                    >
                                        <Download className="w-4 h-4" /> Export All CSV
                                    </button>
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
                                                            {(order.customer?.addressLine1 || order.customer?.company) && (
                                                                <span style={{ display: 'block', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.2rem' }}>{order.customer.addressLine1 || order.customer.company}</span>
                                                            )}
                                                            {order.customer?.address && (
                                                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {order.customer.address}</span>
                                                            )}


                                                            {/* Source Badge */}
                                                            <span style={{
                                                                display: 'inline-block',
                                                                fontSize: '0.65rem',
                                                                padding: '0.1rem 0.4rem',
                                                                borderRadius: '4px',
                                                                marginTop: '0.25rem',
                                                                fontWeight: '600',
                                                                backgroundColor: order.source === 'Online Store' ? 'rgba(22, 163, 74, 0.1)' :
                                                                    order.source === 'Retailer' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(147, 51, 234, 0.1)',
                                                                color: order.source === 'Online Store' ? '#16a34a' :
                                                                    order.source === 'Retailer' ? '#3b82f6' : '#9333ea',
                                                                border: `1px solid ${order.source === 'Online Store' ? 'rgba(22, 163, 74, 0.2)' :
                                                                    order.source === 'Retailer' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(147, 51, 234, 0.2)'}`
                                                            }}>
                                                                {order.source || 'Booking Request'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {order.items.map(item => (
                                                                <div key={item.id} style={{ textDecoration: order.status === 'fulfilled' ? 'line-through' : 'none', opacity: order.status === 'fulfilled' ? 0.5 : 1 }}>
                                                                    {item.quantity}x {item.name}
                                                                </div>
                                                            ))}
                                                        </td>
                                                        <td>
                                                            {(order.source === 'Online Store' || order.source === 'Booking Request') ? (
                                                                <span className="approval-badge approval-green" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: '#3b82f6' }}>
                                                                    PAID
                                                                </span>
                                                            ) : (
                                                                <span className={`approval-badge ${order.approvalStatus === 'Approved by Boss' ? 'approval-green' : 'approval-yellow'}`}>
                                                                    {order.approvalStatus || 'PENDING'}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleToggleStatus(order.id, order.status)}
                                                                className={`status-badge ${order.status === 'fulfilled' ? 'status-fulfilled' : 'status-pending'}`}
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
        </div>
    );
};

export default Admin;
