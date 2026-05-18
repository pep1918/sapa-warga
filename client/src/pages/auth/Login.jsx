import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-apple-surface-light flex items-center justify-center p-6">
      <div className="bg-white p-10 md:p-[48px] max-w-[480px] w-full rounded-none border border-apple-surface-light shadow-apple-medium">
        <h1 className="font-display font-semibold text-[28px] leading-[32px] text-apple-text-dominant mb-2 text-center">
          Masuk ke Sapa Warga
        </h1>
        <p className="font-text text-[17px] text-apple-text-tertiary mb-8 text-center">
          Akses layanan administrasi kelurahan Anda
        </p>

        <form onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            id="email" 
            type="email" 
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Input 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <div className="mt-8">
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};