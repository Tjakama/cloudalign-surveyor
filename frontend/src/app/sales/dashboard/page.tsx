'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTasks, SurveyTask } from '@/context/TaskContext';

export default function SalesDashboard() {
  const router = useRouter();
  const { tasks, updateTaskStatus } = useTasks();

  const [activeMenu, setActiveMenu] = useState('pipeline');
  const [selectedTask, setSelectedTask] = useState<SurveyTask | null>(null);

  const handleSignOut = () => {
    localStorage.removeItem('cloudalign_current_user');
    router.push('/');
  };

  // Filter tasks cleared by Tech Lead
  // Filter tasks cleared by Tech Lead
  const salesPipelineTasks = tasks.filter(
    (t) => t.status === 'Ready for Sales' || t.status === ('Proposal Sent' as any) || t.status === ('Contract Signed' as any)
  );

  const pendingProposals = salesPipelineTasks.filter((t) => t.status === 'Ready for Sales');
  const activeQuotes = salesPipelineTasks.filter((t) => t.status === ('Proposal Sent' as any));
  const closedDeals = salesPipelineTasks.filter((t) => t.status === ('Contract Signed' as any));
  // Commercial Pricing & Margin Logic
  const calculateFinancials = (task: SurveyTask) => {
    const baseBomCost = task.surveyType.includes('Solar') ? 78500 : 43100;
    const marginPercent = 0.25; // 25% gross margin target
    const laborAndInstall = 8500;
    const subtotal = (baseBomCost + laborAndInstall) / (1 - marginPercent);
    const vatAmount = subtotal * 0.15; // 15% VAT
    const grandTotal = subtotal + vatAmount;

    return {
      baseBomCost,
      laborAndInstall,
      subtotal,
      vatAmount,
      grandTotal,
    };
  };

  const handlePrintProposal = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col print:bg-white print:text-black">
      {/* Top Header - Hidden when printing PDF */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image src="/images/log.png" alt="Cloudalign" fill className="object-contain" priority />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-white leading-none">Nthabiseng Phoofolo</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sales Lead • <span className="text-slate-500">sales@cloudalign.co.za</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-emerald-600/30">
            NP
          </div>
          <button
            onClick={handleSignOut}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 print:block">
        {/* Sidebar - Hidden when printing PDF */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-6 flex-shrink-0 print:hidden">
          <div>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">Commercial Menu</p>
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveMenu('pipeline')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'pipeline' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>💼</span>
                <span>Sales Pipeline</span>
              </button>
              <button
                onClick={() => setActiveMenu('quotes')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'quotes' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>📜</span>
                <span>Active Quotations</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl print:p-0 print:max-w-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between print:hidden">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Commercial Proposal Generator</h1>
              <p className="text-xs text-slate-400 mt-1">
                Convert approved technical BoMs into commercial client proposals with automated margin schedules.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl font-mono">
              📈 Target Q4
            </div>
          </div>

          {/* Dynamic Commercial Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 print:hidden">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Ready for Proposal</p>
              <p className="text-3xl font-black text-amber-400">{pendingProposals.length}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Cleared Technical BoMs</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Proposals Out</p>
              <p className="text-3xl font-black text-blue-400">{activeQuotes.length}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Client Review Phase</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Won Contracts</p>
              <p className="text-3xl font-black text-emerald-400">{closedDeals.length}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Signed Agreements</p>
            </div>
          </div>

          {/* Task Feed */}
          <div className="space-y-4 print:hidden">
            <div>
              <h2 className="text-lg font-extrabold text-white">Cleared Opportunities</h2>
              <p className="text-xs text-slate-400">Select a project to review margin calculations and issue formal proposals.</p>
            </div>

            {salesPipelineTasks.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xl">
                <p className="text-sm font-bold text-slate-300">No proposals pending.</p>
                <p className="text-xs text-slate-500">Approve a survey report from the Tech Lead dashboard to generate commercial proposals here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {salesPipelineTasks.map((task) => {
                  const financials = calculateFinancials(task);
                  return (
                    <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {task.surveyType}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            {task.status}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{task.clientName}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">📍 {task.location}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                          <span className="text-[11px] text-slate-400">Total Quote:</span>
                          <span className="text-sm font-mono font-bold text-emerald-400">
                            M {financials.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedTask(task)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
                      >
                        📄 Generate Proposal Package →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Commercial Proposal Package Modal & Printable Quotation View */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-white print:backdrop-none">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black">
            
            {/* Modal Header - Hidden on Print */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4 print:hidden">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Commercial Proposal Package
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{selectedTask.clientName}</h3>
                <p className="text-xs text-slate-400">Location: {selectedTask.location} • Ref: {selectedTask.id}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white font-bold text-lg p-1">✕</button>
            </div>

            {/* Print Letterhead - Only Shows When Exporting PDF */}
            <div className="hidden print:flex justify-between items-center border-b pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-black">CLOUDALIGN (PTY) LTD</h1>
                <p className="text-xs text-gray-600">Enterprise Site Infrastructure Quotation</p>
              </div>
              <div className="text-right text-xs">
                <p><strong>Quote Ref:</strong> CA-{selectedTask.id}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Financial Schedule */}
            {(() => {
              const fin = calculateFinancials(selectedTask);
              return (
                <div className="space-y-5 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 print:bg-gray-50 print:border-gray-200 print:text-black">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider print:text-gray-600">
                      Client & Scope Summary
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <p><strong>Client Name:</strong> {selectedTask.clientName}</p>
                      <p><strong>Survey Domain:</strong> {selectedTask.surveyType}</p>
                      <p><strong>Site Location:</strong> {selectedTask.location}</p>
                      <p><strong>Lead Engineer:</strong> {selectedTask.assignedEngineer}</p>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 print:bg-white print:border-gray-200">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 print:border-gray-200 print:text-gray-600">
                      Commercial Pricing Breakdown
                    </p>

                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 uppercase text-[9px] border-b border-slate-800 pb-1 print:border-gray-200 print:text-gray-600">
                          <th className="pb-2">Description</th>
                          <th className="pb-2 text-right">Amount (LSL/ZAR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                        <tr>
                          <td className="py-2.5">Hardware & Equipment (Auto-BoM Total)</td>
                          <td className="py-2.5 text-right font-mono">M {fin.baseBomCost.toLocaleString('.2f')}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">Professional Installation, Cabling & Commissioning</td>
                          <td className="py-2.5 text-right font-mono">M {fin.laborAndInstall.toLocaleString('.2f')}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold">Subtotal (Excl. VAT)</td>
                          <td className="py-2.5 text-right font-mono font-bold">M {fin.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-slate-400">Standard Value Added Tax (15% VAT)</td>
                          <td className="py-2.5 text-right font-mono text-slate-400">M {fin.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr className="text-sm font-bold border-t border-slate-700 print:border-gray-300">
                          <td className="py-3 text-emerald-400 print:text-black">Grand Total (Incl. VAT)</td>
                          <td className="py-3 text-right font-mono text-emerald-400 print:text-black">
                            M {fin.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Terms */}
                  <div className="text-[10px] text-slate-400 space-y-1 print:text-gray-600">
                    <p>• Quotation valid for 30 calendar days from date of issue.</p>
                    <p>• 50% deposit required upon order confirmation; balance upon successful commissioning sign-off.</p>
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons - Hidden on Print */}
            <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800 print:hidden">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintProposal}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-xs transition-all"
              >
                🖨️ Export PDF Proposal
              </button>
              <button
                onClick={() => {
                  updateTaskStatus(selectedTask.id, 'Proposal Sent' as any);
                  setSelectedTask(null);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs transition-all"
              >
                🚀 Mark as Sent to Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}