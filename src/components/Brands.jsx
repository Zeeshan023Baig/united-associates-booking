import React from 'react';

const brands = [
    {
        name: "Ray-Ban",
        origin: "Italy",
        description: "The global leader in premium eyewear, Ray-Ban is synonymous with timeless style, authenticity, and freedom of expression. From the iconic Aviator to the Wayfarer, Ray-Ban offers cultural classics that transcend generations."
    },
    {
        name: "Oakley",
        origin: "USA",
        description: "Oakley is a culture of creators, inventors, idealists, and scientists obsessed with using design and innovation to create products and experiences that inspire greatness. Known for its High Definition Optics®, Oakley frames are the choice of world-class athletes."
    },
    {
        name: "Persol",
        origin: "Italy",
        description: "Persol, from the Italian phrase \"per il sole\" meaning \"for the sun,\" is a brand rich in history and technological innovation. Each frame is a masterpiece of engineering and craftsmanship, famous for its signature arrow hinge and Meflecto system."
    },
    {
        name: "Prada",
        origin: "Italy",
        description: "Prada represents the best of Italian culture and tradition. Innovative style and technological research are the pillars of Prada's design, resulting in eyewear that is both sophisticated and trendsetting, perfect for those who appreciate high fashion."
    },
    {
        name: "Gucci",
        origin: "Italy",
        description: "Influential, innovative, and progressive, Gucci is reinventing a wholly modern approach to fashion. Its eyewear collection features eclectic, contemporary, and romantic designs that represent the pinnacle of Italian craftsmanship."
    },
    {
        name: "Tom Ford",
        origin: "USA/Italy",
        description: "Tom Ford is the first true luxury brand of the 21st century. His eyewear collection captures the essence of glamour and exclusivity, featuring bold designs and the signature 'T' logo that exude confidence and sophistication."
    },
    {
        name: "Dior",
        origin: "France",
        description: "Dior eyewear conveys the essence of the House's heritage with elegant and sophisticated designs. Combining past inspirations with futuristic touches, Dior glasses are architectural works of art that celebrate the creativity and savoir-faire of the brand."
    },
    {
        name: "Burberry",
        origin: "UK",
        description: "Burberry is a global luxury brand with a distinct British identity. Its eyewear collection reflects the brand's heritage, featuring iconic elements like the check pattern and gabardine texture, offering a mix of classic and modern styles."
    },
    {
        name: "Versace",
        origin: "Italy",
        description: "Versace is a symbol of Italian luxury and glamour. Known for its bold prints and bright colors, the eyewear collection distinguishes itself with rock and roll instinct and exceptional quality, featuring the iconic Medusa and Greca logos."
    },
    {
        name: "Cartier",
        origin: "France",
        description: "Cartier, the Jeweler of Kings, creates eyewear that is a testament to exceptional savoir-faire. Precious materials, unique finishes, and elegant designs make Cartier glasses true jewelry for the eyes, symbolizing ultimate luxury and status."
    }
];

export default function Brands() {
    return (
        <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem', fontFamily: "'Outfit', sans-serif" }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '3rem', textAlign: 'center' }}>Luxury / Premium Brands</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {brands.map((brand, index) => (
                    <div key={index} className="glass-panel" style={{
                        transition: 'transform 0.2s ease',
                        cursor: 'default'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>{brand.name}</h2>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{brand.origin}</span>
                        </div>
                        <p style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                            {brand.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
