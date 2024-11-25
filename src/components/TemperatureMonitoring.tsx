import { type FC } from 'react';

interface TemperatureMonitoringProps {
  hotCartTemp: number;
  coldCartTemp: number;
  displayCaseTemp: number;
  onUpdate: (field: string, value: number) => void;
  timestamp: string;
  onUpdateTimestamp: () => void;
}

export const TemperatureMonitoring: FC<TemperatureMonitoringProps> = ({
  hotCartTemp,
  coldCartTemp,
  displayCaseTemp,
  onUpdate,
  timestamp,
  onUpdateTimestamp,
}) => {
  const handleTemperatureChange = (field: string, value: string) => {
    const numberValue = value === '' ? 0 : parseFloat(value);
    onUpdate(field, numberValue);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">2. Geräte-Temperaturüberwachung</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{timestamp}</span>
          <button
            type="button"
            onClick={onUpdateTimestamp}
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Zeit speichern
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Warmhaltewagen (°C)</label>
          <input
            type="number"
            value={hotCartTemp || ''}
            onChange={(e) => handleTemperatureChange('hotCartTemp', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Kühlvitrine (°C)</label>
          <input
            type="number"
            value={coldCartTemp || ''}
            onChange={(e) => handleTemperatureChange('coldCartTemp', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Kühltheke (°C)</label>
          <input
            type="number"
            value={displayCaseTemp || ''}
            onChange={(e) => handleTemperatureChange('displayCaseTemp', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};