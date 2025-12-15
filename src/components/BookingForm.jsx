import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, runTransaction, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle } from 'lucide-react';

export default function BookingForm({ cart, updateQuantity, removeFromCart, clearCart }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: ''
    });

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);

        try {
            if (!db) throw new Error("Database not connected");

            await runTransaction(db, async (transaction) => {
                // 1. Check stock for all items
                for (const item of cart) {
                    const sfDocRef = doc(db, "products", item.firebaseId);
                    const sfDoc = await transaction.get(sfDocRef);

                    if (!sfDoc.exists()) {
                        throw new Error(`Product ${item.name} does not exist!`);
                    }

                    const currentStock = sfDoc.data().stock;
                    if (currentStock < item.quantity) {
                        throw new Error(`Insufficient stock for ${item.name}. Only ${currentStock} left.`);
                    }

                    // 2. Deduct stock
                    transaction.update(sfDocRef, { stock: currentStock - item.quantity });
                }

                // 3. Create booking record
                const bookingRef = doc(collection(db, "bookings"));
                transaction.set(bookingRef, {
                    ...formData,
                    items: cart,
                    totalPrice,
                    createdAt: serverTimestamp(),
                    status: 'pending'
                });
            });

            // alert("Booking confirmed successfully and stock updated!");
            clearCart();
            // Navigate to success page with the booking reference ID and details
            navigate('/confirmation', {
                state: {
                    booking: {
                        id: bookingRef.id,
                        ...formData,
                        items: cart,
                        totalPrice
                    }
                }
            });

        } catch (e) {
            console.error("Booking Error: ", e);
            alert("Booking Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="glass-panel">
                    <h2>Your Booking Request is Empty</h2>
                    <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                        Browse Catalog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h2>Complete Your Booking</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                {/* Cart Review */}
                <div>
                    <div className="glass-panel">
                        <h3>Request Summary</h3>
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.firebaseId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>${item.price} x {item.quantity}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button onClick={() => updateQuantity(item.firebaseId, -1)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.firebaseId, 1)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.firebaseId)} className="btn btn-outline" style={{ color: '#f87171', border: 'none' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total: ${totalPrice.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* User Details Form */}
                <div>
                    <form onSubmit={handleSubmit} className="glass-panel">
                        <h3>Client Information</h3>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Full Name</label>
                            <input required className="form-input"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Company/Agency Name</label>
                            <input required className="form-input"
                                value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input required type="email" className="form-input"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input required type="tel" className="form-input"
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                            {loading ? 'Processing...' : `Confirm Booking`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
