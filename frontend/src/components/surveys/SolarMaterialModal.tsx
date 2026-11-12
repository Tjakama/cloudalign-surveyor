'use client';

import React from 'react';

export default function SolarMaterialModal({ isOpen, onClose, task }: any) {
  if (!isOpen || !task) return null;

  const surveyData = task.surveyData || {};
  const bomList = surveyData.materialsBOM || [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#0B0F19] border border-slate-800 w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold rounded-full uppercase">
              Solar & Power Field Survey & BOM Audit
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              {surveyData.clientName || task.clientName || 'Client Site'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              📍 Location / GPS: <strong className="text-slate-200">{surveyData.location || task.location || 'N/A'}</strong>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg p-2">✕</button>
        </div>

        {/* SECTION 1: Site Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl">
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase">On-site Contact Person</p>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{surveyData.contactPerson || task.contactPerson || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase">Contact Phone Number</p>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{surveyData.contactPhone || task.contactPhone || 'N/A'}</p>
          </div>
        </div>

        {/* SECTION 2: System & Structural Parameters */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
            System & Structural Telemetry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <p className="text-[10px] font-extrabold text-slate-500 uppercase">Peak System Load</p>
              <p className="text-sm font-black text-amber-400 mt-0.5">{surveyData.peakLoad || 'N/A'}</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <p className="text-[10px] font-extrabold text-slate-500 uppercase">Mounting Structure Area</p>
              <p className="text-sm font-black text-white mt-0.5">{surveyData.structureArea || 'N/A'}</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <p className="text-[10px] font-extrabold text-slate-500 uppercase">Roofing & Tilt Spec</p>
              <p className="text-sm font-black text-white mt-0.5">{surveyData.roofingSpec || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Dynamic Inventory BOM Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            Hardware & Inventory Bill of Materials (BOM)
          </h3>
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500 font-extrabold bg-slate-900/60">
                  <th className="p-3">Deployment Category</th>
                  <th className="p-3">Component / Specification Description</th>
                  <th className="p-3 text-center">Required Qty</th>
                  <th className="p-3 text-right">Technical Parameters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {bomList.length > 0 ? (
                  bomList.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-900/30">
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200 font-medium">{row.item}</td>
                      <td className="p-3 text-center font-bold text-emerald-400">{row.qty}</td>
                      <td className="p-3 text-right text-slate-400">{row.specs}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No survey BOM materials logged yet for this task.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Close Solar Audit Review
          </button>
        </div>

      </div>
    </div>
  );
}