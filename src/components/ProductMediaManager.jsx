import { useState, useRef, useCallback, useEffect } from 'react';

/* ─── Icons (inline SVG micro-components) ──────────────────────── */
const Icon = ({ d, size = 16, color = 'currentColor', fill = 'none', strokeWidth = 1.75, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const UploadIcon   = (p) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const XIcon        = (p) => <Icon {...p} d="M18 6 6 18M6 6l12 12" />;
const StarIcon     = (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const EyeIcon      = (p) => <Icon {...p} d={["M1 12s4-8 11-8 11 8 11 8","M1 12s4 8 11 8 11-8 11-8"]} />;
const GripIcon     = (p) => <Icon {...p} d={["M9 3h1","M14 3h1","M9 12h1","M14 12h1","M9 21h1","M14 21h1"]} />;
const ImageIcon    = (p) => <Icon {...p} d={["M21 3H3a0 0 0 0 0 0 0v18a0 0 0 0 0 0 0 0h18a0 0 0 0 0 0 0-0V3z","M3 9h18","M9 21V9"]} />;
const CheckIcon    = (p) => <Icon {...p} d="M20 6 9 17l-5-5" />;
const PlusIcon     = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const TrashIcon    = (p) => <Icon {...p} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} />;
const LinkIcon     = (p) => <Icon {...p} d={["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71","M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"]} />;
const ZapIcon      = (p) => <Icon {...p} d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />;
const RefreshIcon  = (p) => <Icon {...p} d={["M23 4v6h-6","M20.49 15a9 9 0 1 1-.18-5.16"]} />;

/* ─── Helpers ───────────────────────────────────────────────────── */
const readFileAsDataURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const MAX_GALLERY = 8;
const MAX_SIZE_MB = 5;

/* ─── Spinner ───────────────────────────────────────────────────── */
const Spinner = ({ color = '#818cf8', size = 20 }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid ${color}30`,
    borderTop: `2px solid ${color}`,
    borderRadius: '50%',
    animation: 'pmm-spin 0.7s linear infinite',
    flexShrink: 0,
  }} />
);

/* ─── Drop Zone ─────────────────────────────────────────────────── */
function DropZone({ onFiles, multiple = false, children, style = {} }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) onFiles(files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? '#818cf8' : 'rgba(129,140,248,0.25)'}`,
        borderRadius: '0.875rem',
        background: dragging ? 'rgba(129,140,248,0.07)' : 'rgba(255,255,255,0.015)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: dragging ? '0 0 0 4px rgba(129,140,248,0.12), inset 0 0 24px rgba(129,140,248,0.04)' : 'none',
        position: 'relative',
        ...style,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = Array.from(e.target.files);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
      {children}
    </div>
  );
}

/* ─── Progress Bar ──────────────────────────────────────────────── */
function ProgressBar({ color = '#818cf8' }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p + Math.random() * 18, 95)), 80);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ width: '100%', height: '3px', background: `${color}20`, borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: '99px', transition: 'width 0.1s ease' }} />
    </div>
  );
}

