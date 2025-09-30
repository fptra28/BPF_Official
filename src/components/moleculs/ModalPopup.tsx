import React, { useState, useEffect, useCallback } from 'react';

interface ModalPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalPopup({ isOpen, onClose, children }: ModalPopupProps) {
    const [visible, setVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            const timer = setTimeout(() => {
                setVisible(true);
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
            const timer = setTimeout(() => {
                setIsMounted(false);
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isMounted) return null;

    // Touch event handlers for better mobile support
    const handleTouchMove = (e: React.TouchEvent) => {
        // Prevent scrolling when modal is open
        e.preventDefault();
    };

    return (
        <div
            className={`fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-3 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            onTouchMove={handleTouchMove}
            style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'none',
                overscrollBehavior: 'contain',
                WebkitTapHighlightColor: 'transparent'
            }}
        >
            <div
                className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative transform transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    WebkitTransform: 'translateZ(0)',
                    transform: 'translateZ(0)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden'
                }}
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
