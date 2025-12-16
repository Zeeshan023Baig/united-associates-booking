import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useInventory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Safety check for missing config
        if (!db) {
            setError("Firebase not initialized. Please check src/lib/firebase.js");
            setLoading(false);
            return;
        }

        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const items = [];
                snapshot.forEach((doc) => {
                    items.push({ firebaseId: doc.id, ...doc.data() });
                });
                setProducts(items);
                setLoading(false);
            }, (err) => {
                console.error("Firestore Error:", err);
                setError(err.message);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, []);

    return { products, loading, error };
}
