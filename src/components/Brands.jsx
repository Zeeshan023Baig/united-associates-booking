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
        <div style={{
            minHeight: '100vh',
            backgroundImage: "url('/brands-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            padding: '6rem 2rem',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '3rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#1f2937' }}>Luxury / Premium Brands</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {brands.map((brand, index) => (
                        <div key={index} className="glass-panel" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(12px)',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'default',
                            color: '#1f2937'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#111827' }}>{brand.name}</h2>
                                <span style={{ fontSize: '0.85rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{brand.origin}</span>
                            </div>
                            <p style={{ lineHeight: '1.6', fontSize: '1rem', color: '#374151' }}>
                                {brand.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
