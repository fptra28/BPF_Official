import React, { useState, useEffect } from 'react';

interface ModalPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalPopup({ isOpen, onClose, children }: ModalPopupProps) {
    const [visible, setVisible] = useState(false);

    // Simpan posisi scroll saat membuka modal
    const scrollY = React.useRef(0);

    useEffect(() => {
        if (isOpen) {
            // Simpan posisi scroll saat ini
            scrollY.current = window.scrollY;
            
            // Nonaktifkan scroll pada body
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY.current}px`;
            document.body.style.width = '100%';
            
            setVisible(true);
        } else {
            // Aktifkan kembali scroll pada body
            document.body.style.overflow = 'unset';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Kembalikan posisi scroll
            window.scrollTo(0, scrollY.current);
            
            const timeout = setTimeout(() => {
                setVisible(false);
            }, 300);
            
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxHeight: '90vh',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 'auto 0' // Pusatkan vertikal
                }}
            >
                <div 
                    className="flex-1 p-6 md:p-8"
                    style={{
                        overflow: 'visible',
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
