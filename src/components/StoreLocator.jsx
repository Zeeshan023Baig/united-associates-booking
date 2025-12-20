import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function StoreLocator() {
    const stores = [
        {
            name: "United Associates Agencies - Thiruvanmiyur (Main)",
            address: "Second Floor, No 162, Thiruvalluvar Salai, Thiruvanmiyur, Chennai, 600041",
            phone: "+91 44 1234 5678",
            hours: "10:00 AM - 9:00 PM",
            mapQuery: "Second Floor, No 162, Thiruvalluvar Salai, Thiruvanmiyur, Chennai, 600041"
        },
        {
            name: "United Associates Agencies - Journalist Colony",
            address: "No:9, Journalist Colony 1st street, Tiruvanmaiyur, Chennai - 600041",
            phone: "+91 94440 58453",
            hours: "10:00 AM - 9:00 PM",
            mapQuery: "No:9, Journalist Colony 1st street, Tiruvanmaiyur, Chennai - 600041"
        }
    ];

    const [activeStore, setActiveStore] = React.useState(stores[0]);

    return (
        <div style={{ paddingTop: '6rem', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="container" style={{ padding: '0 2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Visit Our Boutiques</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
                    {/* Store List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
                        {stores.map((store, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderColor: activeStore.address === store.address ? 'var(--accent-color)' : 'var(--glass-border)' }}
                                onClick={() => setActiveStore(store)}
                                onMouseEnter={() => setActiveStore(store)}
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
                    <div className="glass-panel map-container" style={{ padding: '0', overflow: 'hidden', height: '100%', minHeight: '400px' }}>
                        <iframe
                            key={activeStore.address}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(activeStore.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
