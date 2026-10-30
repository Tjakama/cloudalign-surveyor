'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/TaskContext';

export default function MDDashboard() {
  const router = useRouter();
  const { tasks, updateTaskStatus } = useTasks();
  const [activeMenu, setActiveMenu] = useState('executive');

  const handleSignOut = () => {
    localStorage.removeItem('cloudalign_current_user');
    router.push('/');
  };

  const totalPipeline = tasks.length || 18;
  const inFieldOps = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length || 6;
  const pendingReviews = tasks.filter((t) => t.status === 'Pending Review').length || 4;
  const readyForSales = tasks.filter((t) => t.status === 'Ready for Sales' || t.status === 'Completed').length || 8;

  const techTasksCount = tasks.filter((t) => t.assignedDepartment === 'Technology Operations').length;
  const rndTasksCount = tasks.filter((t) => t.assignedDepartment === 'Research & Development').length;

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
            <h4 className="text-sm font-bold text-white leading-none">Managing Director</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Executive HQ • <span className="text-slate-500">md@cloudalign.co.za</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
            MD
          </div>
          <button
            onClick={handleSignOut}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-6 flex-shrink-0">
          <div>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">
              Executive Menu
            </p>
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveMenu('executive')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeMenu === 'executive' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>👑</span>
                <span>Executive Command Center</span>
              </button>
              <button
                onClick={() => setActiveMenu('all-departments')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeMenu === 'all-departments' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>🏢</span>
                <span>Multi-Dept Pipeline</span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8 space-y-8 max-w-7xl">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
                Company-Wide Oversight
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Enterprise Operations & Revenue Command
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time tracking across Tech Ops, R&D, Field Engineering, Finance, and Commercial Sales.
              </p>
            </div>
            <div className="text-right bg-slate-950 border border-slate-800 p-3.5 rounded-2xl">
              <p className="text-[10px] font-extrabold text-slate-500 uppercase">Quarterly Target</p>
              <p className="text-lg font-black text-purple-400">M 3,500,000</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Total Enterprise Pipeline</p>
              <p className="text-3xl font-black text-white">{totalPipeline}</p>
              <p className="text-[11px] font-medium text-purple-400 pt-1">All Active Projects</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Active Field Ops</p>
              <p className="text-3xl font-black text-amber-400">{inFieldOps}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Surveys In Progress</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Department Reviews</p>
              <p className="text-3xl font-black text-blue-400">{pendingReviews}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Pending Sign-off</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Ready Commercial Proposals</p>
              <p className="text-3xl font-black text-emerald-400">{readyForSales}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Quotations Cleared</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">Global Task Master List</h2>
                <p className="text-xs text-slate-400">Live operational feed from all active department leads.</p>
              </div>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold">
                Live Local Storage Sync
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase font-extrabold text-[10px]">
                    <th className="pb-3">Task ID</th>
                    <th className="pb-3">Client / Project</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Survey Domain</th>
                    <th className="pb-3">Assigned Engineer</th>
                    <th className="pb-3">Pipeline Status</th>
                    <th className="pb-3">Quotation Value</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-slate-300">{task.id}</td>
                      <td className="py-3.5 font-bold text-white">{task.clientName}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {task.assignedDepartment}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-300">{task.surveyType}</td>
                      <td className="py-3.5 text-slate-300">{task.assignedEngineer}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 font-bold rounded-full text-[10px] border border-amber-500/20">
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-white">
                        {task.quotationAmount || 'M 110,000.00'}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Ready for Sales')}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded-lg shadow-sm"
                        >
                          Executive Approval
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}