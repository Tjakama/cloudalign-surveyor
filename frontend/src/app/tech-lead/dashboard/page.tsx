'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AssignTaskModal from '@/components/surveys/AssignTaskModal';
import MaterialListModal from '@/components/surveys/MaterialListModal';
import SolarMaterialModal from '@/components/surveys/SolarMaterialModal';

export default function TechLeadDashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Operations Dashboard');

  // Fetch tasks from database on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Failed to load tasks from database:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatusInDb = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };
const validTasks = tasks.filter(
  (task) => task.siteName && task.siteName !== 'Unnamed Site' && task.assignedEngineerId
);
  const techLeadProfile = {
    name: 'Tsepo Masita',
    role: 'Tech Lead',
    email: 'techlead@cloudalign.co.za',
  };

  // Metric stats calculated dynamically
  const totalOps = tasks.length;
  const inField = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length;
  const pendingReviews = tasks.filter((t) => t.status === 'PENDING_REVIEW' || t.status === 'Pending Review').length;
  const readyForSales = tasks.filter((t) => t.status === 'Ready for Sales' || t.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans">
      <Navbar
        userName={techLeadProfile.name}
        userRole="Tech Lead"
        userEmail={techLeadProfile.email}
      />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#0B0F19] p-6 space-y-6 hidden md:block">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              Management Menu
            </p>
            {[
              { name: 'Operations Dashboard', icon: '📊' },
              { name: 'All Opportunities', icon: '📁' },
              { name: 'Field Engineer Workload', icon: '👤' },
              { name: 'Proposals & BOM Approvals', icon: '📋' },
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === item.name
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl">
          <div className="bg-[#0B0F19] rounded-3xl p-6 shadow-xl space-y-1">
            <h1 className="text-2xl font-black text-white">Operations & Resource Management</h1>
            <p className="text-xs text-slate-400">
              Assign survey tasks to engineers, review ground reports, and verify technical material checklists.
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0B0F19] rounded-2xl p-5 shadow-lg space-y-1">
              <p className="text-xs font-bold text-slate-400">Tech Opportunities</p>
              <p className="text-3xl font-black text-white">{totalOps}</p>
              <p className="text-[10px] text-slate-500 font-medium">Active Site Pipeline</p>
            </div>
            <div className="bg-[#0B0F19] rounded-2xl p-5 shadow-lg space-y-1">
              <p className="text-xs font-bold text-slate-400">Surveys In Field</p>
              <p className="text-3xl font-black text-amber-400">{inField}</p>
              <p className="text-[10px] text-slate-500 font-medium">Active Site Inspections</p>
            </div>
            <div className="bg-[#0B0F19] rounded-2xl p-5 shadow-lg space-y-1">
              <p className="text-xs font-bold text-slate-400">Pending Reviews</p>
              <p className="text-3xl font-black text-purple-400">{pendingReviews}</p>
              <p className="text-[10px] text-slate-500 font-medium">Technical Sign-offs</p>
            </div>
            <div className="bg-[#0B0F19] rounded-2xl p-5 shadow-lg space-y-1">
              <p className="text-xs font-bold text-slate-400">Ready for Sales</p>
              <p className="text-3xl font-black text-emerald-400">{readyForSales}</p>
              <p className="text-[10px] text-slate-500 font-medium">Proposals Cleared</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-end border-b border-slate-800/60 pb-4">
            <div>
              <h2 className="text-xl font-black text-white">Assigned Tasks & Status</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review submitted engineer reports and verify required material checklists.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2"
            >
              <span>+</span>
              <span>Assign New Survey Task</span>
            </button>
          </div>

          {/* Task Grid */}
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading tasks from Supabase...</div>
          ) : tasks.length === 0 ? (
            <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-16 text-center space-y-2">
              <p className="text-sm font-bold text-slate-300">No active tech tasks found.</p>
              <p className="text-xs text-slate-500">
                Use the button above to dispatch your first survey task to a field engineer.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => {
                const survey = task.surveyData || {};
                return (
                  <div
                    key={task.id}
                    className="bg-[#0B0F19] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-900 text-slate-300 border border-slate-800">
                          {survey.surveyType || 'Solar & Power Audit'}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                            task.status === 'PENDING_REVIEW' || task.status === 'Pending Review'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : task.status === 'Ready for Sales' || task.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase">
                          {task.id} • {survey.location || 'Maseru, Lesotho'}
                        </span>
                        <h3 className="text-xl font-black text-white mt-0.5">
                          {task.siteName || survey.siteName || task.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          👤 Assigned Engineer: <strong className="text-slate-200">{task.surveyor || survey.assignedEngineer || 'Unassigned'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Map database task format to modal structure
                          setSelectedTask({
                            id: task.id,
                            clientName: task.clientName || survey.clientName || '',
                            surveyType: survey.surveyType || 'Solar & Power Audit',
                            location: survey.location || task.siteName || '',
                            assignedEngineer: task.surveyor || survey.assignedEngineer || '',
                            assignedDepartment: 'Technology Operations',
                            status: task.status,
                            surveyData: survey,
                            contactPerson: survey.contactPerson || 'Site Rep',
                            contactPhone: survey.contactPhone || '+266 2200 0000',
                          });
                          setIsModalOpen(true);
                        }}
                        className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <span>🔍</span>
                        <span>Inspect Report / Checklist</span>
                      </button>

                      {(task.status === 'PENDING_REVIEW' || task.status === 'Pending Review') && (
                        <button
                          type="button"
                          onClick={() => updateTaskStatusInDb(task.id, 'Ready for Sales')}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                        >
                          Verify & Push to Sales →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Inspection Modals */}
      {isModalOpen && selectedTask && (
        selectedTask.surveyType?.toLowerCase().includes('solar') ? (
          <SolarMaterialModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            task={selectedTask}
          />
        ) : (
          <MaterialListModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            task={selectedTask}
          />
        )
      )}

      {/* Task Assignment Modal */}
      {isAssignModalOpen && (
        <AssignTaskModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onTaskDispatched={() => {
            fetchTasks(); // Reloads task list post-dispatch
          }}
        />
      )}
    </div>
  );
}