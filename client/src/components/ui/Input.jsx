import React from 'react';

export const Input = ({ label, id, ...props }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={id} className="font-text text-[12px] font-semibold text-apple-text-dominant mb-2 block">
          {label}
        </label>
      )}
      <input
        id={id}
        className="min-h-[44px] px-4 py-3 bg-white border border-[#D5D5D7] rounded-lg font-text text-[17px] text-apple-text-dominant placeholder-apple-text-tertiary focus:outline-none focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/10 transition-all"
        {...props}
      />
    </div>
  );
};