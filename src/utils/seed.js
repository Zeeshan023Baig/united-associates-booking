import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const SAMPLE_SPECS = [
    {
        id: "rb-aviator",
        brand: "Ray-Ban",
        name: "Ray-Ban Aviator Classic",
        price: 13999,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1625591348636-e6a8a446990d?auto=format&fit=crop&q=80&w=800",
            "https://plus.unsplash.com/premium_photo-1675806622830-4e58b1933c02?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Currently one of the most iconic sunglass models in the world, Ray-Ban Aviator Classic sunglasses were originally designed for U.S. Aviators in 1937.\n\nAviator Classic sunglasses are a timeless model that combines great aviator styling with exceptional quality, performance and comfort. The metal frame is lightweight yet durable, ensuring long-lasting wear.\n\nWith a classic pilot shape, these sunglasses offer optimum visual clarity and 100% UV protection.",
        features: ["Frame material: Metal", "Lens technology: G-15", "Shape: Pilot", "Polarized: Yes"]
    },
    {
        id: "rb-wayfarer",
        brand: "Ray-Ban",
        name: "Ray-Ban Original Wayfarer",
        price: 14790,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Ray-Ban Original Wayfarer Classics are the most recognizable style in the history of sunglasses. Since its initial design in 1952, Wayfarer Classics gained popularity among celebrities, musicians, artists and those with an impeccable fashion sense.\n\nThe acetate frame offers a comfortable fit and a glossy finish that stands out.\n\nMake a statement with the iconic Wayfarer, symbol of youth, fashion, and creativity for over 50 years.",
        features: ["Frame material: Acetate", "Classic G-15 Lenses", "Iconic Style", "100% UV Protection"]
    },
    {
        id: "rb-clubmaster",
        brand: "Ray-Ban",
        name: "Ray-Ban Clubmaster",
        price: 13999,
        image: "https://images.unsplash.com/photo-1532715088550-62f09305f765?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1532715088550-62f09305f765?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Clubmaster styles are retro and timeless. Inspired by the 50s, the design of the Clubmaster Classic is worn by cultural intellectuals, those who lead the changed tomorrow.\n\nChoose the iconic Clubmaster Classic sunglasses design in black or brown frames with a crystal green lens treatment.\n\nWearing Ray-Ban Clubmaster Classic® sunglasses allows you to make a statement of sophisticated design.",
        features: ["Retro Design", "Half-Rim Frame", "Adjustable nose pads", "Crystal Lenses"]
    },
    {
        id: "mj-peahi",
        brand: "Maui Jim",
        name: "Maui Jim Peahi",
        price: 23690,
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1614715838608-dd527c46231d?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Peahi is a wrap style that offers full coverage for protection against wind and blowing debris.\n\nInspired by a legendary surf break on Maui's North Shore, these sunglasses are designed to withstand the elements while providing unparalleled clarity.\n\nThe SuperThin Glass lenses provide the absolute crispest optics available, 20% to 32% thinner and lighter than standard glass.",
        features: ["PolarizedPlus2® technology", "SuperThin Glass", "Wrap frame", "Saltwater Safe"]
    },
    {
        id: "mj-red-sands",
        brand: "Maui Jim",
        name: "Maui Jim Red Sands",
        price: 21190,
        image: "https://images.unsplash.com/photo-1625591348636-e6a8a446990d?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1625591348636-e6a8a446990d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1532715088550-62f09305f765?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Red Sands has a rectangular lens shape that gives it a distinct look and feel.\n\nLightweight, durable, and comfortable, this frame is made from nylon which can easily be adjusted for a personal fit.\n\nIdeal for round, oval, and heart-shaped faces, Red Sands brings a modern touch to a classic silhouette.",
        features: ["MauiPure Lens", "Lightweight", "Rectangular", "Nylon Frame"]
    },
    {
        id: "ok-holbrook",
        brand: "Oakley",
        name: "Oakley Holbrook",
        price: 12900,
        image: "https://images.unsplash.com/photo-1629814138092-233c70669298?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1629814138092-233c70669298?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Holbrook is a timeless, classic design fused with modern Oakley technology.\n\nInspired by the screen heroes from the 1940s, 50s, and 60s, this design epitomizes the spirit of exploration and adventure.\n\nThe iconic American frame design is accented by metal rivets and Oakley icons, perfect for those who seek equal parts performance and style.",
        features: ["O Matter™ frame material", "Prizm™ lenses", "Plutonite® Lenses", "HDO® Optics"]
    },
    {
        id: "ok-gascan",
        brand: "Oakley",
        name: "Oakley Gascan",
        price: 11200,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1614715838608-dd527c46231d?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The Gascan lenses are cut from the curve of a single lens shield, then mounted in the frame to maintain the continuous contour.\n\nThe look is so unique, we customized our corporate logo just for this eyewear.\n\nLightweight O Matter™ frame material offers premium comfort while the Three-Point Fit holds lenses in precise optical alignment.",
        features: ["Two lenses cut from single shield", "Three-Point Fit", "Lightweight", "Impact Protection"]
    },
    {
        id: "ok-sutro",
        brand: "Oakley",
        name: "Oakley Sutro",
        price: 15500,
        image: "https://images.unsplash.com/photo-1614715838608-dd527c46231d?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1614715838608-dd527c46231d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Designed with performance in mind, Sutro gives cyclists a bold and versatile look that they can confidently wear on and off the bike.\n\nThe high-wrap shield protects from the elements and enhances vision with Prizm™ Lens Technology.\n\nInspiring athletes to move confidently through their day.",
        features: ["High Wrap Shield", "Unobtainium® nosepads", "Prizm™ lenses", "Cycling Optimized"]
    },
    {
        id: "meta-wayfarer",
        brand: "Meta",
        name: "Ray-Ban Meta Wayfarer",
        price: 25499,
        image: "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800"
        ],
        description: "The next generation of smart glasses. Listen, call, capture and livestream.\n\nThe new ultra-wide 12 MP camera and five-mic system let you capture whatever you see and hear.\n\nIntegrated with Meta AI, these glasses allow you to ask questions and get information without pulling out your phone.",
        features: ["12MP Camera", "Open Ear Speakers", "Meta AI", "Touch Controls"]
    },
    {
        id: "meta-headliner",
        brand: "Meta",
        name: "Ray-Ban Meta Headliner",
        price: 27999,
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&q=80&w=800"
        ],
        description: "A new hybrid shape that combines the best of the Wayfarer and Round styles.\n\nRay-Ban Meta Headliner offers the same powerful smart features in a fresh, unique silhouette.\n\nLive stream directly to Facebook and Instagram, and enjoy high-quality audio with improved bass and higher maximum volume.",
        features: ["Hybrid Shape", "Livestreaming", "Voice Control", "Charging Case"]
    },
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
            imageUrl: item.image,
            images: item.images || [item.image],
            features: item.features || []
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
