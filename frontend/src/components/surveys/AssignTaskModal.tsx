'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AssignTaskModal({ isOpen, onClose, onTaskDispatched }: any) {
  const [engineers, setEngineers] = useState<User[]>([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState('');
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [surveyType, setSurveyType] = useState('Solar & Power Audit');
  const [loading, setLoading] = useState(false);

  // Fetch users dynamically from the database on component mount
  useEffect(() => {
    async function fetchEngineers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) {
          // Filter to ENGINEERS if required, or keep all team members
          const fieldEngineers = data.users.filter(
            (u: User) => u.role === 'ENGINEER' || u.role === 'TECH_LEAD'
          );
          setEngineers(fieldEngineers.length > 0 ? fieldEngineers : data.users);
          if (data.users.length > 0) {
            setSelectedEngineerId(data.users[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load engineers from database:', err);
      }
    }

    if (isOpen) {
      fetchEngineers();
    }
  }, [isOpen]);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedEngineer = engineers.find((e) => e.id === selectedEngineerId);

    const payload = {
      clientName,
      siteName,
      location,
      contactPerson,
      contactPhone,
      surveyType,
      assignedEngineerId: selectedEngineer?.id,
      assignedEngineerName: selectedEngineer?.name,
      assignedEngineerEmail: selectedEngineer?.email,
      status: 'Assigned',
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
     if (res.ok && data.success) {
        if (typeof onTaskDispatched === 'function') {
          onTaskDispatched();
        }
        if (typeof onClose === 'function') {
          onClose();
        }
      } else {
        alert(data.error || 'Failed to dispatch task');
      }
    } catch (err: any) {
      alert('Error dispatching task: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0B0F19] border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-white">Assign New Survey Task</h2>
            <p className="text-xs text-slate-400 mt-1">
              Dispatch a field engineer team to conduct site technical inspections.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleDispatch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Client / Organization Name</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Wolfwave Technologies"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Site Facility Name</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="e.g. Mohale Lodge"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Geographical Location / Coordinates</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. -29.3151, 27.4854 or Ha Foso, Maseru"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Mr. Mabea"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +266 5800 0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Survey Type</label>
            <select
              value={surveyType}
              onChange={(e) => setSurveyType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
            >
              <option value="Solar & Power Audit">Solar & Power Audit</option>
              <option value="Wi-Fi & Network Survey">Wi-Fi & Network Survey</option>
            </select>
          </div>

          {/* Dynamic Assigned Field Engineer Select Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Field Engineer</label>
            <select
              value={selectedEngineerId}
              onChange={(e) => setSelectedEngineerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
            >
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name} ({eng.email})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30"
            >
              {loading ? 'Dispatching...' : 'Dispatch Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}