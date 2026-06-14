import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';
import { LogIn, UserPlus, ShieldCheck, ShoppingBag, Eye, EyeOff } from 'lucide-react';

interface LoginRegisterProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginRegister({ onLoginSuccess }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@sakubisnis.com');
  const [password, setPassword] = useState('password123');
  const [businessName, setBusinessName] = useState('SakuBisnis Official');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap isi semua bidang');
      return;
    }
    if (!isLogin && !businessName) {
      setError('Harap isi nama bisnis Anda');
      return;
    }

    // Success simulation
    const simulatedUser: User = {
      email: email,
      businessName: isLogin ? 'SakuBisnis HQ' : businessName,
      role: 'Administrator',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1I-ISJNY42ipfSakYq8vlJn2GG2aGVuIj5wrmHrFxI89Bw1lC5Kac2bQKPNHcXFtM0ePZ2UQTLu7AU9jnRL6s2K0WfHI8Pyfm-1DLwRuOLTpf84qRIalBa_0JpY5QH0qfUeH3-pk8B1RLCCa1Uptie5TlG83yken60qET39KBKcMFlD-Mxk-gr-wKie0hL435dDmCK4J0sV7jdalPoxM6I40rWpZPcKMNeYwigmq_MC-3Zx84DF5stwX9lGBVVJflaiJ_Ksu_PW8'
    };
    onLoginSuccess(simulatedUser);
  };

  const handleBypass = () => {
    onLoginSuccess({
      email: 'demo@sakubisnis.com',
      businessName: 'Toko Serba Ada',
      role: 'Owner',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1I-ISJNY42ipfSakYq8vlJn2GG2aGVuIj5wrmHrFxI89Bw1lC5Kac2bQKPNHcXFtM0ePZ2UQTLu7AU9jnRL6s2K0WfHI8Pyfm-1DLwRuOLTpf84qRIalBa_0JpY5QH0qfUeH3-pk8B1RLCCa1Uptie5TlG83yken60qET39KBKcMFlD-Mxk-gr-wKie0hL435dDmCK4J0sV7jdalPoxM6I40rWpZPcKMNeYwigmq_MC-3Zx84DF5stwX9lGBVVJflaiJ_Ksu_PW8'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans selection:bg-blue-600 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-lg p-8 card-shadow"
        id="login-card"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-sm flex items-center justify-center text-white font-extrabold text-2xl tracking-tighter mb-3 shadow-sm select-none">
            S
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1 uppercase">
            Saku<span className="text-blue-600 font-medium">Bisnis</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5 text-center">
            Pusat Kendali ERP & Inventaris
          </p>
        </div>

        <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2 ${
              isLogin ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            id="tab-login"
          >
            <LogIn size={14} className="stroke-[2.5]" />
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2 ${
              !isLogin ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            id="tab-register"
          >
            <UserPlus size={14} className="stroke-[2.5]" />
            Daftar
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                Nama Bisnis / Toko
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Toko Kue Enak, PT Jaya Mandiri..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-xs font-semibold"
                id="input-business"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-xs font-semibold"
              id="input-email"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-xs font-semibold pr-10"
                id="input-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                id="btn-eye"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/15 active:scale-[0.98] text-white py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            id="btn-submit"
          >
            {isLogin ? (
              <>
                <LogIn size={16} className="stroke-[2.5]" />
                Masuk ke Dasbor
              </>
            ) : (
              <>
                <UserPlus size={16} className="stroke-[2.5]" />
                Buat Akun Bisnis
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest bg-white select-none">atau</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={handleBypass}
          className="w-full bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-600 py-2.5 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-slate-200 cursor-pointer shadow-xs"
          id="btn-demo-signin"
        >
          <ShieldCheck size={16} className="text-emerald-600 stroke-[2.5]" />
          Masuk Langsung (Demo Mode)
        </button>

        <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-wider leading-relaxed">
          Seluruh data disimpan dengan aman di perangkat lokal Anda.
        </p>
      </motion.div>
    </div>
  );
}
