import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDt73jiw7T1KldzzL8T9QtM3IeLUJhp3cs",
    authDomain: "unitder-booking-v2.firebaseapp.com",
    projectId: "unitder-booking-v2",
    storageBucket: "unitder-booking-v2.firebasestorage.app",
    messagingSenderId: "43698396696",
    appId: "1:43698396696:web:fc3a99975ab913edd5ad6d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    try {
        const bookingsRef = collection(db, "bookings");
        const bookingsSnapshot = await getDocs(query(bookingsRef, orderBy("createdAt", "desc"), limit(5)));

        console.log(`\n--- Recent Bookings (Total: ${bookingsSnapshot.size} fetched) ---`);
        bookingsSnapshot.forEach(doc => {
            const d = doc.data();
            const date = d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleString() : 'N/A';
            console.log(`[${date}] ${d.name} - ₹${d.totalPrice} (${d.status})`);
        });
    } catch (e) {
        console.error(e);
    }
}

check();
