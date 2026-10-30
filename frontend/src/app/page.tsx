'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const USER_DIRECTORY: Record<string, { role: string; path: string; name: string }> = {
  'md@cloudalign.co.za': {
    name: 'Executive MD',
    role: 'Managing Director',
    path: '/md/dashboard',
  },
  'techlead@cloudalign.co.za': {
    name: 'Tech Lead',
    role: 'Technology Operations Lead',
    path: '/tech-lead/dashboard',
  },
  'rndlead@cloudalign.co.za': {
    name: 'R&D Lead',
    role: 'Research & Development Lead',
    path: '/rnd-lead/dashboard',
  },
  'letjamela.mabea@cloudalign.co.za': {
    name: 'Letjamela Mabea',
    role: 'Field Engineer',
    path: '/engineer/dashboard',
  },
  'sales@cloudalign.co.za': {
    name: 'Sales Manager',
    role: 'Sales & Marketing',
    path: '/sales/dashboard',
  },
  'finance@cloudalign.co.za': {
    name: 'Chief Accountant',
    role: 'Finance Department',
    path: '/finance/dashboard',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const user = USER_DIRECTORY[cleanEmail];

    if (user) {
      localStorage.setItem('cloudalign_current_user', JSON.stringify({ email: cleanEmail, ...user }));
      router.push(user.path);
    } else {
      setError('Invalid credentials or unauthorized email address.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src="/images/log.png"
              alt="Cloudalign Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Cloudalign Surveyor</h1>
          
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="e.g. techlead@cloudalign.co.za"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            Login →
          </button>
        </form>

      </div>
    </div>
  );
}