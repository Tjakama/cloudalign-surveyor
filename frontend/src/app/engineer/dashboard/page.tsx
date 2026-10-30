'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTasks, SurveyTask } from '@/context/TaskContext';

interface PhotoAttachment {
  id: string;
  title: string;
  url: string;
}

export default function EngineerDashboard() {
  const router = useRouter();
  const { tasks, updateTaskStatus } = useTasks();

  const [activeTask, setActiveTask] = useState<SurveyTask | null>(null);

  // Photo Attachments State
  const [photos, setPhotos] = useState<PhotoAttachment[]>([]);
  const [photoTitle, setPhotoTitle] = useState('');

  // Ground Reality Inputs
  const [groundData, setGroundData] = useState({
    domeCameras: 4,
    bulletCameras: 4,
    ptzCameras: 0,
    nvrChannels: '16',
    storageTB: '4',
    cableMeters: 150,
  });

  const [engineerNotes, setEngineerNotes] = useState('');

  const handleSignOut = () => {
    localStorage.removeItem('cloudalign_current_user');
    router.push('/');
  };

  const handleOpenChecklist = (task: SurveyTask) => {
    setActiveTask(task);
  };

  const handleAddPhoto = () => {
    if (!photoTitle) return;
    const newPhoto: PhotoAttachment = {
      id: Date.now().toString(),
      title: photoTitle,
      url: '/images/log.png',
    };
    setPhotos([...photos, newPhoto]);
    setPhotoTitle('');
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  // AUTO-GENERATED BoM LOGIC BASED ON GROUND INPUTS
  const totalCameras = Number(groundData.domeCameras) + Number(groundData.bulletCameras) + Number(groundData.ptzCameras);
  
  const autoBomItems = [
    ...(groundData.domeCameras > 0 ? [{ desc: '4MP Dome IP Camera (Outdoor IR)', qty: groundData.domeCameras, unit: 1800 }] : []),
    ...(groundData.bulletCameras > 0 ? [{ desc: '4MP Bullet IP Camera (Full Color)', qty: groundData.bulletCameras, unit: 2100 }] : []),
    ...(groundData.ptzCameras > 0 ? [{ desc: 'PTZ Optical Zoom Security Camera', qty: groundData.ptzCameras, unit: 5500 }] : []),
    { desc: `${groundData.nvrChannels}-Channel Network Video Recorder (NVR)`, qty: 1, unit: groundData.nvrChannels === '32' ? 14000 : 8500 },
    { desc: `${groundData.storageTB} TB Surveillance Grade HDD`, qty: Number(groundData.storageTB) > 4 ? 2 : 1, unit: 2500 },
    { desc: totalCameras > 8 ? '24-Port Managed PoE+ Switch' : '8-Port Gigabit PoE+ Switch', qty: 1, unit: totalCameras > 8 ? 5800 : 3200 },
    { desc: 'Cat6 Shielded Outdoor Cable (100m Roll)', qty: Math.ceil(groundData.cableMeters / 100), unit: 1400 },
    { desc: 'Mounting Brackets, Conduits & Junction Boxes', qty: totalCameras, unit: 250 },
  ];

  const totalAutoBomCost = autoBomItems.reduce((acc, item) => acc + item.qty * item.unit, 0);

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    // Updates status and can attach the auto-generated BoM payload
    updateTaskStatus(activeTask.id, 'Pending Review');
    setActiveTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-slate-900  px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image src="/images/log.png" alt="Cloudalign" fill className="object-contain" priority />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-white leading-none">Letjamela Mabea</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Field Engineer • <span className="text-slate-500">letjamela.mabea@cloudalign.co.za</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-600/30">
            LM
          </div>
          <button
            onClick={handleSignOut}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-6 flex-shrink-0">
          <div>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-4">
              Field Navigation
            </p>
            <nav className="space-y-1.5">
              <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <span>⚡ Active Assignments</span>
                <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-[10px]">{tasks.length}</span>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8 space-y-8 max-w-7xl">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Assigned Technical Surveys</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter site measurements and ground photos to auto-generate the complete survey report and BoM.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl font-mono">
              📅 Today
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.length === 0 ? (
              <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xl">
                <p className="text-sm font-bold text-slate-300">No active surveys assigned yet.</p>
                <p className="text-xs text-slate-500">
                  Assign a new task from the Tech Lead dashboard to launch the report generator here.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {task.surveyType}
                    </span>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {task.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{task.clientName}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center">
                      <span className="mr-1">📍</span> {task.location}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Engineer: <strong className="text-slate-200">{task.assignedEngineer}</strong></span>
                    <button
                      onClick={() => handleOpenChecklist(task)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                    >
                      Open Survey Report Generator →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Auto-Generated Survey Report Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Auto-Generated Survey Report
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{activeTask.clientName}</h3>
                <p className="text-xs text-slate-400">📍 {activeTask.location} • Enter ground data below to auto-compile BoM</p>
              </div>
              <button
                onClick={() => setActiveTask(null)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitSurvey} className="space-y-6 text-xs">
              
              {/* SECTION 1: Ground Realities / Measurements Input */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-2">
                  1. Ground Reality Inputs (Drives Auto-BoM Generation)
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Dome Cameras</label>
                    <input
                      type="number"
                      value={groundData.domeCameras}
                      onChange={(e) => setGroundData({ ...groundData, domeCameras: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Bullet Cameras</label>
                    <input
                      type="number"
                      value={groundData.bulletCameras}
                      onChange={(e) => setGroundData({ ...groundData, bulletCameras: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">PTZ Cameras</label>
                    <input
                      type="number"
                      value={groundData.ptzCameras}
                      onChange={(e) => setGroundData({ ...groundData, ptzCameras: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-center font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">NVR Channels</label>
                    <select
                      value={groundData.nvrChannels}
                      onChange={(e) => setGroundData({ ...groundData, nvrChannels: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="8">8 Channel</option>
                      <option value="16">16 Channel</option>
                      <option value="32">32 Channel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Storage (TB)</label>
                    <select
                      value={groundData.storageTB}
                      onChange={(e) => setGroundData({ ...groundData, storageTB: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="2">2 TB</option>
                      <option value="4">4 TB</option>
                      <option value="8">8 TB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Cable Run (Meters)</label>
                    <input
                      type="number"
                      value={groundData.cableMeters}
                      onChange={(e) => setGroundData({ ...groundData, cableMeters: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Photo Evidence Uploads */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-2">
                  2. Ground Photos & Evidence
                </p>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="Photo Title (e.g. Main Entrance Camera Mount, Server Rack DB)"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                  >
                    + Attach Photo
                  </button>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {photos.map((photo) => (
                      <div key={photo.id} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                        <div className="truncate mr-2">
                          <p className="font-bold text-white text-[11px] truncate">{photo.title}</p>
                          <span className="text-[9px] text-emerald-400">📷 Uploaded</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="text-red-400 hover:text-red-300 font-bold text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: Auto-Generated Bill of Materials (BoM) */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <p className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px]">
                    3. Auto-Generated Bill of Materials (BoM) ✨
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-400">
                   Total Estimated Cost: M {totalAutoBomCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                        <th className="pb-2">Equipment Description</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Unit Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {autoBomItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-bold text-slate-200">{item.desc}</td>
                          <td className="py-2 text-center text-slate-300">{item.qty}</td>
                          <td className="py-2 text-right text-slate-300 font-mono">M {item.unit.toLocaleString()}</td>
                          <td className="py-2 text-right font-mono font-bold text-emerald-400">
                            M {(item.qty * item.unit).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 4: Field Observations */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Engineer Ground Notes</label>
                <textarea
                  rows={2}
                  value={engineerNotes}
                  onChange={(e) => setEngineerNotes(e.target.value)}
                  placeholder="Note specific site challenges or conduit routing paths..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Submit Auto-Generated Report →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}