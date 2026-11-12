'use client';

import React from 'react';
import { SurveyTask } from '@/context/TaskContext';

interface MaterialListModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: SurveyTask;
}

export default function MaterialListModal({ isOpen, onClose, task }: MaterialListModalProps) {
  if (!isOpen) return null;

  // Check if engineer has submitted actual survey data or if task is in review/sales status
  const hasEngineerSubmitted = 
    task.status === 'Pending Review' || 
    task.status === 'Ready for Sales' || 
    (task.surveyData && Object.keys(task.surveyData).length > 0);

  const isSolar = task.surveyType.toLowerCase().includes('solar');
  const survey = task.surveyData || {};

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-xs">
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-extrabold uppercase rounded-full">
              Technical Material Checklist & Bill of Materials
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              {survey.siteName || task.clientName}
            </h2>
            <p className="text-slate-400 mt-0.5">
              📍 Location: {task.location} | Domain: {task.surveyType}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            ✕
          </button>
        </div>

        {!hasEngineerSubmitted ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center space-y-2">
            <p className="font-bold text-slate-300 text-sm">Awaiting Field Engineer Submission</p>
            <p className="text-slate-500">
              This task is currently in <span className="text-amber-400 font-bold">{task.status}</span> status. The equipment schedule will dynamically populate once the field engineer completes and submits the site survey.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-500 uppercase text-[9px] border-b border-slate-800/60 bg-slate-900">
                    <th className="p-3.5">Deployment Tier</th>
                    <th className="p-3.5">Selected Equipment Description</th>
                    <th className="p-3.5 text-center">Required Qty</th>
                    <th className="p-3.5 text-right">Technical Spec / Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-200">
                  {isSolar ? (
                    <>
                      <tr className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-amber-400">Inverter</span></td>
                        <td className="p-3.5 font-medium text-white">{survey.inverterModel || 'Huawei SUN2000 Hybrid Inverter'}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">1 Unit</td>
                        <td className="p-3.5 text-right text-slate-400">5kW Hybrid</td>
                      </tr>
                      <tr className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-amber-400">Solar Panels</span></td>
                        <td className="p-3.5 font-medium text-white">{survey.panelType || 'Monocrystalline 550W High-Efficiency'}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">{survey.panelCount || '6'} Units</td>
                        <td className="p-3.5 text-right text-slate-400">PV Array</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {/* Indoor AP Row */}
                      <tr className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold text-[9px]">Indoor Access Point</span></td>
                        <td className="p-3.5 font-medium text-white">{survey.indoorAp?.model || 'Grandstream GWN7664 Wi-Fi 6 AP'}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">{survey.indoorAp?.quantity || '6'} Units</td>
                        <td className="p-3.5 text-right text-slate-400">High-Density Dual-Band</td>
                      </tr>
                      {/* Outdoor AP Row */}
                      <tr className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold text-[9px]">Outdoor Access Point</span></td>
                        <td className="p-3.5 font-medium text-white">{survey.outdoorAp?.model || 'Grandstream GWN7660LR Outdoor Long-Range'}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">{survey.outdoorAp?.quantity || '2'} Units</td>
                        <td className="p-3.5 text-right text-slate-400">Weatherproof IP66</td>
                      </tr>
                      {/* Switch Row */}
                      <tr className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-purple-400">Switching</span></td>
                        <td className="p-3.5 font-medium text-white">{survey.switchModel || 'Grandstream GWN7802P Managed PoE+ Switch'}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">1 Unit</td>
                        <td className="p-3.5 text-right text-slate-400">Gigabit PoE+</td>
                      </tr>
                      {/* Cabling Row */}
                      <tr className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-slate-300">Cabling</span></td>
                        <td className="p-3.5 font-medium text-white">{survey.cablingType || 'Cat6 Shielded Solid Copper UTP'}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">{survey.cablingLength || '120m'}</td>
                        <td className="p-3.5 text-right text-slate-400">Pull Box / Spool</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {survey.notes && (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field Telemetry Notes</span>
                <p className="text-slate-300 italic">{survey.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
}