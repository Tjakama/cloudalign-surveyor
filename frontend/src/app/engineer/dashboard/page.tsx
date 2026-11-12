'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import WifiSurveyForm from '@/components/surveys/WifiSurveyForm';
import SolarSurveyForm from '@/components/surveys/SolarSurveyForm';

export default function EngineerDashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [activeNav, setActiveNav] = useState<'active' | 'completed'>('active');

  // Logged-in user profile state
  const [engineerProfile, setEngineerProfile] = useState({
    name: '',
    role: 'Engineer',
    email: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      // If no active session exists, redirect immediately to login
      window.location.href = '/login';
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setEngineerProfile({
        name: parsed.name || 'Engineer User',
        role: parsed.role || 'Engineer',
        email: parsed.email || '',
      });
    } catch (e) {
      console.error('Failed to parse user session', e);
      window.location.href = '/login';
    }

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
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const assignedTasks = tasks.filter((t) => t.status === 'Assigned' || t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'PENDING_REVIEW' || t.status === 'Pending Review' || t.status === 'Ready for Sales' || t.status === 'APPROVED');

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <div className="[&_header]:bg-[#0B0F19] [&_header]:border-slate-800/80 [&_p.text-slate-900]:text-white [&_p.text-slate-500]:text-slate-400 [&_button]:bg-slate-900 [&_button]:border-slate-800 [&_button]:text-slate-200 [&_button]:hover:bg-slate-800">
        <Navbar
          userName={engineerProfile.name}
          userRole={engineerProfile.role}
          userEmail={engineerProfile.email}
        />
      </div>

      <div className="flex flex-1">
        
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#0B0F19] border-r border-slate-800/80 p-6 space-y-6 hidden lg:block shrink-0">
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">Field Navigation</p>
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveNav('active'); setActiveTask(null); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeNav === 'active' && !activeTask
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span>⚡</span>
                  <span>Active Tasks</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                  {assignedTasks.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveNav('completed'); setActiveTask(null); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeNav === 'completed'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span>📁</span>
                  <span>Completed History</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-400">
                  {completedTasks.length}
                </span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-6 bg-slate-950/40 overflow-y-auto">
          
          {loading ? (
            <div className="text-center py-20 text-xs text-slate-400">Syncing tasks from Supabase database...</div>
          ) : !activeTask ? (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="bg-[#0B0F19] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex justify-between items-center">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    Field Execution Workspace
                  </span>
                  <h1 className="text-2xl font-black text-white mt-2">Assigned Site Surveys</h1>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-xs font-bold text-slate-300">
                  📅 Live Session
                </div>
              </div>

              {/* Task Cards Grid */}
              {activeNav === 'active' ? (
                assignedTasks.length === 0 ? (
                  <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-16 text-center space-y-2">
                    <p className="text-sm font-bold text-slate-300">No active tasks assigned.</p>
                    <p className="text-xs text-slate-500">Tasks dispatched from Tech Lead will appear here instantly.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignedTasks.map((task) => {
                      const survey = task.surveyData || {};
                      return (
                        <div key={task.id} className="bg-[#0B0F19] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-900 text-slate-300 border border-slate-800">
                                {survey.surveyType || 'Solar & Power Audit'}
                              </span>
                              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {task.status}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-extrabold text-slate-500 uppercase">{task.id} • Active</span>
                              <h2 className="text-xl font-black text-white mt-0.5">{task.clientName || survey.clientName || task.title}</h2>
                              <p className="text-xs text-slate-400 mt-1">📍 {survey.location || task.siteName || 'Maseru, Lesotho'}</p>
                            </div>

                            <div className="bg-slate-900/80 border border-slate-800/60 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                              <span className="text-slate-400">👤 {task.surveyor || survey.assignedEngineer || engineerProfile.name}</span>
                              <span className="text-blue-400 font-bold">{survey.contactPhone || '+266 5800 1515'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              updateTaskStatusInDb(task.id, 'In Progress');
                              setActiveTask({
                                id: task.id,
                                clientName: task.clientName || survey.clientName || '',
                                surveyType: survey.surveyType || 'Solar & Power Audit',
                                location: survey.location || '',
                              });
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
                          >
                            <span>📋</span>
                            <span>Launch Survey Checklist</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Completed History View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedTasks.length === 0 ? (
                    <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500 col-span-2">
                      No completed surveys in history yet.
                    </div>
                  ) : (
                    completedTasks.map((task) => {
                      const survey = task.surveyData || {};
                      return (
                        <div key={task.id} className="bg-[#0B0F19] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4 opacity-90">
                          <div className="flex justify-between items-center">
                            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              {task.status}
                            </span>
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-white">{task.clientName || survey.clientName || task.title}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">📍 {survey.location || task.siteName || 'Maseru, Lesotho'}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Active Form Workspace View */
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center bg-[#0B0F19] border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Active Task Workspace</p>
                  <h3 className="text-base font-bold text-white">{activeTask.clientName} — <span className="text-blue-400">{activeTask.surveyType}</span></h3>
                </div>
                <button
                  onClick={() => setActiveTask(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700"
                >
                  ← Back to Task List
                </button>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800 p-8 rounded-3xl shadow-xl">
                {activeTask.surveyType?.toLowerCase().includes('solar') ? (
                  <SolarSurveyForm
                    taskId={activeTask.id}
                    onSubmitted={() => {
                      updateTaskStatusInDb(activeTask.id, 'PENDING_REVIEW');
                      setActiveTask(null);
                      fetchTasks();
                    }}
                  />
               ) : (
                  <WifiSurveyForm
                    task={activeTask}
                    onSubmitted={() => {
                      updateTaskStatusInDb(activeTask.id, 'PENDING_REVIEW');
                      setActiveTask(null);
                      fetchTasks();
                    }}
                  />
                )}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}