'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/TaskContext';

export interface StatCardItem {
  label: string;
  value: string | number;
  subtext: string;
  color?: string;
}

interface LeadDashboardLayoutProps {
  userName: string;
  userRole: string;
  userEmail: string;
  userInitials: string;
  departmentTitle: string;
  departmentSubtitle: string;
  stats: StatCardItem[];
  children: React.ReactNode;
  showAssignButton?: boolean;
}

export default function LeadDashboardLayout({
  userName,
  userRole,
  userEmail,
  userInitials,
  departmentTitle,
  departmentSubtitle,
  stats,
  children,
  showAssignButton = true,
}: LeadDashboardLayoutProps) {
  const router = useRouter();
  const { addTask } = useTasks();

  const [activeMenu, setActiveMenu] = useState('operations');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    surveyType: 'Solar & UPS',
    location: '',
    contactPerson: '',
    contactPhone: '',
    assignedEngineer: 'Letjamela Mabea',
  });

  const handleSignOut = () => {
    localStorage.removeItem('cloudalign_current_user');
    router.push('/');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      ...formData,
      assignedDepartment: userRole.includes('R&D') ? 'Research & Development' : 'Technology Operations',
    });
    setIsAssignModalOpen(false);
    setFormData({
      clientName: '',
      surveyType: 'Solar & UPS',
      location: '',
      contactPerson: '',
      contactPhone: '',
      assignedEngineer: 'Letjamela Mabea',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image src="/images/log.png" alt="Cloudalign" fill className="object-contain" priority />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-white leading-none">{userName}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {userRole} • <span className="text-slate-500">{userEmail}</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-600/30">
            {userInitials}
          </div>
          <button
            onClick={handleSignOut}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-6 flex-shrink-0">
          <div>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">
              Management Menu
            </p>
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveMenu('operations')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'operations' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>📊</span>
                <span>Operations Dashboard</span>
              </button>

              <button
                onClick={() => setActiveMenu('opportunities')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'opportunities' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>📁</span>
                <span>All Opportunities</span>
              </button>

              <button
                onClick={() => setActiveMenu('workload')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'workload' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>👷</span>
                <span>Field Engineer Workload</span>
              </button>

              <button
                onClick={() => setActiveMenu('proposals')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'proposals' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>📋</span>
                <span>Proposals & BOM Approvals</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">{departmentTitle}</h1>
              <p className="text-xs text-slate-400 mt-1">{departmentSubtitle}</p>
            </div>
            {showAssignButton && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
              >
                <span className="text-sm">+</span>
                <span>Assign New Task</span>
              </button>
            )}
          </div>

          {/* Dynamic Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
                <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color || 'text-white'}`}>{stat.value}</p>
                <p className="text-[11px] font-medium text-slate-500 pt-1">{stat.subtext}</p>
              </div>
            ))}
          </div>

          {/* Custom Department Content */}
          {children}
        </main>
      </div>

      {/* Task Creation Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-white">Assign New Technical Survey</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Client Name / Project</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Maluti Mountain Brewery"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Survey Domain</label>
                  <select
                    value={formData.surveyType}
                    onChange={(e) => setFormData({ ...formData, surveyType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Solar & UPS">Solar & UPS</option>
                    <option value="Wi-Fi Network Assessment">Wi-Fi Network</option>
                    <option value="CCTV & Access Control">CCTV & Access Control</option>
                    <option value="Generator Backup">Generator Backup</option>
                    <option value="Data Centre Infrastructure">Data Centre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Assigned Field Engineer</label>
                  <select
                    value={formData.assignedEngineer}
                    onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Letjamela Mabea">Letjamela Mabea</option>
                    <option value="Thatho Motsoasele">Thatho Motsoasele</option>
                    <option value="Mphahamele Mbele">Mphahamele Mbele</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Site Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Maseru Industrial Area"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30">
                  Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}