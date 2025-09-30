import React, { useState, useEffect } from 'react';

interface ModalPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalPopup({ isOpen, onClose, children }: ModalPopupProps) {
    const [visible, setVisible] = useState(isOpen);

    // Handle escape key and body scroll
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                // Restore body scroll when modal is closed
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            };
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 300); // Durasi sama dengan CSS
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative transform transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl focus:outline-none"
                    onClick={onClose}
                    aria-label="Tutup"
                >
                    &times;
                </button>
                <div className="text-gray-700">{children}</div>
            </div>
        </div>
    );
}
