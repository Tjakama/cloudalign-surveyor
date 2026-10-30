'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/TaskContext';

export default function FinanceDashboard() {
  const router = useRouter();
  const { tasks } = useTasks();

  const handleSignOut = () => {
    localStorage.removeItem('cloudalign_current_user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image src="/images/log.png" alt="Cloudalign" fill className="object-contain" priority />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-white leading-none">Chief Accountant</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Finance Lead • <span className="text-slate-500">finance@cloudalign.co.za</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
            CA
          </div>
          <button onClick={handleSignOut} className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700">
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto p-8 space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-black text-white">Financial Audit & Margin Verification</h1>
          <p className="text-xs text-slate-400 mt-1">Audit project BoM costings against catalog pricing and grant margin sign-offs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    Finance Audit
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Margin: 22.5%</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{task.clientName}</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">{task.surveyType}</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">Cost Est: {task.quotationAmount || 'M 85,000'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase">Audit Status</p>
                  <p className="text-xs font-bold text-slate-300">Pending Sign-off</p>
                </div>
                <button onClick={() => alert(`Financial audit cleared for ${task.clientName}!`)} className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] rounded-lg">
                  ✔ Sign-off Margin
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}