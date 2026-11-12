'use client';

import React, { useState } from 'react';

export default function SolarSurveyForm({ taskId, taskData, onSubmitted }: { taskId: string; taskData?: any; onSubmitted?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // 1. Site & Client Information state (Site Facility Name removed)
  const [clientName, setClientName] = useState(taskData?.clientName || '');
  const [coordinates, setCoordinates] = useState(taskData?.location || '');
  const [contactPerson, setContactPerson] = useState(taskData?.contactPerson || '');
  const [contactPhone, setContactPhone] = useState(taskData?.contactPhone || '');

  // 2. System & Structural Parameters state
  const [peakLoad, setPeakLoad] = useState('');
  const [structureArea, setStructureArea] = useState('');
  const [roofingSpec, setRoofingSpec] = useState('');

  // 3. Custom Equipment & Inventory Specification Inputs (BOM)
  const [inverterName, setInverterName] = useState('');
  const [inverterSpecs, setInverterSpecs] = useState('');
  const [inverterQty, setInverterQty] = useState(1);

  const [panelName, setPanelName] = useState('');
  const [panelSpecs, setPanelSpecs] = useState('');
  const [panelQty, setPanelQty] = useState(8);

  const [batteryName, setBatteryName] = useState('');
  const [batterySpecs, setBatterySpecs] = useState('');
  const [batteryQty, setBatteryQty] = useState(1);

  // Dedicated Cabling States
  const [houseWireSize, setHouseWireSize] = useState('');
  const [houseWireLength, setHouseWireLength] = useState('');

  const [solarCableSize, setSolarCableSize] = useState('');
  const [solarCableLength, setSolarCableLength] = useState('');

  const [batteryCableSize, setBatteryCableSize] = useState('');
  const [batteryCableLength, setBatteryCableLength] = useState('');

  // Terminals, Trunking & Conduits
  const [trunkingName, setTrunkingName] = useState('');
  const [trunkingSpecs, setTrunkingSpecs] = useState('');

  const [conduitName, setConduitName] = useState('');
  const [conduitSpecs, setConduitSpecs] = useState('');

  // Auto-Detect GPS function
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setCoordinates(`${lat}, ${lng}`);
        setGpsLoading(false);
      },
      (error) => {
        console.error('Error fetching location:', error);
        alert('Unable to retrieve location. Please check browser permissions.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const bomList = [
      {
        category: 'Inverter',
        item: inverterName || 'Huawei SUN2000 Hybrid Inverter',
        qty: `${inverterQty} Unit`,
        specs: inverterSpecs || '5kW Hybrid',
      },
      {
        category: 'Solar Array',
        item: panelName || 'Monocrystalline 550W High-Efficiency',
        qty: `${panelQty} Units`,
        specs: panelSpecs || roofingSpec || 'Standard Tilt',
      },
      {
        category: 'Battery Storage',
        item: batteryName || 'LiFePO4 Lithium Backup Battery',
        qty: `${batteryQty} Units`,
        specs: batterySpecs || '48V Bank',
      },
      {
        category: 'Cabling — House Wire',
        item: `AC House Wire (${houseWireSize || '4mm²'})`,
        qty: houseWireLength ? `${houseWireLength}m` : '1 Roll',
        specs: 'AC Distribution / Twin & Earth',
      },
      {
        category: 'Cabling — Solar Cable',
        item: `PV Solar Cable (${solarCableSize || '6mm²'})`,
        qty: solarCableLength ? `${solarCableLength}m` : '1 Roll',
        specs: 'UV-Resistant DC PV1-F',
      },
      {
        category: 'Cabling — Battery Cable',
        item: `Battery Interconnect (${batteryCableSize || '25mm²'})`,
        qty: batteryCableLength ? `${batteryCableLength}m` : '1 Set',
        specs: 'High-Current Flexible Cable',
      },
      {
        category: 'Terminals & Trunking',
        item: trunkingName || 'Tinned Copper Lugs & 50x50mm Trunking',
        qty: 'Accessory Pack',
        specs: trunkingSpecs || 'Mounting Hardware',
      },
      {
        category: 'Conduit Run',
        item: conduitName || 'Flexible PVC — 20mm',
        qty: 'Route Kit',
        specs: conduitSpecs || 'Inspection Box + Bends',
      },
    ];

    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          clientName,
          siteName: clientName, // Fallback siteName to clientName if needed
          location: coordinates,
          contactPerson,
          contactPhone,
          status: 'PENDING_REVIEW',
          surveyData: {
            surveyType: 'Solar & Power Audit',
            clientName,
            location: coordinates,
            contactPerson,
            contactPhone,
            peakLoad,
            structureArea,
            roofingSpec,
            materialsBOM: bomList,
          },
        }),
      });

      if (res.ok && onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      console.error('Failed to submit survey:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
      <div>
        <h2 className="text-2xl font-black text-white">Solar Survey Form</h2>
      </div>

      {/* SECTION 1: Site & Client Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
          1. Site & Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-bold">Client / Organization Name</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Mohale Lodge"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-300 font-bold">Exact GPS Coordinates / Location</label>
              <button
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={gpsLoading}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg transition-all"
              >
                {gpsLoading ? 'Detecting GPS...' : '📍 Auto-Detect GPS'}
              </button>
            </div>
            <input
              type="text"
              required
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              placeholder="-29.273723, 27.529160"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-bold">On-site Contact</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-bold">Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+266 ..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: System & Structural Parameters */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
          2. System & Structural Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-bold">Peak System Load (kW / kVA)</label>
            <input
              type="text"
              required
              value={peakLoad}
              onChange={(e) => setPeakLoad(e.target.value)}
              placeholder="e.g. 5kW Peak"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-bold">Mounting Structure Area (m²)</label>
            <input
              type="text"
              required
              value={structureArea}
              onChange={(e) => setStructureArea(e.target.value)}
              placeholder="e.g. 35 m² rooftop"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-bold">Roofing Structure & Tilt</label>
            <input
              type="text"
              required
              value={roofingSpec}
              onChange={(e) => setRoofingSpec(e.target.value)}
              placeholder="e.g. IBR Corrugated, 15° Tilt"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Custom Equipment & Inventory Specification Inputs (BOM) */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
          3. Equipment & Inventory Specification Inputs (BOM)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inverter Input */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase">Inverter Model & Specs</label>
            <input
              type="text"
              value={inverterName}
              onChange={(e) => setInverterName(e.target.value)}
              placeholder="e.g. Huawei SUN2000 Hybrid Inverter"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={inverterSpecs}
              onChange={(e) => setInverterSpecs(e.target.value)}
              placeholder="Technical Specs (e.g. 5kW Hybrid / 3-Phase)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-bold">Required Qty:</span>
              <input
                type="number"
                min="0"
                value={inverterQty}
                onChange={(e) => setInverterQty(Number(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white text-center"
              />
            </div>
          </div>

          {/* Solar Array Input */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase">Solar Array Panel Model & Specs</label>
            <input
              type="text"
              value={panelName}
              onChange={(e) => setPanelName(e.target.value)}
              placeholder="e.g. Monocrystalline Panel"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={panelSpecs}
              onChange={(e) => setPanelSpecs(e.target.value)}
              placeholder="Technical Specs (e.g. 550W High-Efficiency)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-bold">Total Panel Count:</span>
              <input
                type="number"
                min="0"
                value={panelQty}
                onChange={(e) => setPanelQty(Number(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white text-center"
              />
            </div>
          </div>

          {/* Battery Storage Input */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase">Battery Storage Model & Specs</label>
            <input
              type="text"
              value={batteryName}
              onChange={(e) => setBatteryName(e.target.value)}
              placeholder="e.g. LiFePO4 Lithium Backup Battery"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={batterySpecs}
              onChange={(e) => setBatterySpecs(e.target.value)}
              placeholder="Technical Specs (e.g. 48V / 100Ah Bank)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-bold">Bank Units:</span>
              <input
                type="number"
                min="0"
                value={batteryQty}
                onChange={(e) => setBatteryQty(Number(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white text-center"
              />
            </div>
          </div>

          {/* Terminals & Trunking Input */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase">Terminals & Trunking</label>
            <input
              type="text"
              value={trunkingName}
              onChange={(e) => setTrunkingName(e.target.value)}
              placeholder="e.g. Tinned Copper Lugs & 50x50mm Trunking"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={trunkingSpecs}
              onChange={(e) => setTrunkingSpecs(e.target.value)}
              placeholder="Technical Specs (e.g. Mounting Hardware)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Cabling Spools, Sizes & Lengths */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3 md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              Cabling Spools, Sizes & Lengths
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* House Wire */}
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-xl space-y-2">
                <span className="block text-[11px] font-extrabold text-amber-400 uppercase">
                  1. House Wire (AC)
                </span>
                <input
                  type="text"
                  value={houseWireSize}
                  onChange={(e) => setHouseWireSize(e.target.value)}
                  placeholder="Size (e.g. 4mm²)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={houseWireLength}
                  onChange={(e) => setHouseWireLength(e.target.value)}
                  placeholder="Length in meters (e.g. 30)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Solar Cable */}
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-xl space-y-2">
                <span className="block text-[11px] font-extrabold text-amber-400 uppercase">
                  2. Solar Cable (DC PV)
                </span>
                <input
                  type="text"
                  value={solarCableSize}
                  onChange={(e) => setSolarCableSize(e.target.value)}
                  placeholder="Size (e.g. 6mm²)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={solarCableLength}
                  onChange={(e) => setSolarCableLength(e.target.value)}
                  placeholder="Length in meters (e.g. 50)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Battery Cable */}
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-xl space-y-2">
                <span className="block text-[11px] font-extrabold text-amber-400 uppercase">
                  3. Battery Cable
                </span>
                <input
                  type="text"
                  value={batteryCableSize}
                  onChange={(e) => setBatteryCableSize(e.target.value)}
                  placeholder="Size (e.g. 25mm²)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={batteryCableLength}
                  onChange={(e) => setBatteryCableLength(e.target.value)}
                  placeholder="Length in meters (e.g. 4)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Conduit Run Input */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3 md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">Conduit Run Kits</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={conduitName}
                onChange={(e) => setConduitName(e.target.value)}
                placeholder="e.g. Flexible PVC — 20mm"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                value={conduitSpecs}
                onChange={(e) => setConduitSpecs(e.target.value)}
                placeholder="Technical Specs (e.g. Inspection Box + Bends)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-emerald-600/30 transition-all uppercase tracking-wider"
      >
        {loading ? 'Submitting Survey & BOM...' : 'Submit Completed Survey & BOM to Tech Lead'}
      </button>
    </form>
  );
}