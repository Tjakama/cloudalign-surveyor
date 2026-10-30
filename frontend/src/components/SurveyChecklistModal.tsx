"use client";

import React, { useState, useEffect } from "react";

export type SystemDomain =
  | "Solar"
  | "UPS"
  | "Wi-Fi"
  | "Generator"
  | "CCTV"
  | "Access Control"
  | "Network Infrastructure"
  | "Server Room"
  | "Data Centre";

interface SurveyPhoto {
  id: string;
  category: string;
  url: string;
}

interface SurveyChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data?: any) => void;
  taskId: string;
  clientName: string;
  surveyType: string;
}

export default function SurveyChecklistModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  taskId,
  clientName,
  surveyType,
}: SurveyChecklistModalProps) {
  const [selectedDomain, setSelectedDomain] = useState<SystemDomain>("Solar");
  const [photos, setPhotos] = useState<SurveyPhoto[]>([]);

  // Domain-specific technical fields
  const [domainData, setDomainData] = useState<Record<string, Record<string, string>>>({
    Solar: { roofType: "IBR Corrugated Steel", tiltOrientation: "15° True North", inverterCapacity: "10kW", batteryType: "15kWh LiFePO4" },
    UPS: { model: "Online Double Conversion", capacityKva: "10kVA", batteryRuntime: "30 Mins", inputPhase: "3-Phase (400V)" },
    "Wi-Fi": { coverageArea: "Warehouse & Offices", currentAccessPoints: "4 APs", cablingType: "Cat6 Shielded", deadZones: "Loading Bay Gate" },
    Generator: { fuelType: "Diesel", kvaRating: "50kVA", autoTransferSwitch: "Yes (ATS Installed)", fuelTankCapacity: "200L" },
    CCTV: { cameraCount: "12 Cameras", resolution: "4K IP PoE", storageNvr: "30 Days Retention (2TB)", blindSpots: "Perimeter Back Gate" },
    "Access Control": { doorCount: "4 Doors", readerType: "Biometric & RFID", softwarePlatform: "Cloud Managed", backupPower: "12V Fail-Secure" },
    "Network Infrastructure": { switchCount: "2 Managed PoE Switches", rackCondition: "Wall Cabinet 12U", fiberUplink: "Available", patchPanel: "24-Port Cat6" },
    "Server Room": { coolingType: "Precision Split AC", rackCount: "2 Full Racks", fireSuppression: "FM200 Gas System", raisedFloor: "Yes" },
    "Data Centre": { redundancyTier: "Tier II", puaTarget: "< 1.5", generatorRedundancy: "N+1", physicalSecurity: "2FA Biometric + CCTV" },
  });

  const [notes, setNotes] = useState("");

  // Auto-detect matching domain when modal opens based on task's surveyType
  useEffect(() => {
    if (surveyType) {
      const lower = surveyType.toLowerCase();
      if (lower.includes("solar")) setSelectedDomain("Solar");
      else if (lower.includes("ups")) setSelectedDomain("UPS");
      else if (lower.includes("cctv") || lower.includes("security")) setSelectedDomain("CCTV");
      else if (lower.includes("generator")) setSelectedDomain("Generator");
      else if (lower.includes("access")) setSelectedDomain("Access Control");
      else if (lower.includes("wi-fi") || lower.includes("wifi")) setSelectedDomain("Wi-Fi");
      else if (lower.includes("network")) setSelectedDomain("Network Infrastructure");
      else if (lower.includes("server")) setSelectedDomain("Server Room");
      else if (lower.includes("data centre") || lower.includes("datacenter")) setSelectedDomain("Data Centre");
    }
  }, [surveyType, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field: string, value: string) => {
    setDomainData((prev) => ({
      ...prev,
      [selectedDomain]: {
        ...prev[selectedDomain],
        [field]: value,
      },
    }));
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPhotos((prev) => [
        ...prev,
        { id: Date.now().toString(), category: selectedDomain, url: imageUrl },
      ]);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    onSubmitSuccess({
      taskId,
      clientName,
      domain: selectedDomain,
      formData: domainData[selectedDomain],
      photosCount: photos.length,
      notes,
    });
  };

  const currentFields = domainData[selectedDomain] || {};
  const domainPhotos = photos.filter((p) => p.category === selectedDomain);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full uppercase">
              Task: {taskId || "NEW"} • {selectedDomain} Checklist
            </span>
            <h2 className="text-lg font-extrabold mt-1 text-white">{clientName || "Site Survey"}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        {/* Domain Switching Selector Pills */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto whitespace-nowrap flex gap-2">
          {(
            [
              "Solar",
              "UPS",
              "Wi-Fi",
              "Generator",
              "CCTV",
              "Access Control",
              "Network Infrastructure",
              "Server Room",
              "Data Centre",
            ] as SystemDomain[]
          ).map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDomain === domain
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              {selectedDomain} Technical Requirements
            </h3>
            <span className="text-[10px] text-slate-400">Auto-configured</span>
          </div>

          {/* Dynamic Technical Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(currentFields).map((key) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  value={currentFields[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Mobile Camera Integration */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Photo Evidence ({domainPhotos.length})
              </span>
              <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center space-x-1">
                <span>📷 Capture / Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
              </label>
            </div>

            {domainPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {domainPhotos.map((p) => (
                  <div key={p.id} className="relative bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <img src={p.url} alt={p.category} className="w-full h-20 object-cover rounded-lg" />
                    <button
                      onClick={() => removePhoto(p.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Engineer Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Field Observations & Recommendations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter site-specific observations or engineering notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-extrabold text-white rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            ✔ Complete & Save {selectedDomain} Checklist
          </button>
        </div>
      </div>
    </div>
  );
}