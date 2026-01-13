import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, runTransaction, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle, ShoppingBag } from 'lucide-react';
import emailjs from '@emailjs/browser';

import './BookingForm.css';

export default function BookingForm({ cart, updateQuantity, removeFromCart, clearCart }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: ''
    });

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // DEMO MODE: Set to true if you want to bypass Razorpay for testing/demo without keys
    const DEMO_MODE = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        // Validate Phone
        if (formData.phone.length !== 10) {
            setBookingError("Phone number must be exactly 10 digits.");
            return;
        }

        // Validate Email
        // Rules: Start with small letter, no numbers after @, valid TLD
        const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z]+\.[a-z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setBookingError("Invalid email: Must start with a lowercase letter, contain no numbers after '@', and end with a valid domain (e.g. .com).");
            return;
        }

        setLoading(true);
        setBookingError(null);

        try {
            if (!db) throw new Error("Database not connected");

            let bookingId = "";

            // 1. Create Pending Booking
            await runTransaction(db, async (transaction) => {
                // Check stock
                const snapshots = [];
                for (const item of cart) {
                    const sfDocRef = doc(db, "products", item.firebaseId);
                    const sfDoc = await transaction.get(sfDocRef);

                    if (!sfDoc.exists()) {
                        throw new Error(`STALE_CART: Product "${item.name}" no longer exists in catalog.`);
                    }

                    const currentStock = sfDoc.data().stock;
                    if (currentStock < item.quantity) {
                        throw new Error(`Insufficient stock for ${item.name}. Only ${currentStock} left.`);
                    }
                    snapshots.push({ ref: sfDocRef, currentStock, quantity: item.quantity });
                }

                // Deduct Stock
                for (const snap of snapshots) {
                    transaction.update(snap.ref, { stock: snap.currentStock - snap.quantity });
                }

                // Create Booking Doc
                const bookingRef = doc(collection(db, "bookings"));
                bookingId = bookingRef.id;
                transaction.set(bookingRef, {
                    ...formData,
                    items: cart,
                    totalPrice,
                    createdAt: serverTimestamp(),
                    status: 'pending', // Force pending for Booking Requests
                    approvalStatus: 'Pending',
                    source: 'Booking Request' // Tag as Internal Booking Request
                });
            });

            // If in DEMO_MODE, bypass Razorpay
            if (DEMO_MODE) {
                // Simulate a short delay for realism
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Pretend we got a payment ID
                const mockPaymentId = "pay_demo_" + Math.random().toString(36).substr(2, 9);
                await finalizeBooking(bookingId, mockPaymentId);
                return;
            }

            // 3. Open Razorpay (Only if NOT in Demo Mode)
            const options = {
                key: "rzp_test_PLACEHOLDER", // REPLACE THIS WITH YOUR RAZORPAY KEY ID
                amount: totalPrice * 100, // Amount in paise
                currency: "INR",
                name: "United Associates",
                description: "Purchase of Sunglasses",
                image: window.location.origin + "/logo_uaa.png",
                order_id: "",
                handler: async function (response) {
                    try {
                        // Update Booking to Paid
                        const bookingRef = doc(db, "bookings", bookingId);
                        await updateDoc(bookingRef, {
                            status: 'completed',
                            paymentId: response.razorpay_payment_id
                        });

                        await finalizeBooking(bookingId, response.razorpay_payment_id);
                    } catch (err) {
                        alert("Payment successful but failed to update order: " + err.message);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#38bdf8"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();

            setLoading(false); // Stop generic loading, let Razorpay handle UI

        } catch (e) {
            console.error("Booking Error: ", e);
            if (e.message.includes("STALE_CART")) {
                setBookingError("Items in your cart are outdated (Catalog was reset). Please clear your cart.");
                if (confirm("Your cart contains outdated items from a previous catalog version. Clear cart now?")) {
                    clearCart();
                }
            } else {
                setBookingError("Failed: " + e.message);
            }
            setLoading(false);
        }
    };

    const finalizeBooking = async (bookingId, paymentId) => {
        try {
            clearCart();

            // Send Email Notification
            const itemDetails = cart.map(item => `${item.name} (x${item.quantity}) - ₹${item.price}`).join('\n');
            const emailParams = {
                to_email: 'zeeshan.baig.1323@gmail.com', // Admin email
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone,
                order_id: bookingId, // or paymentId
                items_list: itemDetails,
                total_price: totalPrice,
                date: new Date().toLocaleString()
            };

            try {
                // 1. Send Admin Notification (Retailer)
                await emailjs.send('service_siw244i', 'template_6984agq', emailParams, 'YpgIawHtCtJ1-mbWw');
                console.log("Admin Email sent.");

                // 2. Send Customer Receipt (Online Customer)
                // We reuse the same params but the template might use them differently
                // Ensure the template uses 'customer_email' as the 'Reply To' or similar if needed.
                // However, EmailJS 'to_email' in params usually requires the template to map it specifically.
                // For the receipt, we want to send TO the customer.
                const customerReceiptParams = {
                    ...emailParams,
                    to_email: formData.email, // Send TO the customer
                    to_name: formData.name      // Personalized greeting
                };

                await emailjs.send('service_siw244i', 'template_gjreihx', customerReceiptParams, 'YpgIawHtCtJ1-mbWw');
                console.log("Customer Receipt sent.");

            } catch (emailErr) {
                console.error("Email failed to send:", emailErr);
            }

            // Navigate
            navigate('/confirmation', {
                state: {
                    booking: {
                        id: bookingId,
                        ...formData,
                        items: cart,
                        totalPrice,
                        paymentId
                    }
                }
            });

        } catch (error) {
            console.error("Finalize error", error);
        }
    }

    /* ... render ... */

    // Returning the button part specifically to update text
    /*
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString()}`}
        </button>
    */

    if (cart.length === 0) {
        return (
            <div className="booking-wrapper">
                <div className="container" style={{ paddingTop: '6rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>

                        {/* Background blob for visual interest */}
                        <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>

                        <div style={{ marginBottom: '2rem', display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                            <ShoppingBag size={48} color="#38bdf8" />
                        </div>

                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Your Collection Awaits
                        </h2>

                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                            Your booking request is currently empty. Explore our premium catalog to find your next signature look.
                        </p>

                        <button onClick={() => navigate('/catalog')} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Discover Catalog
                        </button>

                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.6 }}>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Authentication Guaranteed</span>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Premium Fulfillment</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-wrapper">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <h2>Complete Your Booking</h2>

                <div className="grid-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                    {/* Cart Review */}
                    <div>
                        <div className="glass-panel">
                            <h3>Request Summary</h3>
                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {cart.map(item => (
                                    <div key={item.firebaseId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{item.name}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>₹{item.price} x {item.quantity}</div>
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
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total: ₹{totalPrice.toLocaleString()}</div>
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
                                <label className="form-label">Phone (10 digits)</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>+91</span>
                                    <input
                                        required
                                        type="tel"
                                        className="form-input"
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={e => {
                                            // Only allow numbers and max 10 digits
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData({ ...formData, phone: val })
                                        }}
                                    />
                                </div>
                            </div>

                            {bookingError && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #f87171' }}>
                                    {bookingError} <br />
                                    <small>Tip: Check your Firestore Database Rules.</small>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                {loading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString()}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
