import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
        const productsRef = collection(db, "products");
        const bookingsRef = collection(db, "bookings");

        // Using getDocs because aggregation queries might require specific index or permissions sometimes, but getDocs is robust for small data
        const productsSnapshot = await getDocs(productsRef);
        const bookingsSnapshot = await getDocs(bookingsRef);

        console.log(`Total Stocks (Products): ${productsSnapshot.size}`);
        console.log(`Total Bookings (Bought): ${bookingsSnapshot.size}`);

        console.log("--- Product Stock Levels ---");
        productsSnapshot.forEach(doc => {
            const d = doc.data();
            console.log(`- ${d.name}: ${d.stock} in stock`);
        });

    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
}

check();
