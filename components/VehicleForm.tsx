
import React from 'react';
import { VehicleData } from '../types';

interface VehicleFormProps {
  data: VehicleData;
  onChange: (field: keyof VehicleData, value: string) => void;
  onAddToList: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ data, onChange, onAddToList }) => {
  const isFormEmpty = !data.model && !data.vin && !data.equipmentLine && !data.engine && !data.specialEquipment;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold border-b pb-2">Neues Fahrzeug erfassen</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Modell</label>
            <input
              type="text"
              placeholder="z.B. Corsa"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black outline-none transition-all"
              value={data.model}
              onChange={(e) => onChange('model', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">VIN Nummer</label>
            <input
              type="text"
              placeholder="W0V..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black outline-none transition-all uppercase"
              value={data.vin}
              onChange={(e) => onChange('vin', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Ausstattungslinie</label>
            <input
              type="text"
              placeholder="z.B. GS Line"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black outline-none transition-all"
              value={data.equipmentLine}
              onChange={(e) => onChange('equipmentLine', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Motor</label>
            <input
              type="text"
              placeholder="z.B. 1.2 Turbo"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black outline-none transition-all"
              value={data.engine}
              onChange={(e) => onChange('engine', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Sonderausstattung (Freitext)</label>
          <textarea
            rows={5}
            placeholder="Klimaautomatik, Sitzheizung, etc..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black outline-none transition-all resize-none"
            value={data.specialEquipment}
            onChange={(e) => onChange('specialEquipment', e.target.value)}
          />
        </div>
        
        <button
          onClick={onAddToList}
          disabled={isFormEmpty}
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Fahrzeug zur Liste hinzufügen
        </button>
      </div>
    </div>
  );
};

export default VehicleForm;
