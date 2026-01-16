
import React, { useState, useRef } from 'react';
import VehicleForm from './components/VehicleForm';
import PDFPreview from './components/PDFPreview';
import { VehicleData, initialVehicleData } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [currentVehicle, setCurrentVehicle] = useState<VehicleData>(initialVehicleData);
  const [vehicleList, setVehicleList] = useState<VehicleData[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDataChange = (field: keyof VehicleData, value: string) => {
    setCurrentVehicle(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToList = () => {
    if (!currentVehicle.model && !currentVehicle.vin) {
      alert("Bitte geben Sie mindestens ein Modell oder eine VIN an.");
      return;
    }
    setVehicleList(prev => [...prev, currentVehicle]);
    setCurrentVehicle(initialVehicleData);
  };

  const removeFromList = (index: number) => {
    setVehicleList(prev => prev.filter((_, i) => i !== index));
  };

  const handleExportPDF = async () => {
    if (vehicleList.length === 0) {
      alert("Die Liste ist leer. Bitte fügen Sie zuerst Fahrzeuge hinzu.");
      return;
    }
    
    if (!previewRef.current) return;
    setIsExporting(true);
    
    try {
      // Small delay to ensure any pending renders are settled
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      const pageHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Autohaus_Radtke_Fahrzeugliste_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error("PDF export failed", error);
      alert("Fehler beim Erstellen der PDF. Details in der Konsole.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b-4 border-[#FFD100] py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <div className="bg-black text-[#FFD100] w-12 h-12 flex items-center justify-center font-black text-3xl rounded">R</div>
             <div>
                <h1 className="text-xl font-black text-black leading-none uppercase">Autohaus Radtke GmbH</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Offizielles Opel Portal</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button
              onClick={() => {
                if(confirm("Die gesamte Liste löschen?")) {
                  setVehicleList([]);
                }
              }}
              disabled={vehicleList.length === 0}
              className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded transition-all disabled:opacity-30"
            >
              <i className="fas fa-trash-alt mr-1"></i> Liste leeren
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting || vehicleList.length === 0}
              className="bg-black text-white px-6 py-2 rounded font-black hover:bg-gray-800 transition-all flex items-center shadow-lg disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <><i className="fas fa-circle-notch animate-spin mr-2"></i> Erstelle...</>
              ) : (
                <><i className="fas fa-file-pdf mr-2 text-[#FFD100]"></i> PDF generieren ({vehicleList.length})</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Side */}
          <div className="lg:col-span-5">
            <VehicleForm 
              data={currentVehicle} 
              onChange={handleDataChange} 
              onAddToList={handleAddToList}
            />
          </div>

          {/* List Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-[500px]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-list text-[#FFD100]"></i> Fahrzeuge in der Liste ({vehicleList.length})
                </h3>
              </div>
              
              <div className="p-4 flex-grow">
                {vehicleList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 py-20">
                    <i className="fas fa-car-side text-6xl mb-4 opacity-10"></i>
                    <p className="font-bold">Keine Fahrzeuge hinzugefügt</p>
                    <p className="text-xs text-center px-10">Geben Sie links die Daten ein und klicken Sie auf "Hinzufügen", um sie auf das PDF zu setzen.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {vehicleList.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded hover:border-black transition-all group">
                        <div className="flex gap-4 items-center">
                          <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-bold leading-tight">{v.model || 'Modell unbenannt'}</p>
                            <p className="text-[10px] text-gray-400 font-mono tracking-tighter">{v.vin || 'KEINE VIN'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromList(i)}
                          className="text-gray-200 hover:text-red-500 p-2 transition-colors"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-yellow-50 text-[10px] text-yellow-700 italic border-t border-yellow-100 rounded-b-lg">
                <i className="fas fa-info-circle mr-1"></i> Fahrzeuge auf der Liste werden in der gewählten Reihenfolge im PDF untereinander ausgegeben.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden PDF component */}
      <PDFPreview vehicles={vehicleList} previewRef={previewRef} />

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        Autohaus Radtke GmbH &bull; Jan Radtke &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
