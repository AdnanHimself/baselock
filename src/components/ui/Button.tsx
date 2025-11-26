import React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    isLoading,
    variant = 'primary',
    icon,
    disabled,
    ...props
}) => {
    const baseStyles = "w-full font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-transparent";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)] border-blue-500/20",
        secondary: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200",
        success: "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)] hover:shadow-[0_0_20px_rgba(22,163,74,0.7)]",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_20px_rgba(220,38,38,0.7)]",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
            {children}
        </button>
    );
};
