import { collection, writeBatch, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const BURBERRY_PILOT_IMG = "data:image/jpeg;base64,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";

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

    // --- NEW LUXURY ARRIVALS ---
    {
        id: "cartier-santos",
        category: "brand",
        origin: "international",
        brand: "Cartier",
        name: "Cartier Santos Navigator",
        price: 85000,
        image: "/assets/new_arrivals/cartier_navigator.jpg",
        images: ["/assets/new_arrivals/cartier_navigator.jpg"],
        description: "A tribute to the intrepid aviator Santos-Dumont. Screws borrowed from the iconic watch.",
        features: ["Gold Finish", "Navigator Shape", "Santos Signature"],
        faceShape: "oval",
        frameShape: "aviator",
        size: "large"
    },
    {
        id: "cartier-decor-wood",
        category: "brand",
        origin: "international",
        brand: "Cartier",
        name: "Cartier C Décor Wood",
        price: 120000,
        image: "/assets/new_arrivals/cartier_rimless_wood.jpg",
        images: ["/assets/new_arrivals/cartier_rimless_wood.jpg"],
        description: "Precious woods and gold finishes define this rimless masterpiece.",
        features: ["Exotic Wood", "Rimless", "C Signature"],
        faceShape: "square",
        frameShape: "rectangle",
        size: "medium"
    },
    {
        id: "cartier-prem-gold",
        category: "brand",
        origin: "international",
        brand: "Cartier",
        name: "Première de Cartier",
        price: 95000,
        image: "/assets/new_arrivals/cartier_rimless_gold.jpg",
        images: ["/assets/new_arrivals/cartier_rimless_gold.jpg"],
        description: "Modern rimless design with distinct Cartier aesthetic.",
        features: ["Titanium", "Gold Finish", "Lightweight"],
        faceShape: "oval",
        frameShape: "rectangle",
        size: "medium"
    },
    {
        id: "dior-club-mask",
        category: "brand",
        origin: "international",
        brand: "Dior",
        name: "DiorClub M1U",
        price: 45000,
        image: "/assets/new_arrivals/dior_monogram_mask.jpg",
        images: ["/assets/new_arrivals/dior_monogram_mask.jpg"],
        description: "A rectangular mask with the iconic Dior Oblique motif.",
        features: ["Sportswear Look", "Blue Oblique", "Mask Shape"],
        faceShape: "round",
        frameShape: "rectangle",
        size: "Extra large"
    },
    {
        id: "dior-sostellaire",
        category: "brand",
        origin: "international",
        brand: "Dior",
        name: "DiorSoStellaire",
        price: 38000,
        image: "/assets/new_arrivals/dior_square.jpg",
        images: ["/assets/new_arrivals/dior_square.jpg"],
        description: "Oversized square shape with an elegant acetate frame.",
        features: ["Oversized", "Acetate", "100% UV Protection"],
        faceShape: "oval",
        frameShape: "square",
        size: "large"
    },
    {
        id: "burberry-shield",
        category: "brand",
        origin: "international",
        brand: "Burberry",
        name: "Burberry Daisy Shield",
        price: 28000,
        image: "/assets/new_arrivals/burberry_shield.jpg",
        images: ["/assets/new_arrivals/burberry_shield.jpg"],
        description: "Bold shield design featuring the Burberry logo.",
        features: ["Shield Lens", "Nylon Fiber", "Modern Look"],
        faceShape: "heart",
        frameShape: "rectangle",
        size: "large"
    },
    {
        id: "lux-aviator-gold",
        category: "brand",
        origin: "international",
        brand: "Tom Ford",
        name: "Tom Ford Classic Aviator",
        price: 32000,
        image: "/assets/new_arrivals/luxury_aviator.jpg",
        images: ["/assets/new_arrivals/luxury_aviator.jpg"],
        description: "Timeless aviator silhouette with signature T-temple detail.",
        features: ["Metal Frame", "Gradient Lens", "Italian Made"],
        faceShape: "square",
        frameShape: "aviator",
        size: "medium"
    },

    // --- LUXURY INTERNATIONAL COLLECTION ---
    // Ray-Ban (Italy)
    {
        id: "rb-wayfarer-classic",
        category: "brand",
        origin: "international",
        brand: "Ray-Ban",
        name: "Ray-Ban Original Wayfarer",
        price: 10500,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
        description: "The most recognizable style in the history of sunglasses. iconic styling.",
        features: ["Acetate Frame", "G-15 Lenses", "100% UV Protection"],
        faceShape: "oval",
        frameShape: "wayfarer"
    },
    {
        id: "rb-clubmaster",
        category: "brand",
        origin: "international",
        brand: "Ray-Ban",
        name: "Ray-Ban Clubmaster Classic",
        price: 11500,
        image: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&q=80&w=800",
        description: "Retro and timeless. Inspired by the 50s.",
        features: ["Browline Design", "Green Classic G-15", "Adjustable Nosepads"],
        faceShape: "round",
        frameShape: "square"
    },
    {
        id: "rb-round-metal",
        category: "brand",
        origin: "international",
        brand: "Ray-Ban",
        name: "Ray-Ban Round Metal",
        price: 12500,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        description: "A retro look that has been worn by legendary musicians.",
        features: ["Curved Brow Bar", "Crystal Lenses", "Thin Metal Temples"],
        faceShape: "square",
        frameShape: "round"
    },

    // Oakley (USA)
    {
        id: "oak-sutro",
        category: "brand",
        origin: "international",
        brand: "Oakley",
        name: "Oakley Sutro",
        price: 14500,
        image: "https://images.unsplash.com/photo-1629814138092-233c70669298?auto=format&fit=crop&q=80&w=800",
        description: "Designed with performance in mind, giving a bold, versatile look.",
        features: ["Prizm™ Lenses", "High Wrap Shield", "Unobtainium® Nosepads"],
        faceShape: "oval",
        frameShape: "rectangle"
    },
    {
        id: "oak-jawbreaker",
        category: "brand",
        origin: "international",
        brand: "Oakley",
        name: "Oakley Jawbreaker",
        price: 18000,
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
        description: "The ultimate sport design for the cycling obsession.",
        features: ["Switchlock™ Technology", "Surge Ports", "Helmet Compatible"],
        faceShape: "round",
        frameShape: "sport"
    },
    {
        id: "oak-frogskins",
        category: "brand",
        origin: "international",
        brand: "Oakley",
        name: "Oakley Frogskins",
        price: 9500,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
        description: "In pop culture, it was a time like no other. The 80s made a comeback.",
        features: ["O Matter™ Frame", "4 Base Lens Geometry", "Classic Logo"],
        faceShape: "square",
        frameShape: "wayfarer"
    },

    // Persol (Italy)
    {
        id: "persol-649",
        category: "brand",
        origin: "international",
        brand: "Persol",
        name: "Persol 649 Original",
        price: 19000,
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
        description: "Designed in 1957 for Turin tram drivers, it became a legend.",
        features: ["Meflecto System", "Crystal Lenses", "Acetate"],
        faceShape: "oval",
        frameShape: "aviator"
    },
    {
        id: "persol-714",
        category: "brand",
        origin: "international",
        brand: "Persol",
        name: "Persol 714 Steve McQueen",
        price: 28000,
        image: "https://images.unsplash.com/photo-1564222256577-45e3536033d5?auto=format&fit=crop&q=80&w=800",
        description: "The first ever folding glasses, made famous by the King of Cool.",
        features: ["Folding System", "Arrow Symbol", "Handmade in Italy"],
        faceShape: "square",
        frameShape: "aviator"
    },
    {
        id: "persol-3048",
        category: "brand",
        origin: "international",
        brand: "Persol",
        name: "Persol PO3048S",
        price: 16500,
        image: "https://images.unsplash.com/photo-1604136172384-b2e933d719d9?auto=format&fit=crop&q=80&w=800",
        description: "A modern evolution of the classic wayfarer style.",
        features: ["Flex Temples", "Polarized Options", "Comfort Fit"],
        faceShape: "round",
        frameShape: "wayfarer"
    },

    // Prada (Italy)
    {
        id: "prada-symbole",
        category: "brand",
        origin: "international",
        brand: "Prada",
        name: "Prada Symbole",
        price: 38000,
        image: "https://images.unsplash.com/photo-1563903530908-afdd155d057a?auto=format&fit=crop&q=80&w=800",
        description: "Geometric acetate sunglasses with a bold, contemporary attitude.",
        features: ["Faceted Design", "Triangle Logo", "100% UVA/UVB"],
        faceShape: "oval",
        frameShape: "cat-eye"
    },
    {
        id: "prada-linea-rossa",
        category: "brand",
        origin: "international",
        brand: "Prada",
        name: "Prada Linea Rossa Impavid",
        price: 26000,
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
        description: "Sport-inspired dynamic design with avant-garde aesthetics.",
        features: ["Nylon Fibre", "Rubber Finish", "Wraparound"],
        faceShape: "square",
        frameShape: "sport"
    },
    {
        id: "prada-runway",
        category: "brand",
        origin: "international",
        brand: "Prada",
        name: "Prada Runway",
        price: 45000,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
        description: "Exclusive design straight from the fashion show.",
        features: ["Metal Frame", "Distinctive Bridge", "Logo Engraving"],
        faceShape: "heart",
        frameShape: "rectangle"
    },

    // Gucci (Italy)
    {
        id: "gucci-horsebit",
        category: "brand",
        origin: "international",
        brand: "Gucci",
        name: "Gucci Horsebit",
        price: 32000,
        image: "https://images.unsplash.com/photo-1513694203232-7e9a24520f5d?auto=format&fit=crop&q=80&w=800",
        description: "Vintage allure meets modern sophistication.",
        features: ["Horsebit Detail", "Gold-tone Metal", "Gradient Lenses"],
        faceShape: "square",
        frameShape: "square"
    },
    {
        id: "gucci-aviator",
        category: "brand",
        origin: "international",
        brand: "Gucci",
        name: "Gucci Web Aviator",
        price: 35000,
        image: "https://images.unsplash.com/photo-1521147029587-f8c5c7dc24c3?auto=format&fit=crop&q=80&w=800",
        description: "Classic aviator shape enriched with the House's web colors.",
        features: ["Enamel Web", "Interlocking G", "Adjustable Fit"],
        faceShape: "oval",
        frameShape: "aviator"
    },
    {
        id: "gucci-oversized",
        category: "brand",
        origin: "international",
        brand: "Gucci",
        name: "Gucci Oversized Mask",
        price: 52000,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
        description: "A bold mask shape for a fashion-forward statement.",
        features: ["Star Rivets", "Gucci Logo", "Shield Lens"],
        faceShape: "round",
        frameShape: "mask"
    },

    // Tom Ford (USA/Italy)
    {
        id: "tf-snowdon",
        category: "brand",
        origin: "international",
        brand: "Tom Ford",
        name: "Tom Ford Snowdon",
        price: 29000,
        image: "https://images.unsplash.com/photo-1582260657997-36e4f3de74f3?auto=format&fit=crop&q=80&w=800",
        description: "Thick vintage details worn by elite icons.",
        features: ["T Logo", "Acetate", "Tinted Lenses"],
        faceShape: "square",
        frameShape: "wayfarer"
    },
    {
        id: "tf-jennifer",
        category: "brand",
        origin: "international",
        brand: "Tom Ford",
        name: "Tom Ford Jennifer",
        price: 31000,
        image: "https://images.unsplash.com/photo-1485652562098-de7e5d8ff275?auto=format&fit=crop&q=80&w=800",
        description: "Soft square shape with signature cut-away lenses.",
        features: ["Open Temple", "Gradient Lens", "Italian Made"],
        faceShape: "curved",
        frameShape: "square"
    },
    {
        id: "tf-ft5555",
        category: "brand",
        origin: "international",
        brand: "Tom Ford",
        name: "Tom Ford Blue Block",
        price: 27500,
        image: "https://images.unsplash.com/photo-1570222094114-28a9d88a2b64?auto=format&fit=crop&q=80&w=800",
        description: "Refined optical frames with blue light protection.",
        features: ["Blue Block Lenses", "Metal T", "Sophisticated Look"],
        faceShape: "oval",
        frameShape: "rectangle"
    },

    // Dior (France)
    {
        id: "dior-club",
        category: "brand",
        origin: "international",
        brand: "Dior",
        name: "Dior Club M1U",
        price: 48000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        description: "Rectangular mask shape with a sportswear appeal.",
        features: ["Dior Oblique", "Adjustable Strap", "Mask Shape"],
        faceShape: "oval",
        frameShape: "mask"
    },
    {
        id: "dior-30montaigne",
        category: "brand",
        origin: "international",
        brand: "Dior",
        name: "Dior 30Montaigne",
        price: 42000,
        image: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&q=80&w=800",
        description: "Oversized square shape adorned with the CD signature.",
        features: ["Gold-Finish Metal", "CD Hinge", "Statement Piece"],
        faceShape: "round",
        frameShape: "square"
    },
    {
        id: "dior-blacksuit",
        category: "brand",
        origin: "international",
        brand: "Dior",
        name: "Dior BlackSuit",
        price: 39000,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
        description: "Contemporary elegance inspired by couture suiting stitching.",
        features: ["Signature Hinge", "Pantoplastic", "Modern Classic"],
        faceShape: "heart",
        frameShape: "round"
    },



    // Burberry (UK)
    {
        id: "bur-check",
        category: "brand",
        origin: "international",
        brand: "Burberry",
        name: "Burberry Check Detail",
        price: 21000,
        image: "https://images.unsplash.com/photo-1512413346452-95f2a15c8e33?auto=format&fit=crop&q=80&w=800",
        description: "Frames featuring the iconic House check pattern.",
        features: ["Vintage Check", "Bio-Acetate", "British Design"],
        faceShape: "square",
        frameShape: "square"
    },
    {
        id: "bur-be4291",
        category: "brand",
        origin: "international",
        brand: "Burberry",
        name: "Burberry BE4291",
        price: 19500,
        image: "https://images.unsplash.com/photo-1555589133-c40d2f099071?auto=format&fit=crop&q=80&w=800",
        description: "Modern shield sunglasses for a futuristic look.",
        features: ["Monogram Motif", "Shield Lens", "Rubberised"],
        faceShape: "oval",
        frameShape: "mask"
    },
    {
        id: "bur-pilot",
        category: "brand",
        origin: "international",
        brand: "Burberry",
        name: "Burberry Pilot Frame",
        price: 22000,
        image: BURBERRY_PILOT_IMG,
        description: "A refined interpretation of the pilot shape.",
        features: ["Leather Details", "Light Gold", "Gradient"],
        faceShape: "heart",
        frameShape: "aviator"
    },

    // Versace (Italy)
    {
        id: "ver-medusa",
        category: "brand",
        origin: "international",
        brand: "Versace",
        name: "Versace Medusa Biggie",
        price: 28500,
        image: "https://images.unsplash.com/photo-1563820921473-b3c99a80b78c?auto=format&fit=crop&q=80&w=800",
        description: "Iconic style made famous in the 90s hip-hop culture.",
        features: ["Gold Medusa", "Wide Temples", "Bold Acetate"],
        faceShape: "oval",
        frameShape: "hexagon"
    },
    {
        id: "ver-ve2199",
        category: "brand",
        origin: "international",
        brand: "Versace",
        name: "Versace VE2199",
        price: 24000,
        image: "https://images.unsplash.com/photo-1563155737-01053ba874aa?auto=format&fit=crop&q=80&w=800",
        description: "Statement metal frames with side shields.",
        features: ["Side Shields", "Greek Key", "Rimless Look"],
        faceShape: "square",
        frameShape: "aviator"
    },
    {
        id: "ver-pilot",
        category: "brand",
        origin: "international",
        brand: "Versace",
        name: "Versace Pilot",
        price: 26000,
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800",
        description: "Classic pilot shape with glamorous Versace detailing.",
        features: ["Medusa Studs", "Double Bridge", "Metal"],
        faceShape: "heart",
        frameShape: "aviator"
    },

    // Cartier (France)
    {
        id: "cartier-santos",
        category: "brand",
        origin: "international",
        brand: "Cartier",
        name: "Cartier Santos de Cartier",
        price: 85000,
        image: "https://images.unsplash.com/photo-1594950943962-411a51138a0f?auto=format&fit=crop&q=80&w=800",
        description: "Inspired by the aviator Santos-Dumont. Bold and fearless.",
        features: ["Screw Details", "Champagne Gold", "Leather Bridge"],
        faceShape: "square",
        frameShape: "aviator"
    },
    {
        id: "cartier-panthere",
        category: "brand",
        origin: "international",
        brand: "Cartier",
        name: "Panthère de Cartier",
        price: 110000,
        image: "https://images.unsplash.com/photo-1615858025280-9994c9247656?auto=format&fit=crop&q=80&w=800",
        description: "Ultra-feminine eyewear featuring the iconic panther.",
        features: ["Panther Heads", "Gold Finish", "Jewelry Inspiration"],
        faceShape: "round",
        frameShape: "cat-eye"
    },
    {
        id: "cartier-premiere",
        category: "brand",
        origin: "international",
        brand: "Cartier",
        name: "Première de Cartier",
        price: 95000,
        image: "https://images.unsplash.com/photo-1533857500589-9828d1de11bc?auto=format&fit=crop&q=80&w=800",
        description: "Modern lines combined with the Maison's traditional savoir-faire.",
        features: ["Ruthenium Finish", "Titanium", "Lightweight"],
        faceShape: "oval",
        frameShape: "rectangle"
    },

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

// Version control for seeding data
export const DATA_VERSION = "1.4"; // Increment this to force a re-seed

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
