'use client';

import React, { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ENGINEER');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setName('');
        setEmail('');
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user.');
      }
    } catch (err: any) {
      alert('Network error: ' + err.message);
    }
    setLoading(false);
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole }),
    });
    fetchUsers();
  };

  const handleDeleteUser = async (u: any) => {
    if (!confirm(`Are you sure you want to delete ${u.name}?`)) return;

    const res = await fetch(`/api/admin/users?id=${u.id}&email=${encodeURIComponent(u.email)}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (res.ok && data.success) {
      fetchUsers();
    } else {
      alert(data.error || 'Failed to delete user.');
    }
  };
  const handleSignOut = () => {
    // Clear all browser session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Force clean navigation to root
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-white p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <span className="px-3 py-1 bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-extrabold uppercase rounded-full">
            CloudAlign Control Panel
          </span>
          <h1 className="text-2xl font-black mt-2">Team & Role Provisioning</h1>
          <p className="text-slate-400 text-xs">Manage system users, field engineers, and tech leads stored directly in Supabase.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Sign Out
        </button>
      </div>

      {/* Add User Form */}
      <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 grid grid-cols-4 gap-4 items-end shadow-xl">
        <div className="space-y-1">
          <label className="block text-slate-300 font-bold text-xs">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Letjamela Mabea"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-300 font-bold text-xs">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@cloudalign.co.za"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-300 font-bold text-xs">System Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
          >
            <option value="ENGINEER">ENGINEER</option>
            <option value="TECH_LEAD">TECH_LEAD</option>
            <option value="SALES">SALES</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-lg"
        >
          {loading ? 'Adding...' : '+ Add User'}
        </button>
      </form>

      {/* User Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Current Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                  No users found in database. Add your first team member above!
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.role === 'TECH_LEAD' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                      u.role === 'ENGINEER' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                      u.role === 'ADMIN' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                    >
                      <option value="ENGINEER">ENGINEER</option>
                      <option value="TECH_LEAD">TECH_LEAD</option>
                      <option value="SALES">SALES</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}