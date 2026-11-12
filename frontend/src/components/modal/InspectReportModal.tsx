'use client';

import React from 'react';

interface InspectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any | null;
  onApprove?: (taskId: string) => void;
}

export default function InspectReportModal({
  isOpen,
  onClose,
  task,
  onApprove,
}: InspectReportModalProps) {
  if (!isOpen || !task) return null;

  const surveyData = task.surveyData || {};

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0B0F19] border border-slate-800 w-full max-w-3xl rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {task.surveyType || surveyData.surveyType || 'Solar & Power Audit'}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {task.status}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2">
              {task.clientName || surveyData.clientName || task.siteName || 'Site Inspection Report'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              📍 {surveyData.location || task.location || 'Maseru, Lesotho'} • Assigned: <span className="text-white font-bold">{task.assignedEngineerName || task.surveyor || 'Field Engineer'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 w-8 h-8 rounded-xl flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Survey Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase">Contact & Site Info</p>
            <p className="text-xs text-slate-300"><strong>Contact Person:</strong> {surveyData.contactPerson || task.contactPerson || 'N/A'}</p>
            <p className="text-xs text-slate-300"><strong>Phone:</strong> {surveyData.contactPhone || task.contactPhone || 'N/A'}</p>
            <p className="text-xs text-slate-300"><strong>GPS Coordinates:</strong> {surveyData.coordinates || task.location || 'N/A'}</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase">Audit Summary</p>
            <p className="text-xs text-slate-300"><strong>System Capacity:</strong> {surveyData.capacity || 'Standard Setup'}</p>
            <p className="text-xs text-slate-300"><strong>Backhaul Source:</strong> {surveyData.backhaul || 'Starlink / Fiber'}</p>
            <p className="text-xs text-slate-300"><strong>Status:</strong> {task.status}</p>
          </div>
        </div>

        {/* Technical Checklist Payload */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Field Survey Findings & Materials</h3>
          {Object.keys(surveyData).length === 0 ? (
            <p className="text-xs text-slate-500 italic">No checklist data has been submitted for this task yet.</p>
          ) : (
            <pre className="text-xs font-mono bg-slate-900/90 text-emerald-400 p-4 rounded-xl overflow-x-auto border border-slate-800">
              {JSON.stringify(surveyData, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800"
          >
            Close
          </button>

          {onApprove && (
            <button
              onClick={() => {
                onApprove(task.id);
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
            >
              Approve & Send to Sales →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}