/* ─── Preview Modal ─────────────────────────────────────────────── */
function PreviewModal({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(16px)',
        animation: 'pmm-fadeIn 0.15s ease',
        cursor: 'zoom-out',
        padding: '2rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: '82vw', maxHeight: '84vh', cursor: 'default' }}
      >
        <img
          src={src}
          alt="Full Preview"
          style={{
            maxWidth: '100%', maxHeight: '84vh',
            borderRadius: '1.25rem',
            boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
            display: 'block',
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '-14px', right: '-14px',
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(239,68,68,0.9)', border: '2px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <XIcon size={14} color="white" />
        </button>
        <div style={{
          position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          borderRadius: '50px', padding: '0.35rem 0.9rem',
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          Press ESC to close
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Image Tile ────────────────────────────────────────── */
function GalleryTile({ img, idx, isDragging, onDragStart, onDragEnter, onDragEnd, onPreview, onSetMain, onRemove }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragEnter={() => onDragEnter(idx)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        background: 'rgba(8,8,20,0.8)',
        border: img.isMain
          ? '2px solid rgba(129,140,248,0.8)'
          : isDragging
            ? '2px dashed rgba(192,132,252,0.6)'
            : '1px solid rgba(255,255,255,0.07)',
        cursor: 'grab',
        transition: 'all 0.18s ease',
        transform: hovered && !isDragging ? 'translateY(-2px) scale(1.01)' : isDragging ? 'scale(0.96) rotate(1deg)' : 'none',
        boxShadow: img.isMain
          ? '0 0 20px rgba(129,140,248,0.25), 0 4px 16px rgba(0,0,0,0.4)'
          : hovered ? '0 8px 24px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <img
        src={img.src}
        alt={img.name || `Gallery ${idx + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Index badge */}
      <div style={{
        position: 'absolute', top: '0.4rem', left: '0.4rem',
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        borderRadius: '6px', width: '20px', height: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.6rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {idx + 1}
      </div>

      {/* Main badge */}
      {img.isMain && (
        <div style={{
          position: 'absolute', bottom: '0.4rem', left: '0.4rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(139,92,246,0.95))',
          borderRadius: '6px', padding: '0.15rem 0.45rem',
          fontSize: '0.58rem', fontWeight: '800', color: 'white',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: '3px',
          boxShadow: '0 2px 8px rgba(99,102,241,0.5)',
        }}>
          <StarIcon size={8} color="white" fill="white" />
          MAIN
        </div>
      )}

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '0.35rem', padding: '0.5rem',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.18s ease',
        backdropFilter: hovered ? 'blur(1px)' : 'none',
      }}>
        {/* Grip icon */}
        <div style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', opacity: 0.6 }}>
          <GripIcon size={14} color="white" />
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
          style={overlayBtnStyle('#ffffff')}
        >
          <EyeIcon size={11} color="white" /> Preview
        </button>
        {!img.isMain && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSetMain(); }}
            style={overlayBtnStyle('#818cf8')}
          >
            <StarIcon size={11} color="#818cf8" /> Set Main
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={overlayBtnStyle('#f87171')}
        >
          <TrashIcon size={11} color="#f87171" /> Remove
        </button>
      </div>
    </div>
  );
}

const overlayBtnStyle = (color) => ({
  background: `${color}18`,
  border: `1px solid ${color}40`,
  borderRadius: '7px',
  padding: '0.3rem 0.65rem',
  color: color,
  cursor: 'pointer',
  fontSize: '0.64rem',
  fontWeight: '700',
  backdropFilter: 'blur(6px)',
  display: 'flex', alignItems: 'center', gap: '4px',
  letterSpacing: '0.02em',
  transition: 'background 0.15s',
  width: '100%', justifyContent: 'center',
});

/* ─── Section Label ─────────────────────────────────────────────── */
const SectionLabel = ({ color, icon, title, badge, subtitle, right }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
        <span style={{ color }}>{icon}</span>
        <span style={{
          fontSize: '0.75rem', fontWeight: '800', color,
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>{title}</span>
        {badge && (
          <span style={{
            background: `${color}18`, color, border: `1px solid ${color}35`,
            fontSize: '0.6rem', fontWeight: '700', padding: '0.1rem 0.55rem',
            borderRadius: '50px', letterSpacing: '0.06em',
          }}>{badge}</span>
        )}
      </div>
      {subtitle && (
        <p style={{ margin: 0, fontSize: '0.73rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>
          {subtitle}
        </p>
      )}
    </div>
    {right && (
      <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.22)', textAlign: 'right', lineHeight: 1.6, flexShrink: 0, marginLeft: '1rem' }}>
        {right}
      </div>
    )}
  </div>
);

/* ─── Glass Card ────────────────────────────────────────────────── */
const GlassCard = ({ children, glow = '#6366f1', style = {} }) => (
  <div style={{
    background: 'rgba(10,10,22,0.65)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '1.125rem',
    padding: '1.5rem',
    boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.3)`,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    {/* Subtle glow accent in corner */}
    <div style={{
      position: 'absolute', top: '-30px', right: '-30px',
      width: '120px', height: '120px',
      background: `radial-gradient(circle, ${glow}18 0%, transparent 70%)`,
      pointerEvents: 'none',
    }} />
    {children}
  </div>
);

/* ─── MAIN COMPONENT ────────────────────────────────────────────── */
export default function ProductMediaManager({
  imageUrl, setImageUrl,
  galleryImages = [], setGalleryImages,
}) {
  const [thumbPreview, setThumbPreview] = useState(imageUrl || '');
  const [thumbLoading, setThumbLoading] = useState(false);
  const [thumbFileMeta, setThumbFileMeta] = useState(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [thumbError, setThumbError] = useState('');

  /* Sync external imageUrl → internal preview */
  useEffect(() => {
    if (imageUrl && imageUrl !== thumbPreview) {
      setThumbPreview(imageUrl);
    }
  }, [imageUrl]);

  /* ── Thumbnail handlers ────────────────────────────────── */
  const handleThumbFiles = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setThumbError('');
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setThumbError(`File too large. Max size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setThumbLoading(true);
    setThumbFileMeta({ name: file.name, size: file.size, type: file.type });
    const dataUrl = await readFileAsDataURL(file);
    setThumbPreview(dataUrl);
    setImageUrl(dataUrl);
    setUrlInput('');
    setUrlMode(false);
    setThumbLoading(false);
  }, [setImageUrl]);

  const handleUrlSet = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setThumbPreview(trimmed);
    setImageUrl(trimmed);
    setThumbFileMeta(null);
    setUrlMode(false);
  };

  const clearThumb = () => {
    setThumbPreview('');
    setImageUrl('');
    setThumbFileMeta(null);
    setUrlInput('');
    setThumbError('');
  };

  /* ── Gallery handlers ──────────────────────────────────── */
  const handleGalleryFiles = useCallback(async (files) => {
    const remaining = MAX_GALLERY - galleryImages.length;
    if (remaining <= 0) return;
    const toAdd = files.slice(0, remaining);
    setGalleryLoading(true);
    const previews = await Promise.all(
      toAdd.map(async (file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        src: await readFileAsDataURL(file),
        isMain: false,
        name: file.name,
        size: file.size,
      }))
    );
    setGalleryImages((prev) => [...prev, ...previews]);
    setGalleryLoading(false);
  }, [galleryImages.length, setGalleryImages]);

  const removeGallery = (id) =>
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));

  const setAsMain = (id) => {
    const main = galleryImages.find((img) => img.id === id);
    setGalleryImages((prev) => prev.map((img) => ({ ...img, isMain: img.id === id })));
    if (main) { setThumbPreview(main.src); setImageUrl(main.src); setThumbFileMeta(null); }
  };

  /* ── Drag-to-reorder ───────────────────────────────────── */
  const handleDragStart = (idx) => setDragIndex(idx);
  const handleDragEnter = (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    setGalleryImages((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIndex, 1);
      arr.splice(idx, 0, moved);
      setDragIndex(idx);
      return arr;
    });
  };

  const isFull = galleryImages.length >= MAX_GALLERY;
  const countColor = isFull ? '#f87171' : galleryImages.length >= MAX_GALLERY - 2 ? '#fbbf24' : '#c084fc';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ══ Section Heading ══════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '3px', height: '1.5rem', borderRadius: '4px',
          background: 'linear-gradient(to bottom, #818cf8, #c084fc)',
          flexShrink: 0,
        }} />
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
            Product Media Management
          </h3>
          <p style={{ margin: '0.1rem 0 0', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>
            Manage thumbnail & gallery images for this product
          </p>
        </div>
      </div>

      {/* ══ THUMBNAIL CARD ══════════════════════════════════ */}
      <GlassCard glow="#6366f1">
        <SectionLabel
          color="#818cf8"
          icon={<ZapIcon size={14} color="#818cf8" />}
          title="Thumbnail Image"
          badge="PRIMARY"
          subtitle="This image will appear in product cards and catalog pages."
          right={<>Recommended: 800×600 px<br />Max size: {MAX_SIZE_MB} MB · PNG, JPG, WEBP</>}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: thumbPreview ? 'auto 1fr' : '1fr',
          gap: '1.25rem',
          alignItems: 'flex-start',
        }}>

          {/* Large preview */}
          {thumbPreview && (
            <div style={{
              width: '200px',
              aspectRatio: '4/3',
              borderRadius: '0.875rem',
              overflow: 'hidden',
              background: '#060610',
              border: '1px solid rgba(129,140,248,0.25)',
              position: 'relative',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(129,140,248,0.1)',
              cursor: 'zoom-in',
            }}
              onClick={() => setPreviewSrc(thumbPreview)}
            >
              <img
                src={thumbPreview}
                alt="Thumbnail Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={clearThumb}
              />
              {/* Overlay on hover */}
              <div className="pmm-thumb-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.18s',
              }}>
                <EyeIcon size={22} color="white" />
              </div>

              {/* Top-right clear */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearThumb(); }}
                style={{
                  position: 'absolute', top: '0.4rem', right: '0.4rem',
                  background: 'rgba(239,68,68,0.85)', border: 'none',
                  borderRadius: '50%', width: '24px', height: '24px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  transition: 'transform 0.15s',
                }}
              >
                <XIcon size={12} color="white" />
              </button>

              {/* SET badge */}
              <div style={{
                position: 'absolute', bottom: '0.4rem', left: '0.4rem',
                background: 'linear-gradient(135deg,rgba(99,102,241,0.95),rgba(139,92,246,0.95))',
                borderRadius: '6px', padding: '0.12rem 0.42rem',
                fontSize: '0.58rem', fontWeight: '800', color: 'white',
                letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '3px',
              }}>
                <CheckIcon size={8} color="white" /> SET
              </div>

              {/* File meta */}
              {thumbFileMeta && (
                <div style={{
                  position: 'absolute', bottom: '0.4rem', right: '0.4rem',
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                  borderRadius: '6px', padding: '0.12rem 0.4rem',
                  fontSize: '0.57rem', color: 'rgba(255,255,255,0.55)',
                }}>
                  {formatBytes(thumbFileMeta.size)}
                </div>
              )}
            </div>
          )}

          {/* Upload controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1, minWidth: 0 }}>

            {/* Drop zone */}
            {!urlMode ? (
              <DropZone onFiles={handleThumbFiles}>
                <div style={{ padding: thumbPreview ? '1rem' : '2rem', textAlign: 'center' }}>
                  {thumbLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                      <Spinner color="#818cf8" size={24} />
                      <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: '600' }}>Processing image...</span>
                      <ProgressBar color="#818cf8" />
                    </div>
                  ) : (
                    <>
                      <div style={{
                        width: thumbPreview ? '36px' : '48px',
                        height: thumbPreview ? '36px' : '48px',
                        margin: '0 auto 0.75rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(129,140,248,0.1)',
                        border: '1px solid rgba(129,140,248,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <UploadIcon size={thumbPreview ? 18 : 22} color="#818cf8" />
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'rgba(255,255,255,0.75)', marginBottom: '0.2rem' }}>
                        {thumbPreview ? 'Replace thumbnail' : 'Upload thumbnail'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                        Drag & drop or click to browse
                      </div>
                    </>
                  )}
                </div>
              </DropZone>
            ) : null}

            {/* Error */}
            {thumbError && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '0.6rem', padding: '0.55rem 0.85rem',
                fontSize: '0.73rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                ⚠ {thumbError}
              </div>
            )}

            {/* URL toggle + input */}
            {!thumbLoading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setUrlMode(!urlMode)}
                  style={{
                    background: urlMode ? 'rgba(129,140,248,0.15)' : 'transparent',
                    border: '1px solid rgba(129,140,248,0.25)',
                    borderRadius: '0.5rem', padding: '0.45rem 0.8rem',
                    color: 'rgba(129,140,248,0.8)', fontSize: '0.72rem', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                    transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  <LinkIcon size={12} color="rgba(129,140,248,0.8)" />
                  Paste URL
                </button>

                {urlMode && (
                  <>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUrlSet(); } }}
                      autoFocus
                      style={{
                        flex: 1, background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '0.5rem', padding: '0.45rem 0.75rem',
                        color: 'rgba(255,255,255,0.85)', fontSize: '0.73rem',
                        outline: 'none', fontFamily: 'inherit', minWidth: 0,
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleUrlSet}
                      style={{
                        background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.35)',
                        borderRadius: '0.5rem', padding: '0.45rem 0.85rem',
                        color: '#818cf8', fontSize: '0.72rem', fontWeight: '700',
                        cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      Set URL
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Helper chips */}
            {!thumbPreview && !thumbLoading && (
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.1rem' }}>
                {['PNG', 'JPG', 'WEBP', 'GIF'].map((t) => (
                  <span key={t} style={{
                    background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)',
                    color: 'rgba(129,140,248,0.6)', fontSize: '0.62rem', fontWeight: '600',
                    padding: '0.15rem 0.5rem', borderRadius: '50px', letterSpacing: '0.05em',
                  }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* ══ GALLERY CARD ════════════════════════════════════ */}
      <GlassCard glow="#a855f7">
        <SectionLabel
          color="#c084fc"
          icon={<ImageIcon size={14} color="#c084fc" />}
          title="Product Gallery"
          badge={`${galleryImages.length} / ${MAX_GALLERY}`}
          subtitle="Front, side, folded, lifestyle & packaging shots. Drag tiles to reorder."
          right={<>Up to {MAX_GALLERY} images<br />Drag handles to reorder</>}
        />

        {/* Gallery grid */}
        {galleryImages.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))',
            gap: '0.75rem',
            marginBottom: '0.85rem',
          }}>
            {galleryImages.map((img, idx) => (
              <GalleryTile
                key={img.id}
                img={img}
                idx={idx}
                isDragging={dragIndex === idx}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={() => setDragIndex(null)}
                onPreview={() => setPreviewSrc(img.src)}
                onSetMain={() => setAsMain(img.id)}
                onRemove={() => removeGallery(img.id)}
              />
            ))}

            {/* Add-more tile */}
            {!isFull && (
              <DropZone onFiles={handleGalleryFiles} multiple>
                <div style={{
                  aspectRatio: '1/1',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '0.35rem', color: 'rgba(192,132,252,0.45)',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <PlusIcon size={16} color="rgba(192,132,252,0.6)" />
                  </div>
                  <span style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.04em' }}>Add</span>
                  <span style={{ fontSize: '0.57rem', color: 'rgba(192,132,252,0.3)' }}>
                    {MAX_GALLERY - galleryImages.length} left
                  </span>
                </div>
              </DropZone>
            )}
          </div>
        )}

        {/* Empty state */}
        {galleryImages.length === 0 && (
          <DropZone onFiles={handleGalleryFiles} multiple>
            <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              {galleryLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                  <Spinner color="#c084fc" size={28} />
                  <span style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: '600' }}>Uploading images...</span>
                  <ProgressBar color="#c084fc" />
                </div>
              ) : (
                <>
                  <div style={{
                    width: '64px', height: '64px', margin: '0 auto 1rem',
                    borderRadius: '1rem',
                    background: 'rgba(168,85,247,0.08)',
                    border: '1px solid rgba(168,85,247,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(192,132,252,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'rgba(255,255,255,0.72)', marginBottom: '0.35rem' }}>
                    Upload Gallery Images
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1.1rem', lineHeight: 1.5 }}>
                    Drag & drop multiple photos here, or click to browse.<br />Up to {MAX_GALLERY} images, max {MAX_SIZE_MB} MB each.
                  </div>
                  <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['Front', 'Side', 'Folded', 'Lifestyle', 'Packaging', '45° Angle'].map((t) => (
                      <span key={t} style={{
                        background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)',
                        color: 'rgba(192,132,252,0.65)', fontSize: '0.63rem', fontWeight: '600',
                        padding: '0.2rem 0.55rem', borderRadius: '50px', letterSpacing: '0.03em',
                      }}>{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </DropZone>
        )}

        {/* Uploading indicator when images already exist */}
        {galleryLoading && galleryImages.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginTop: '0.75rem', padding: '0.65rem 0.9rem',
            background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)',
            borderRadius: '0.65rem',
          }}>
            <Spinner color="#c084fc" size={16} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: '600', marginBottom: '0.35rem' }}>
                Compressing & adding images...
              </div>
              <ProgressBar color="#c084fc" />
            </div>
          </div>
        )}

        {/* Footer stats */}
        {galleryImages.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '0.9rem', paddingTop: '0.9rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: `${countColor}18`, border: `1px solid ${countColor}30`,
                borderRadius: '50px', padding: '0.2rem 0.7rem',
                fontSize: '0.67rem', fontWeight: '800', color: countColor,
                letterSpacing: '0.04em',
              }}>
                {galleryImages.length} / {MAX_GALLERY} Images
              </div>
              {isFull && (
                <span style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: '600' }}>
                  Max limit reached
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>
              <RefreshIcon size={11} color="rgba(255,255,255,0.25)" />
              Drag tiles to reorder
            </div>
          </div>
        )}
      </GlassCard>

      {/* ══ PREVIEW MODAL ═══════════════════════════════════ */}
      {previewSrc && <PreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />}

      {/* ── Global Styles ───────────────────────────────────── */}
      <style>{`
        @keyframes pmm-spin { to { transform: rotate(360deg); } }
        @keyframes pmm-fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Thumbnail hover overlay */
        div:hover > .pmm-thumb-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
