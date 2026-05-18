import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "min-h-[44px] px-6 font-text text-[17px] leading-[25px] rounded-full transition-colors duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-apple-blue text-white hover:bg-apple-blue-hover active:bg-apple-blue-press",
    secondary: "bg-transparent border-2 border-apple-blue text-apple-blue hover:bg-apple-blue/5 hover:border-apple-blue-hover active:border-apple-blue-press",
    ghost: "bg-transparent text-apple-text-dominant rounded-none hover:bg-black/5 active:bg-black/10 px-2"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};