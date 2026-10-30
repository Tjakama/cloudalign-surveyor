'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';

const ALL_ROLES: UserRole[] = [
  'Administrator',
  'Project Manager',
  'Surveyor',
  'Engineer',
  'Reviewer',
  'Approver',
  'Collaborator',
];

export default function UserManagementPage() {
  const { users, addUser, updateUserRole, auditLogs, currentUser, setCurrentUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Engineer');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ name, email, role, status: 'Active' });
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white">User Authentication & RBAC Control</h1>
          <p className="text-xs text-slate-400 mt-1">Manage user entities, assign initial roles, and review security audit logs.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right text-xs">
            <p className="text-slate-400">Active Session:</p>
            <p className="font-bold text-emerald-400">{currentUser.name} ({currentUser.role})</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30"
          >
            + Register New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-extrabold text-white">System Users & Role Assignments</h2>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800 pb-2">
              <th className="pb-3">User Name</th>
              <th className="pb-3">Email Address</th>
              <th className="pb-3">Assigned Role</th>
              <th className="pb-3">Quick Switch Persona</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40">
                <td className="py-3.5 font-bold text-white">{u.name}</td>
                <td className="py-3.5 text-slate-400">{u.email}</td>
                <td className="py-3.5">
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200 font-medium"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3.5">
                  <button
                    onClick={() => setCurrentUser(u)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-[11px] font-bold border border-slate-700"
                  >
                    Simulate Login
                  </button>
                </td>
                <td className="py-3.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-extrabold text-white">Security & Action Audit Logs</h2>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px] max-h-60 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center border-b border-slate-900 pb-1.5">
              <div>
                <span className="text-slate-500">[{log.timestamp}]</span>{' '}
                <strong className="text-blue-400">{log.user}</strong>: <span className="text-slate-300">{log.action}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 uppercase">{log.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Register User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-lg font-extrabold text-white">Register New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Thatho Motsoasele"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thatho@cloudalign.co.za"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Initial Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}