import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",
        danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};