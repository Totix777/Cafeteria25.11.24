import { useState } from 'react';
import { format } from 'date-fns';
import { ChecklistItem } from '../types';
import { saveChecklistToFirebase, getChecklists } from '../utils/firebaseUtils';
import { exportToCSV } from '../utils/csvExport';
import { Header } from './Header';
import { FoodItemInput } from './FoodItemInput';
import { TemperatureMonitoring } from './TemperatureMonitoring';
import { CleaningChecklist } from './CleaningChecklist';
import { SalesInput } from './SalesInput';

interface DailyChecklistProps {
  employeeName: string;
  onLogout: () => void;
}

export function DailyChecklist({ employeeName, onLogout }: DailyChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem>({
    id: crypto.randomUUID(),
    date: format(new Date(), 'yyyy-MM-dd'),
    employeeName,
    dailySales: {
      cash: 0,
      card: 0,
      total: 0
    },
    foodItems: [{ name: '', temperature: 0 }],
    hotCartTemp: 0,
    coldCartTemp: 0,
    displayCaseTemp: 0,
    coffeeMachineCleaned: false,
    waterDispenserCleaned: false,
    waterDispenserNozzle: false,
    sinkCounterCleaned: false,
    glassShelfCleaned: false,
    warmCartCleaned: false,
    coldCartCleaned: false,
    displayCaseCleaned: false,
    timestamps: {
      section1: format(new Date(), 'HH:mm'),
      section2: '',
      section3: '',
      section4: '',
    },
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const updateFoodItem = (index: number, field: 'name' | 'temperature', value: string | number) => {
    const newFoodItems = [...checklist.foodItems];
    newFoodItems[index] = {
      ...newFoodItems[index],
      [field]: value
    };
    setChecklist(prev => ({ ...prev, foodItems: newFoodItems }));
  };

  const addFoodItem = () => {
    setChecklist(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, { name: '', temperature: 0 }]
    }));
  };

  const updateTemperature = (field: string, value: number) => {
    setChecklist(prev => ({ ...prev, [field]: value }));
  };

  const updateCleaning = (field: string, value: boolean) => {
    setChecklist(prev => ({ ...prev, [field]: value }));
  };

  const updateSales = (value: { cash: number; card: number; total: number }) => {
    setChecklist(prev => ({ ...prev, dailySales: value }));
  };

  const updateTimestamp = (section: keyof ChecklistItem['timestamps']) => {
    setChecklist(prev => ({
      ...prev,
      timestamps: {
        ...prev.timestamps,
        [section]: format(new Date(), 'HH:mm')
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await saveChecklistToFirebase(checklist);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      const checklists = await getChecklists();
      
      if (!checklists || checklists.length === 0) {
        throw new Error('Keine Daten zum Exportieren verfügbar');
      }
      
      await exportToCSV(checklists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Herunterladen der Daten');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Header employeeName={employeeName} onLogout={onLogout} />
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <FoodItemInput
        items={checklist.foodItems}
        onUpdate={updateFoodItem}
        onAdd={addFoodItem}
        timestamp={checklist.timestamps.section1}
        onUpdateTimestamp={() => updateTimestamp('section1')}
      />

      <TemperatureMonitoring
        hotCartTemp={checklist.hotCartTemp}
        coldCartTemp={checklist.coldCartTemp}
        displayCaseTemp={checklist.displayCaseTemp}
        onUpdate={updateTemperature}
        timestamp={checklist.timestamps.section2}
        onUpdateTimestamp={() => updateTimestamp('section2')}
      />

      <CleaningChecklist
        checklist={checklist}
        onUpdate={updateCleaning}
        timestamp={checklist.timestamps.section3}
        onUpdateTimestamp={() => updateTimestamp('section3')}
      />

      <SalesInput 
        value={checklist.dailySales}
        onUpdate={updateSales}
        timestamp={checklist.timestamps.section4}
        onUpdateTimestamp={() => updateTimestamp('section4')}
      />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`flex-1 py-2 text-white rounded ${
            saving 
              ? 'bg-gray-400' 
              : saved 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {saving ? 'Wird gespeichert...' : saved ? 'Gespeichert ✓' : 'Speichern'}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={`flex-1 py-2 text-white rounded ${
            downloading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {downloading ? 'Wird heruntergeladen...' : 'Excel herunterladen'}
        </button>
      </div>
    </div>
  );
}