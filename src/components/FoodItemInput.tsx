import { type FC } from 'react';

interface FoodItem {
  name: string;
  temperature: number;
}

interface FoodItemInputProps {
  items: FoodItem[];
  onUpdate: (index: number, field: 'name' | 'temperature', value: string | number) => void;
  onAdd: () => void;
  timestamp: string;
  onUpdateTimestamp: () => void;
}

export const FoodItemInput: FC<FoodItemInputProps> = ({ items, onUpdate, onAdd, timestamp, onUpdateTimestamp }) => {
  const handleTemperatureChange = (index: number, value: string) => {
    const numberValue = value === '' ? 0 : parseFloat(value);
    onUpdate(index, 'temperature', numberValue);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">1. Lebensmittel-Temperaturüberwachung</h2>
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
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 mb-2">
          <input
            type="text"
            placeholder="Lebensmittelname"
            value={item.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Temperatur"
            value={item.temperature || ''}
            onChange={(e) => handleTemperatureChange(index, e.target.value)}
            className="w-24 p-2 border rounded"
          />
          <span className="p-2">°C</span>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Lebensmittel hinzufügen
      </button>
    </div>
  );
};