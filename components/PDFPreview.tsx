
import React from 'react';
import { VehicleData } from '../types';

interface PDFPreviewProps {
  vehicles: VehicleData[];
  previewRef: React.RefObject<HTMLDivElement>;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ vehicles, previewRef }) => {
  const currentDate = new Date().toLocaleDateString('de-DE');

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
      {/* Off-screen container for high-quality PDF capture */}
      <div 
        ref={previewRef}
        className="bg-white w-[210mm] min-h-[297mm] p-[20mm] flex flex-col text-black"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase mb-2">Autohaus Radtke GmbH</h1>
          <div className="h-1.5 bg-black w-full mb-2"></div>
          <p className="text-xl font-bold italic text-gray-700 underline decoration-yellow-400 decoration-4">Ihr Opel Partner</p>
        </div>

        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-3xl font-bold">FAHRZEUGLISTE / ANGEBOT</h2>
          <p className="text-lg font-semibold text-gray-600">Datum: {currentDate}</p>
        </div>

        {/* Content Section */}
        <div className="flex-grow space-y-12">
          {vehicles.map((v, index) => (
            <div key={index} className="break-inside-avoid mb-12">
              <div className="bg-black text-white px-4 py-2 text-xl font-bold mb-0 w-fit">
                FAHRZEUG #{index + 1}
              </div>
              <table className="w-full border-collapse border-4 border-black">
                <tbody>
                  <tr>
                    <td className="border-4 border-black p-4 font-bold bg-gray-100 uppercase text-sm w-1/4">Modell</td>
                    <td className="border-4 border-black p-4 text-2xl font-black">{v.model || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border-4 border-black p-4 font-bold bg-gray-100 uppercase text-sm">VIN Nummer</td>
                    <td className="border-4 border-black p-4 text-xl font-mono tracking-tighter">{v.vin || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border-4 border-black p-4 font-bold bg-gray-100 uppercase text-sm">Ausstattung</td>
                    <td className="border-4 border-black p-4 text-xl">{v.equipmentLine || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border-4 border-black p-4 font-bold bg-gray-100 uppercase text-sm">Motor</td>
                    <td className="border-4 border-black p-4 text-xl">{v.engine || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border-4 border-black p-4 font-bold bg-gray-100 uppercase text-sm align-top">Sonderausstattung</td>
                    <td className="border-4 border-black p-4 text-lg whitespace-pre-wrap leading-tight min-h-[100px]">
                      {v.specialEquipment || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Signature Section */}
        <div className="mt-20 flex flex-col items-start">
          <div className="mb-2">
             <p className="text-xs text-gray-400 mb-8 italic">Unterschrift / Stempel</p>
             <div className="w-80 h-0.5 bg-black"></div>
          </div>
          <p className="text-xl font-black">Jan Radtke</p>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Autohaus Radtke GmbH</p>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
