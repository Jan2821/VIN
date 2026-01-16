
import React from 'react';
import { VehicleData } from '../types';

interface PDFPreviewProps {
  vehicles: VehicleData[];
  previewRef: React.RefObject<HTMLDivElement>;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ vehicles, previewRef }) => {
  const currentDate = new Date().toLocaleDateString('de-DE');

  return (
    <div className="absolute opacity-0 pointer-events-none -z-50 overflow-hidden" style={{ height: 0 }}>
      {/* This container is hidden from the UI but used for PDF generation */}
      <div 
        ref={previewRef}
        className="bg-white w-[210mm] min-h-[297mm] p-[25mm] flex flex-col text-black"
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '14pt' }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black uppercase tracking-wider mb-2">Autohaus Radtke GmbH</h1>
          <div className="h-1 bg-black w-full mb-2"></div>
          <p className="text-xl italic font-bold">Ihr Opel Partner</p>
        </div>

        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black underline decoration-2 underline-offset-8">FAHRZEUGLISTE</h2>
          </div>
          <div className="text-right">
            <p className="font-bold">Datum: {currentDate}</p>
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-grow">
          {vehicles.length === 0 ? (
            <p className="text-center text-gray-400 mt-20 italic">Keine Fahrzeuge auf der Liste.</p>
          ) : (
            <div className="space-y-12">
              {vehicles.map((v, index) => (
                <div key={index} className="break-inside-avoid">
                  <h3 className="text-xl font-bold mb-2 bg-gray-100 p-2 border-l-8 border-black">Fahrzeug #{index + 1}</h3>
                  <table className="w-full border-collapse border-2 border-black">
                    <tbody>
                      <tr>
                        <td className="border-2 border-black p-4 font-bold w-1/3 bg-gray-50 uppercase text-sm">Modell</td>
                        <td className="border-2 border-black p-4 text-xl font-medium">{v.model || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-black p-4 font-bold bg-gray-50 uppercase text-sm">VIN Nummer</td>
                        <td className="border-2 border-black p-4 text-xl tracking-widest">{v.vin || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-black p-4 font-bold bg-gray-50 uppercase text-sm">Ausstattung</td>
                        <td className="border-2 border-black p-4 text-lg">{v.equipmentLine || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-black p-4 font-bold bg-gray-50 uppercase text-sm">Motorisierung</td>
                        <td className="border-2 border-black p-4 text-lg">{v.engine || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-black p-4 font-bold bg-gray-50 uppercase text-sm align-top">Sonderausstattung</td>
                        <td className="border-2 border-black p-4 text-lg whitespace-pre-wrap leading-relaxed">
                          {v.specialEquipment || '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="mt-24 flex flex-col items-start">
          <div className="w-80 h-[1px] bg-black mb-2"></div>
          <p className="text-xl font-bold">Jan Radtke</p>
          <p className="text-sm font-bold uppercase text-gray-600">Geschäftsführer | Autohaus Radtke GmbH</p>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
