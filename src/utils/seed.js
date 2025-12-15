import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const SAMPLE_SPECS = [
    { id: "rb-aviator", brand: "Ray-Ban", name: "Ray-Ban Aviator Classic", price: 163, image: "Ray-Ban+Aviator" },
    { id: "rb-wayfarer", brand: "Ray-Ban", name: "Ray-Ban Original Wayfarer", price: 174, image: "Ray-Ban+Wayfarer" },
    { id: "rb-clubmaster", brand: "Ray-Ban", name: "Ray-Ban Clubmaster", price: 163, image: "Ray-Ban+Clubmaster" },
    { id: "mj-peahi", brand: "Maui Jim", name: "Maui Jim Peahi", price: 279, image: "Maui+Jim+Peahi" },
    { id: "mj-red-sands", brand: "Maui Jim", name: "Maui Jim Red Sands", price: 249, image: "Maui+Jim+Red+Sands" },
    { id: "ok-holbrook", brand: "Oakley", name: "Oakley Holbrook", price: 152, image: "Oakley+Holbrook" },
    { id: "ok-gascan", brand: "Oakley", name: "Oakley Gascan", price: 132, image: "Oakley+Gascan" },
    { id: "ok-sutro", brand: "Oakley", name: "Oakley Sutro", price: 183, image: "Oakley+Sutro" },
    { id: "meta-wayfarer", brand: "Meta", name: "Ray-Ban Meta Wayfarer", price: 299, image: "Meta+Smart+Glasses" },
    { id: "meta-headliner", brand: "Meta", name: "Ray-Ban Meta Headliner", price: 329, image: "Meta+Headliner" },
];

export const seedDatabase = async () => {
    if (!db) return;

    const batch = writeBatch(db);
    const productsRef = collection(db, "products");

    // Optional: Delete existing documents first (for clean slate) if needed
    // But for now, we just overwrite/add. 

    // Create 10 specific brand items
    SAMPLE_SPECS.forEach((item) => {
        const docRef = doc(productsRef, item.id);
        batch.set(docRef, {
            id: item.id,
            name: item.name,
            brand: item.brand,
            description: `Authentic ${item.brand} eyewear. Premium optical quality with durable frames. Model: ${item.name}.`,
            price: item.price,
            stock: 100, // Default 100 stock
            maxStock: 100,
            imageUrl: `https://placehold.co/600x400/1e293b/38bdf8?text=${item.image}&font=montserrat`
        });
    });

    await batch.commit();
    console.log("Database seeded with 10 brand examples!");
    return "Seeding Complete! Refresh to see changes.";
};

// Helper to clear DB (optional usage)
export const clearDatabase = async () => {
    if (!db) return;
    const q = collection(db, "products");
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
};
