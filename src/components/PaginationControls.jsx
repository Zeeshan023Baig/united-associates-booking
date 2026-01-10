import { useState, useEffect } from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    const [inputPage, setInputPage] = useState(currentPage);

    useEffect(() => {
        setInputPage(currentPage);
    }, [currentPage]);

    const handleSubmit = () => {
        let p = parseInt(inputPage);
        if (isNaN(p)) {
            setInputPage(currentPage);
            return;
        }
        const target = Math.max(1, Math.min(p, totalPages));
        onPageChange(target);
        setInputPage(target);
    };

    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="admin-btn"
                style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: currentPage === 1 ? 'rgba(0,0,0,0.1)' : 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    opacity: currentPage === 1 ? 0.5 : 1
                }}
            >
                Previous
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Page</span>
                <input
                    type="number"
                    style={{
                        width: '3rem',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        padding: '0.25rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                    }}
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    onBlur={handleSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>of {totalPages}</span>
            </div>
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: currentPage === totalPages ? 'rgba(0,0,0,0.1)' : 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    opacity: currentPage === totalPages ? 0.5 : 1
                }}
            >
                Next
            </button>
        </div>
    );
};

export default PaginationControls;
