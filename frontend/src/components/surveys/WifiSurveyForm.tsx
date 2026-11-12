'use client';

import React, { useState } from 'react';

interface WifiSurveyFormProps {
  task?: any;
  taskId?: string;
  onSubmitted?: () => void;
  onSubmitSurvey?: (surveyData: any) => void;
  onBack?: () => void;
}

export default function WifiSurveyForm({ task, taskId, onSubmitted, onSubmitSurvey, onBack }: WifiSurveyFormProps) {
  const [step, setStep] = useState(1);

  // Step 1 State: Physical Layout & Coverage
  const [siteName, setSiteName] = useState(task?.clientName || task?.siteName || '');
  const [coverageArea, setCoverageArea] = useState('');
  const [wallStructure, setWallStructure] = useState('Multi-story Brick & Concrete');
  const [userLoad, setUserLoad] = useState('Standard Office Workstations');

  // Step 2 State: Hardware & Multi-Model AP Selection (Indoor vs Outdoor tabs)
  const [apCategoryTab, setApCategoryTab] = useState<'indoor' | 'outdoor'>('indoor');
  
  // Indoor AP configuration
  const [indoorModel, setIndoorModel] = useState('Grandstream GWN7664 Wi-Fi 6 Access Point');
  const [indoorQty, setIndoorQty] = useState('6');

  // Outdoor AP configuration
  const [outdoorModel, setOutdoorModel] = useState('Grandstream GWN7660LR Outdoor Long-Range AP');
  const [outdoorQty, setOutdoorQty] = useState('2');

  // Switch & Cabling
  const [switchModel, setSwitchModel] = useState('Grandstream GWN7802P 24-Port Managed PoE+ Switch');
  const [cablingType, setCablingType] = useState('Cat6 Shielded Solid Copper UTP');
  const [cablingLength, setCablingLength] = useState('120m');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const surveyPayload = {
      surveyType: 'Wi-Fi Infrastructure Survey',
      siteName,
      coverageArea,
      wallStructure,
      userLoad,
      indoorAp: { model: indoorModel, quantity: indoorQty },
      outdoorAp: { model: outdoorModel, quantity: outdoorQty },
      switchModel,
      cablingType,
      cablingLength,
      notes,
    };

    if (onSubmitSurvey) {
      onSubmitSurvey(surveyPayload);
    } else {
      // Direct API persistence if invoked from dashboard
      const activeTaskId = taskId || task?.id;
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Wi-Fi Survey: ${siteName || 'Unnamed Site'}`,
            status: 'PENDING_REVIEW',
            surveyData: surveyPayload,
          }),
        });

        if (res.ok && onSubmitted) {
          onSubmitted();
        }
      } catch (err) {
        console.error('Failed to save Wi-Fi survey:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl w-full shadow-2xl space-y-6 text-xs text-white">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="px-3 py-1 bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold uppercase rounded-full">
            Wi-Fi & Infrastructure Site Audit
          </span>
          <h2 className="text-xl font-black mt-1">Step {step} of 2 — {step === 1 ? 'Physical Layout & Coverage' : 'Hardware & Multi-Model AP Allocation'}</h2>
        </div>
        <div className="flex space-x-1.5">
          <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-blue-500' : 'bg-slate-800'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-blue-500' : 'bg-slate-800'}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Site Facility Name</label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Mohale Lodge"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Building Wall & Floor Structure</label>
                <select
                  value={wallStructure}
                  onChange={(e) => setWallStructure(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Drywall / Open Office">Drywall / Open Office</option>
                  <option value="Multi-story Brick & Concrete">Multi-story Brick & Concrete</option>
                  <option value="Heavy Industrial Steel Cladding">Heavy Industrial Steel Cladding</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Estimated Target Coverage Area (sqm)</label>
                <input
                  type="text"
                  required
                  value={coverageArea}
                  onChange={(e) => setCoverageArea(e.target.value)}
                  placeholder="e.g. 450 sqm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Concurrent User Load Profile</label>
                <select
                  value={userLoad}
                  onChange={(e) => setUserLoad(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard Office Workstations">Standard Office Workstations</option>
                  <option value="High-Density Auditorium / Conference">High-Density Auditorium / Conference</option>
                  <option value="Warehouse IoT & Mobile Scanners">Warehouse IoT & Mobile Scanners</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Next: Hardware & AP Setup →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Environment Tab Switcher */}
            <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex space-x-2">
              <button
                type="button"
                onClick={() => setApCategoryTab('indoor')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  apCategoryTab === 'indoor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏢 Indoor Access Points ({indoorQty} Units)
              </button>
              <button
                type="button"
                onClick={() => setApCategoryTab('outdoor')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  apCategoryTab === 'outdoor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌳 Outdoor Access Points ({outdoorQty} Units)
              </button>
            </div>

            {/* Tab Content */}
            {apCategoryTab === 'indoor' ? (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <h3 className="text-blue-400 font-bold uppercase text-[10px] tracking-wider">Indoor Deployment Configuration</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="block text-slate-300 font-bold">Indoor AP Model</label>
                    <select
                      value={indoorModel}
                      onChange={(e) => setIndoorModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    >
                      <option value="Grandstream GWN7664 Wi-Fi 6 Access Point">Grandstream GWN7664 Wi-Fi 6 Access Point</option>
                      <option value="Grandstream GWN7660 Wi-Fi 6 Access Point">Grandstream GWN7660 Wi-Fi 6 Access Point</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-bold">Quantity Required</label>
                    <input
                      type="number"
                      min="0"
                      value={indoorQty}
                      onChange={(e) => setIndoorQty(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-center font-bold text-emerald-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <h3 className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">Outdoor Deployment Configuration</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="block text-slate-300 font-bold">Outdoor AP Model</label>
                    <select
                      value={outdoorModel}
                      onChange={(e) => setOutdoorModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    >
                      <option value="Grandstream GWN7660LR Outdoor Long-Range AP">Grandstream GWN7660LR Outdoor Long-Range AP</option>
                      <option value="Grandstream GWN7630LR Outdoor AP">Grandstream GWN7630LR Outdoor AP</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-bold">Quantity Required</label>
                    <input
                      type="number"
                      min="0"
                      value={outdoorQty}
                      onChange={(e) => setOutdoorQty(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-center font-bold text-emerald-400"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">PoE Switch Specification</label>
                <select
                  value={switchModel}
                  onChange={(e) => setSwitchModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  <option value="Grandstream GWN7802P 24-Port Managed PoE+ Switch">Grandstream GWN7802P 24-Port Managed PoE+ Switch</option>
                  <option value="Grandstream GWN7801P 8-Port Managed PoE+ Switch">Grandstream GWN7801P 8-Port Managed PoE+ Switch</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Cabling Run & Specification</label>
                <input
                  type="text"
                  value={cablingLength}
                  onChange={(e) => setCablingLength(e.target.value)}
                  placeholder="e.g. 150m Cat6 F/UTP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">Field Telemetry & Installation Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Note conduit pathways, riser locations, or mounting limitations..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey to Tech Lead'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}