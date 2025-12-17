import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function StoreLocator() {
    return (
        <div style={{ paddingTop: '6rem', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="container" style={{ padding: '0 2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Visit Our Boutiques</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                    {/* Store List */}
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {[
                            { name: "United Associates Agencies - Chennai", address: "Second Floor, No 162, Thiruvalluvar Salai, Thiruvanmiyur, Chennai, 600041", phone: "+91 44 1234 5678", hours: "10:00 AM - 9:00 PM" }
                        ].map((store, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            >
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{store.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <MapPin size={18} /> {store.address}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <Phone size={18} /> {store.phone}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <Clock size={18} /> {store.hours}
                                </div>
                                <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>Get Directions</button>
                            </div>
                        ))}
                    </div>

                    {/* Map Placeholder */}
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
                        <iframe
                            src="https://maps.google.com/maps?q=Second%20Floor%2C%20No%20162%2C%20Thiruvalluvar%20Salai%2C%20Thiruvanmiyur%2C%20Chennai%2C%20Tamil%20Nadu%2C%20600041&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
