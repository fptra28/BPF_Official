import React, { useState, useEffect, useRef } from 'react';

interface ModalPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalPopup({ isOpen, onClose, children }: ModalPopupProps) {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent background scrolling when modal is open
            document.body.style.overflow = 'hidden';
            setVisible(true);
            setMounted(true);
        } else {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
            const timer = setTimeout(() => {
                setVisible(false);
                setMounted(false);
            }, 300);
            return () => clearTimeout(timer);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Prevent touch events from propagating to the background
    const handleTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation();
    };

    if (!mounted) return null;

    return (
        <div
            ref={modalRef}
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            onTouchMove={handleTouchMove}
        >
            <div
                className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative transform transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl focus:outline-none"
                    onClick={onClose}
                    aria-label="Tutup modal"
                >
                    &times;
                </button>
                <div className="text-gray-700">{children}</div>
            </div>
        </div>
    );
}
