'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTasks, SurveyTask } from '@/context/TaskContext';

export default function TechLeadDashboard() {
  const router = useRouter();
  const { tasks, addTask, updateTaskStatus } = useTasks();

  const [activeMenu, setActiveMenu] = useState('operations');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [inspectingTask, setInspectingTask] = useState<SurveyTask | null>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    surveyType: 'CCTV & Security',
    location: '',
    contactPerson: '',
    contactPhone: '',
    assignedEngineer: 'Letjamela Mabea',
    assignedDepartment: 'Technology Operations' as const,
  });

  const handleSignOut = () => {
    localStorage.removeItem('cloudalign_current_user');
    router.push('/');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(formData);
    setIsAssignModalOpen(false);
    setFormData({
      clientName: '',
      surveyType: 'CCTV & Security',
      location: '',
      contactPerson: '',
      contactPhone: '',
      assignedEngineer: 'Letjamela Mabea',
      assignedDepartment: 'Technology Operations',
    });
  };

  const techTasks = tasks.filter((t) => t.assignedDepartment === 'Technology Operations');

  const techOpportunitiesCount = techTasks.length;
  const surveysInFieldCount = techTasks.filter((t) => t.status === 'Assigned' || t.status === 'In Progress').length;
  const pendingBomReviewsCount = techTasks.filter((t) => t.status === 'Pending Review').length;
  const readyForSalesCount = techTasks.filter((t) => t.status === 'Ready for Sales').length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image src="/images/log.png" alt="Cloudalign" fill className="object-contain" priority />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-white leading-none">Tsepo Masita</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tech Lead • <span className="text-slate-500">techlead@cloudalign.co.za</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-600/30">
            TM
          </div>
          <button onClick={handleSignOut} className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700">
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-6 flex-shrink-0">
          <div>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">Management Menu</p>
            <nav className="space-y-1.5">
              <button onClick={() => setActiveMenu('operations')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${activeMenu === 'operations' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <span>📊</span><span>Operations Dashboard</span>
              </button>
              <button onClick={() => setActiveMenu('opportunities')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${activeMenu === 'opportunities' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <span>📁</span><span>All Opportunities</span>
              </button>
              <button onClick={() => setActiveMenu('workload')} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${activeMenu === 'workload' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <span>👷</span><span>Field Engineer Workload</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Operations & Resource Management</h1>
              <p className="text-xs text-slate-400 mt-1">Monitor live technical tasks, review photo evidence, and clear auto-generated BoMs.</p>
            </div>
            <button onClick={() => setIsAssignModalOpen(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30">
              + Assign New Task
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Tech Opportunities</p>
              <p className="text-3xl font-black text-white">{techOpportunitiesCount}</p>
              <p className="text-[11px] font-medium text-blue-400 pt-1">Active Site Pipeline</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Surveys In Field</p>
              <p className="text-3xl font-black text-amber-400">{surveysInFieldCount}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Active Site Inspections</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Pending BOM Reviews</p>
              <p className="text-3xl font-black text-purple-400">{pendingBomReviewsCount}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Technical Sign-offs</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
              <p className="text-xs font-semibold text-slate-400">Ready for Sales</p>
              <p className="text-3xl font-black text-emerald-400">{readyForSalesCount}</p>
              <p className="text-[11px] font-medium text-slate-500 pt-1">Proposals Cleared</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-white">Assigned Tasks & Status</h2>
              <p className="text-xs text-slate-400">Inspect submitted survey reports before granting final approval.</p>
            </div>

            {techTasks.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xl">
                <p className="text-sm font-bold text-slate-300">No active tasks in system.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {techTasks.map((task) => (
                  <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/20">{task.id}</span>
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">{task.status}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{task.surveyType}</h3>
                        <p className="text-xs font-semibold text-blue-400 mt-0.5">{task.clientName}</p>
                        <p className="text-[11px] text-slate-400 mt-1">📍 {task.location}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-500 uppercase">Engineer</p>
                        <p className="text-xs font-bold text-slate-300">{task.assignedEngineer}</p>
                      </div>
                      <button
                        onClick={() => setInspectingTask(task)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                      >
                        🔍 View Survey Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Dynamic Survey Inspection Report Modal */}
      {inspectingTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Field Inspection Report & Photos
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{inspectingTask.clientName}</h3>
                <p className="text-xs text-slate-400">📍 Location: {inspectingTask.location} • Engineer: {inspectingTask.assignedEngineer}</p>
              </div>
              <button onClick={() => setInspectingTask(null)} className="text-slate-400 hover:text-white font-bold text-lg p-1">✕</button>
            </div>

            {inspectingTask.status === 'Assigned' || inspectingTask.status === 'In Progress' ? (
              <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
                <p className="text-sm font-bold text-amber-400">⏳ Survey In Progress by Field Engineer</p>
                <p className="text-xs text-slate-400">
                  {inspectingTask.assignedEngineer} has not submitted the final survey report for <strong>{inspectingTask.surveyType}</strong> yet. Once submitted, the auto-generated BoM and captured site photos will appear here for your review.
                </p>
              </div>
            ) : (
              <div className="space-y-5 text-xs">
                {/* Domain-Aware Written Report */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    1. Written Survey Report & Ground Specs ({inspectingTask.surveyType})
                  </p>
                  
                  {inspectingTask.surveyType.includes('Solar') ? (
                    <div className="grid grid-cols-2 gap-3 text-slate-200">
                      <p><strong>System Domain:</strong> Solar & UPS</p>
                      <p><strong>Status:</strong> <span className="text-purple-400">{inspectingTask.status}</span></p>
                      <p><strong>Inverter Size:</strong> 5 kVA Hybrid Inverter</p>
                      <p><strong>Battery Bank:</strong> 10 kWh Lithium-ion Pack</p>
                      <p><strong>PV Panels:</strong> 12 x 550W Monocrystalline</p>
                      <p><strong>DB Distance:</strong> 25 meters</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-slate-200">
                      <p><strong>System Domain:</strong> CCTV & Security</p>
                      <p><strong>Status:</strong> <span className="text-purple-400">{inspectingTask.status}</span></p>
                      <p><strong>Camera Count:</strong> 8 Cameras (4 Dome, 4 Bullet)</p>
                      <p><strong>NVR & Storage:</strong> 16-Channel NVR + 4TB HDD</p>
                    </div>
                  )}

                  <p className="text-slate-300 pt-2 border-t border-slate-800/60 leading-relaxed">
                    <strong>Engineer Observations:</strong> Site inspection verified structural integrity and electrical grid connections. All conduits and mounting paths cleared.
                  </p>
                </div>

                {/* Photo Gallery */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    2. Captured Site Photo Evidence
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">📷</div>
                      <div>
                        <p className="font-bold text-white text-[11px]">Primary Installation Point</p>
                        <span className="text-[10px] text-emerald-400">Verified Photo</span>
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">📷</div>
                      <div>
                        <p className="font-bold text-white text-[11px]">Main DB Board / Rack</p>
                        <span className="text-[10px] text-emerald-400">Verified Photo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Domain-Aware Auto BoM */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                    <p className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                      3. Auto-Generated Bill of Materials (BoM)
                    </p>
                    <p className="font-mono font-bold text-emerald-400">
                      {inspectingTask.surveyType.includes('Solar') ? 'Total: M 78,500.00' : 'Total: M 43,100.00'}
                    </p>
                  </div>

                  {inspectingTask.surveyType.includes('Solar') ? (
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="text-slate-500 uppercase text-[9px]">
                          <th className="pb-1">Equipment Description</th>
                          <th className="pb-1 text-center">Qty</th>
                          <th className="pb-1 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-slate-200">
                        <tr><td className="py-1">5 kVA Hybrid Solar Inverter</td><td className="py-1 text-center">1</td><td className="py-1 text-right font-mono text-emerald-400">M 24,000</td></tr>
                        <tr><td className="py-1">10 kWh Lithium-ion Battery Bank</td><td className="py-1 text-center">1</td><td className="py-1 text-right font-mono text-emerald-400">M 35,000</td></tr>
                        <tr><td className="py-1">550W Monocrystalline PV Panels</td><td className="py-1 text-center">12</td><td className="py-1 text-right font-mono text-emerald-400">M 14,500</td></tr>
                        <tr><td className="py-1">Roof Mounting Kits & DB Protection</td><td className="py-1 text-center">1</td><td className="py-1 text-right font-mono text-emerald-400">M 5,000</td></tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="text-slate-500 uppercase text-[9px]">
                          <th className="pb-1">Equipment Description</th>
                          <th className="pb-1 text-center">Qty</th>
                          <th className="pb-1 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-slate-200">
                        <tr><td className="py-1">4MP Dome & Bullet Cameras</td><td className="py-1 text-center">8</td><td className="py-1 text-right font-mono text-emerald-400">M 15,600</td></tr>
                        <tr><td className="py-1">16-Channel NVR + 4TB HDD</td><td className="py-1 text-center">1</td><td className="py-1 text-right font-mono text-emerald-400">M 11,000</td></tr>
                        <tr><td className="py-1">8-Port PoE+ Switch & Cat6 Cable</td><td className="py-1 text-center">1</td><td className="py-1 text-right font-mono text-emerald-400">M 16,500</td></tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
              <button onClick={() => setInspectingTask(null)} className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 text-xs">
                Close
              </button>
              {inspectingTask.status === 'Pending Review' && (
                <button
                  onClick={() => {
                    updateTaskStatus(inspectingTask.id, 'Ready for Sales');
                    setInspectingTask(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs transition-all"
                >
                  ✔ Approve BoM & Send to Sales
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-white">Dispatch New Survey</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Client Name / Project</label>
                <input type="text" required value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} placeholder="e.g. PostBank" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Survey Domain</label>
                  <select value={formData.surveyType} onChange={(e) => setFormData({ ...formData, surveyType: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                    <option value="CCTV & Security">CCTV & Security</option>
                    <option value="Solar & UPS">Solar & UPS</option>
                    <option value="Wi-Fi Network">Wi-Fi Network</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Assigned Engineer</label>
                  <select value={formData.assignedEngineer} onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                    <option value="Letjamela Mabea">Letjamela Mabea</option>
                    <option value="Thatho Motsoasele">Thatho Motsoasele</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Site Location</label>
                <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Mafeteng" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl">Dispatch Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}