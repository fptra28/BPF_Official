import { ReactNode } from "react";

interface ProfilContainerProps {
    children: ReactNode;
    title?: string;
    description?: string;
    hideTitle?: boolean;
    titleClassName?: string;
    descriptionClassName?: string;
}

export default function ProfilContainer({ children, title, description, hideTitle = false, titleClassName = '', descriptionClassName = '' }: ProfilContainerProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {!hideTitle && title && (
                <div className="bg-gradient-to-r from-[#080031] to-[#FF0000] p-4 sm:p-5">
                    <div className="text-center">
                        <h1 className={`text-xl md:text-2xl font-bold text-white tracking-wide ${titleClassName}`}>
                            {title}
                        </h1>
                        {description && (
                            <p className={`mt-1.5 text-white/90 text-sm md:text-base font-normal max-w-3xl mx-auto ${descriptionClassName}`}>
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            )}
            <div className="p-4 sm:p-6 md:p-8">
                {children}
            </div>
        </div>
    );
}
