import { type FC } from 'react';

interface SalesInputProps {
  value: {
    cash: number;
    card: number;
    total: number;
  };
  onUpdate: (value: { cash: number; card: number; total: number }) => void;
  timestamp: string;
  onUpdateTimestamp: () => void;
}

export const SalesInput: FC<SalesInputProps> = ({ value, onUpdate, timestamp, onUpdateTimestamp }) => {
  const handleSalesChange = (type: 'cash' | 'card', inputValue: string) => {
    const numberValue = inputValue === '' ? 0 : parseFloat(inputValue);
    const newValue = {
      ...value,
      [type]: numberValue,
    };
    newValue.total = Number((newValue.cash + newValue.card).toFixed(2));
    onUpdate(newValue);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">4. Tagesumsatz</h2>
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
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bar-Zahlung</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={value.cash || ''}
                onChange={(e) => handleSalesChange('cash', e.target.value)}
                className="p-2 border rounded w-40"
              />
              <span className="text-gray-600">€</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">EC-Zahlung</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={value.card || ''}
                onChange={(e) => handleSalesChange('card', e.target.value)}
                className="p-2 border rounded w-40"
              />
              <span className="text-gray-600">€</span>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Gesamt-Tagesumsatz:</span>
            <span className="text-xl font-bold">{value.total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};