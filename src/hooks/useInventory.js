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
            const q = query(collection(db, "products"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const items = [];
                snapshot.forEach((doc) => {
                    items.push({ firebaseId: doc.id, ...doc.data() });
                });

                // Client-side sort: Newest first (checked via createdAt)
                // Fallback: If no createdAt, put at the end
                items.sort((a, b) => {
                    const timeA = a.createdAt?.seconds || 0;
                    const timeB = b.createdAt?.seconds || 0;
                    return timeB - timeA;
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
