
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
      await new Promise(resolve => setTimeout(resolve, 200));

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
      
      // Handle multiple pages if content is long
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

      pdf.save(`Liste_Autohaus_Radtke_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF export failed", error);
      alert("Fehler beim Erstellen der PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Header */}
      <header className="bg-white border-b-4 border-yellow-400 py-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <div className="bg-black text-yellow-400 p-2 font-black text-2xl rounded">R</div>
             <div>
                <h1 className="text-2xl font-black text-black leading-tight">Autohaus Radtke GmbH</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Opel Profi-Tool</p>
             </div>
          </div>
          <div className="flex gap-3">
             <button
              onClick={() => {
                if(confirm("Komplette Liste und aktuelle Eingaben löschen?")) {
                  setVehicleList([]);
                  setCurrentVehicle(initialVehicleData);
                }
              }}
              className="px-4 py-2 text-sm font-bold text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
            >
              Liste leeren
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting || vehicleList.length === 0}
              className="bg-black text-white px-8 py-2 rounded font-black hover:bg-gray-800 transition-all flex items-center shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <><i className="fas fa-spinner animate-spin mr-2"></i> Erstelle PDF...</>
              ) : (
                <><i className="fas fa-file-pdf mr-2 text-yellow-400"></i> PDF generieren ({vehicleList.length})</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-6">
            <VehicleForm 
              data={currentVehicle} 
              onChange={handleDataChange} 
              onAddToList={handleAddToList}
            />
          </div>

          {/* List Side */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-black text-gray-400 uppercase text-sm tracking-widest flex items-center gap-2">
              <i className="fas fa-list-ol"></i> Aktuelle Liste ({vehicleList.length})
            </h3>
            
            {vehicleList.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <i className="fas fa-car text-4xl mb-4 block opacity-20"></i>
                <p>Noch keine Fahrzeuge hinzugefügt.</p>
                <p className="text-xs">Füllen Sie das Formular aus und klicken Sie auf "Hinzufügen".</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicleList.map((v, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center group animate-in slide-in-from-right duration-300">
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded">#{i+1}</span>
                         <p className="font-bold text-lg">{v.model || 'Unbekanntes Modell'}</p>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">{v.vin || 'KEINE VIN'}</p>
                    </div>
                    <button 
                      onClick={() => removeFromList(i)}
                      className="text-gray-300 hover:text-red-600 p-2 transition-colors"
                      title="Löschen"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Hidden PDF component used as source for html2canvas */}
      <PDFPreview vehicles={vehicleList} previewRef={previewRef} />

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        Autohaus Radtke GmbH &bull; Jan Radtke &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
