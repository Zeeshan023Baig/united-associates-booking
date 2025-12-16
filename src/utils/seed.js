import { collection, writeBatch, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const SAMPLE_SPECS = [
    // --- INTERNATIONAL BRANDS ---
    {
        id: "rb-aviator",
        category: "brand",
        origin: "international",
        brand: "Ray-Ban",
        name: "Ray-Ban Aviator Classic",
        price: 13999,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1625591348636-e6a8a446990d?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Timeless aviator styling with exceptional quality, performance and comfort.",
        features: ["Frame material: Metal", "Lens technology: G-15", "Shape: Pilot"],
        faceShape: "oval",
        frameShape: "aviator",
        size: "medium"
    },
    {
        id: "mj-peahi",
        category: "brand",
        origin: "international",
        brand: "Maui Jim",
        name: "Maui Jim Peahi",
        price: 23690,
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"],
        description: "Designed to withstand the elements while providing unparalleled clarity.",
        features: ["PolarizedPlus2®", "SuperThin Glass", "Wrap frame"]
    },
    {
        id: "ok-holbrook",
        category: "brand",
        origin: "international",
        brand: "Oakley",
        name: "Oakley Holbrook",
        price: 12900,
        image: "https://images.unsplash.com/photo-1629814138092-233c70669298?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1629814138092-233c70669298?auto=format&fit=crop&q=80&w=800"],
        description: "Classic design fused with modern Oakley technology. Spirit of exploration.",
        features: ["O Matter™ frame", "Prizm™ lenses", "HDO® Optics"]
    },

    // --- INDIAN BRANDS ---
    {
        id: "tt-voyager",
        category: "brand",
        origin: "indian",
        brand: "Titan Eye+",
        name: "Titan Voyager",
        price: 4999,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"],
        description: "Reliable Indian craftsmanship meeting modern style needs.",
        features: ["Durable Acetate", "UV Protection", "Comfort Fit"]
    },
    {
        id: "ft-sport",
        category: "brand",
        origin: "indian",
        brand: "Fastrack",
        name: "Fastrack Sport Edge",
        price: 2499,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800"],
        description: "Dynamic styling for the active youth of India.",
        features: ["Polycarbonate Lens", "Sporty Design", "Impact Resistant"]
    },

    // --- IN-HOUSE BRANDS ---
    {
        id: "uaa-signature-1",
        category: "brand",
        origin: "in-house",
        brand: "UA Signature",
        name: "UA Classic Way",
        price: 1999,
        image: "https://plus.unsplash.com/premium_photo-1675806622830-4e58b1933c02?auto=format&fit=crop&q=80&w=800",
        images: ["https://plus.unsplash.com/premium_photo-1675806622830-4e58b1933c02?auto=format&fit=crop&q=80&w=800"],
        description: "Our proprietary design offering premium aesthetics at an unbeatable value.",
        features: ["Hand-polished", "CR-39 Lenses", "5-Barrel Hinges"]
    },
    {
        id: "uaa-elite",
        category: "brand",
        origin: "in-house",
        brand: "UA Elite",
        name: "UA Elite Aviator",
        price: 2499,
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800"],
        description: "Sophisticated metal frames designed in-house for the discerning professional.",
        features: ["Stainless Steel", "Polarized", "Silicone Nosepads"]
    },

    // --- INTERNATIONAL LENSES ---
    {
        id: "lens-zeiss-drive",
        category: "lens",
        origin: "international",
        brand: "Zeiss",
        name: "Zeiss DriveSafe",
        price: 8000,
        image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800"],
        description: "Optimized for driving. Better vision in low light and reduced glare.",
        features: ["Luminance Design®", "DuraVision® DriveSafe", "UV Protection"]
    },
    {
        id: "lens-essilor-varilux",
        category: "lens",
        origin: "international",
        brand: "Essilor",
        name: "Varilux Comfort Max",
        price: 12000,
        image: "https://images.unsplash.com/photo-1564222256577-45e3536033d5?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1564222256577-45e3536033d5?auto=format&fit=crop&q=80&w=800"],
        description: "Progressive lenses that provide natural vision at every distance.",
        features: ["Flex Optim™", "W.A.V.E. 2.0", "Blue Light Protection"]
    },

    // --- INDIAN LENSES ---
    {
        id: "lens-prime-clear",
        category: "lens",
        origin: "indian",
        brand: "Prime Lens",
        name: "Prime HD Clear",
        price: 1500,
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"],
        description: "High-definition clarity from a trusted Indian manufacturer.",
        features: ["Anti-Glare", "Scratch Resistant", "Water Repellent"]
    },

    // --- IN-HOUSE LENSES ---
    {
        id: "uaa-lens-std",
        category: "lens",
        origin: "in-house",
        brand: "UA Optics",
        name: "UA Standard Digital",
        price: 999,
        image: "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&q=80&w=800"],
        description: "Our reliable everyday lenses with digital blue light protection.",
        features: ["Blue Cut", "Anti-Reflective", "1-Year Warranty"]
    }
];

export const seedDatabase = async () => {
    if (!db) return;

    const batch = writeBatch(db);
    const productsRef = collection(db, "products");

    // We rely on "Clear Database" button to wipe old schema items
    SAMPLE_SPECS.forEach((item) => {
        const docRef = doc(productsRef, item.id);
        batch.set(docRef, {
            id: item.id,
            category: item.category, // brand | lens
            origin: item.origin,     // international | indian | in-house
            name: item.name,
            brand: item.brand,
            description: item.description,
            price: item.price,
            stock: 100,
            maxStock: 100,
            imageUrl: item.image,
            images: item.images || [item.image],
            features: item.features || [],
            faceShape: item.faceShape || "oval",
            frameShape: item.frameShape || "wayfarer",
            size: item.size || "medium",
            createdAt: serverTimestamp()
        });
    });

    await batch.commit();
    console.log("Database seeded with structured catalog data!");
    return "Seeding Complete!";
};

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
