import React, { useState, useEffect, useCallback } from 'react';

interface ModalPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalPopup({ isOpen, onClose, children }: ModalPopupProps) {
    const [visible, setVisible] = useState(isOpen);
    const [isIOS, setIsIOS] = useState(false);

    // Deteksi perangkat iOS
    useEffect(() => {
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIOS(isIOSDevice);
    }, []);

    // Handle close dengan debounce
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    // Handle touch move untuk mencegah scroll di belakang modal di iOS
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (isIOS) {
            e.preventDefault();
        }
    }, [isIOS]);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            // Tambahkan class ke body untuk mencegah scroll
            document.body.style.overflow = 'hidden';
            // Untuk iOS
            if (isIOS) {
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }
        } else {
            const timeout = setTimeout(() => {
                setVisible(false);
                // Kembalikan style body
                document.body.style.overflow = '';
                if (isIOS) {
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen, isIOS]);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
            onTouchMove={isIOS ? handleTouchMove : undefined}
            style={{
                WebkitOverflowScrolling: 'touch',
                overflowY: 'auto',
                position: 'fixed',
                width: '100%',
                height: '100%'
            }}
        >
            <div
                className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative transform transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    WebkitOverflowScrolling: 'touch',
                    overflowY: 'auto',
                    maxHeight: '90vh'
                }}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="text-gray-700">{children}</div>
            </div>
        </div>
    );
}
