'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/TaskContext';

export default function RndLeadDashboard() {
  const router = useRouter();
  const { tasks, addTask, updateTaskStatus } = useTasks();

  const [activeMenu, setActiveMenu] = useState('operations');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    surveyType: 'Wi-Fi Network Assessment',
    location: '',
    contactPerson: '',
    contactPhone: '',
    assignedEngineer: 'Keketso Ramaema',
    assignedDepartment: 'Research & Development' as const,
  });

  const handleSignOut = () => {
    localStorage.removeItem('cloudalign_current_user');
    router.push('/');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(formData);
    setIsAssignModalOpen(false);
  };

  const rndTasks = tasks.filter((t) => t.assignedDepartment === 'Research & Development' || t.surveyType.includes('Assessment'));

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
            <h4 className="text-sm font-bold text-white leading-none">Dr. Nkopane Mokoena</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              R&D Lead • <span className="text-slate-500">rndlead@cloudalign.co.za</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
            NM
          </div>
          <button onClick={handleSignOut} className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700">
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-6 flex-shrink-0">
          <div>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">R&D Menu</p>
            <nav className="space-y-1.5">
              <button onClick={() => setActiveMenu('operations')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${activeMenu === 'operations' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <span>🔬</span><span>R&D Dashboard</span>
              </button>
              <button onClick={() => setActiveMenu('opportunities')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${activeMenu === 'opportunities' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <span>📁</span><span>Prototype Pipeline</span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8 space-y-8 max-w-7xl">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">R&D Innovation & Design Control</h1>
              <p className="text-xs text-slate-400 mt-1">Manage custom prototype surveys and network design reviews.</p>
            </div>
            <button onClick={() => setIsAssignModalOpen(true)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30">
              + Dispatch R&D Survey
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">R&D Projects</p>
              <p className="text-3xl font-black text-white">{rndTasks.length || 6}</p>
              <p className="text-[11px] font-medium text-indigo-400 pt-1">Prototype Phase</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Active Prototypes</p>
              <p className="text-3xl font-black text-amber-400">3</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Field Testing</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Pending R&D Reviews</p>
              <p className="text-3xl font-black text-purple-400">2</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Design Approvals</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Approved Designs</p>
              <p className="text-3xl font-black text-emerald-400">14</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Passed Technical Gate</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-white">R&D Projects & Prototype Reviews</h2>
              <p className="text-xs text-slate-400">Review custom engineering specs submitted from the field.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {rndTasks.map((task) => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        R&D Spec
                      </span>
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                        {task.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{task.surveyType}</h3>
                      <p className="text-xs font-semibold text-indigo-400 mt-0.5">{task.clientName}</p>
                      <p className="text-[11px] text-slate-400 mt-1">📍 {task.location}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-500 uppercase">Engineer</p>
                      <p className="text-xs font-bold text-slate-300">{task.assignedEngineer}</p>
                    </div>
                    <button onClick={() => updateTaskStatus(task.id, 'Ready for Sales')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-lg">
                      Approve Design
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}