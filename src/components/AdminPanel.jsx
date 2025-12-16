import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { db } from '../lib/firebase';
import { doc, updateDoc, deleteDoc, addDoc, collection, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Save, RefreshCw, ShoppingBag, User } from 'lucide-react';

export default function AdminPanel() {
    const { products, loading: inventoryLoading, error } = useInventory();
    const [newItem, setNewItem] = useState({
        name: '', brand: '', price: '', stock: 100, imageUrl: '', description: '', features: '',
        category: 'brand', origin: 'international',
        faceShape: 'oval', frameShape: 'wayfarer', size: 'medium'
    });
    const [saving, setSaving] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Orders State
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'orders'

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleUpdateStock = async (id, newStock) => {
        setSaving(id);
        try {
            const ref = doc(db, "products", id);
            await updateDoc(ref, { stock: parseInt(newStock) });
        } catch (e) {
            alert("Error updating stock: " + e.message);
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteDoc(doc(db, "products", id));
        } catch (e) {
            alert("Error deleting: " + e.message);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;

        // Process Image URL: Allow local paths or full URLs
        let finalImageUrl = newItem.imageUrl;
        if (finalImageUrl && !finalImageUrl.startsWith('http') && !finalImageUrl.startsWith('data:')) {
            // It's likely a local file path. Ensure it starts with '/'
            if (!finalImageUrl.startsWith('/')) {
                finalImageUrl = '/' + finalImageUrl;
            }
        } else if (!finalImageUrl) {
            // Default placeholder if empty
            finalImageUrl = `https://placehold.co/600x400/1e293b/38bdf8?text=${encodeURIComponent(newItem.name)}`;
        }

        try {
            await addDoc(collection(db, "products"), {
                ...newItem,
                price: parseFloat(newItem.price),
                stock: parseInt(newItem.stock),
                imageUrl: finalImageUrl,
                description: newItem.description || "No description provided.",
                features: newItem.features ? newItem.features.split(',').map(f => f.trim()).filter(f => f) : [],
                createdAt: serverTimestamp()
            });
            setNewItem({
                name: '', brand: '', price: '', stock: 100, imageUrl: '', description: '', features: '',
                category: 'brand', origin: 'international',
                faceShape: 'oval', frameShape: 'wayfarer', size: 'medium'
            });
            alert("Product Added!");
        } catch (e) {
            alert("Error adding: " + e.message);
        }
    };

    if (inventoryLoading) return <div className="container" style={{ paddingTop: '4rem' }}>Loading Admin...</div>;

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Orders ({orders.length})
                    </button>
                </div>
            </div>

            {activeTab === 'orders' ? (
                <div className="glass-panel" style={{ overflowX: 'auto' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={20} /> Recent Sales
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Customer</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Items</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Total</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                        {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString() : ''}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{order.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: '0.9rem' }}>
                                                    <span style={{ color: '#38bdf8' }}>{item.quantity}x</span> {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                        ₹{order.totalPrice?.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="badge badge-success">Completed</span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No orders found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    {/* Add New Product Form */}
                    <div className="glass-panel" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={20} /> Add New Product
                        </h3>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input"
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option value="brand">Brand (Frame)</option>
                                    <option value="lens">Lens</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Origin</label>
                                <select className="form-input"
                                    value={newItem.origin}
                                    onChange={e => setNewItem({ ...newItem, origin: e.target.value })}
                                >
                                    <option value="international">International</option>
                                    <option value="indian">Indian</option>
                                    <option value="in-house">In-House</option>
                                </select>
                            </div>

                            {/* New Filter Fields */}
                            <div className="form-group">
                                <label className="form-label">Face Shape</label>
                                <select className="form-input"
                                    value={newItem.faceShape}
                                    onChange={e => setNewItem({ ...newItem, faceShape: e.target.value })}
                                >
                                    <option value="oval">Oval</option>
                                    <option value="round">Round</option>
                                    <option value="square">Square</option>
                                    <option value="heart">Heart</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Frame Shape</label>
                                <select className="form-input"
                                    value={newItem.frameShape}
                                    onChange={e => setNewItem({ ...newItem, frameShape: e.target.value })}
                                >
                                    <option value="wayfarer">Wayfarer</option>
                                    <option value="aviator">Aviator</option>
                                    <option value="round">Round</option>
                                    <option value="cat-eye">Cat Eye</option>
                                    <option value="rectangle">Rectangle</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Size</label>
                                <select className="form-input"
                                    value={newItem.size}
                                    onChange={e => setNewItem({ ...newItem, size: e.target.value })}
                                >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input className="form-input" placeholder="e.g. Ray-Ban Hexagonal" required
                                    value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Brand Label</label>
                                <input className="form-input" placeholder="e.g. Ray-Ban" required
                                    value={newItem.brand} onChange={e => setNewItem({ ...newItem, brand: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price (₹)</label>
                                <input className="form-input" type="number" placeholder="12000" required
                                    value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Initial Stock</label>
                                <input className="form-input" type="number" placeholder="100" required
                                    value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Image URL (Optional)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input className="form-input" placeholder="https://..., assets/..., or select file"
                                        value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => fileInputRef.current.click()}
                                        title="Upload from Desktop"
                                        style={{ padding: '0.6rem 1rem' }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Description</label>
                                <textarea className="form-input" placeholder="Product details..." rows="3"
                                    value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Features (comma separated)</label>
                                <input className="form-input" placeholder="Polarized, UV Protection, Hard Case"
                                    value={newItem.features} onChange={e => setNewItem({ ...newItem, features: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>Add Product</button>
                        </form>
                    </div>

                    {/* Inventory Table */}
                    <div className="glass-panel" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem' }}>Image</th>
                                    <th style={{ padding: '1rem' }}>Product</th>
                                    <th style={{ padding: '1rem' }}>Type</th>
                                    <th style={{ padding: '1rem' }}>Price</th>
                                    <th style={{ padding: '1rem' }}>Stock Level</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.firebaseId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ width: '50px', height: '50px', background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                                                <img src={product.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{product.brand}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                                {product.origin || 'N/A'} <br />
                                                <span style={{ color: 'var(--text-secondary)' }}>{product.category || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>₹{product.price}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ width: '80px', padding: '0.25rem' }}
                                                    defaultValue={product.stock}
                                                    onBlur={(e) => {
                                                        if (parseInt(e.target.value) !== product.stock) {
                                                            handleUpdateStock(product.firebaseId, e.target.value);
                                                        }
                                                    }}
                                                />
                                                {saving === product.firebaseId && <RefreshCw className="spin" size={16} />}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button onClick={() => handleDelete(product.firebaseId)} className="btn btn-outline" style={{ border: 'none', color: '#f87171' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
