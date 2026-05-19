import React from 'react';

export const Input = ({ label, id, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow shadow-sm"
                {...props}
            />
        </div>
    );
};