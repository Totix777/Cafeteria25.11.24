import { type FC } from 'react';

interface CleaningChecklistProps {
  checklist: {
    coffeeMachineCleaned: boolean;
    waterDispenserCleaned: boolean;
    waterDispenserNozzle: boolean;
    sinkCounterCleaned: boolean;
    glassShelfCleaned: boolean;
    warmCartCleaned: boolean;
    coldCartCleaned: boolean;
    displayCaseCleaned: boolean;
  };
  onUpdate: (field: string, value: boolean) => void;
  timestamp: string;
  onUpdateTimestamp: () => void;
}

export const CleaningChecklist: FC<CleaningChecklistProps> = ({ checklist, onUpdate, timestamp, onUpdateTimestamp }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">3. Reinigungsnachweis</h2>
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
      <div className="space-y-2">
        <div className="border-b pb-2 mb-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Gerätereinigung</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.warmCartCleaned}
              onChange={(e) => onUpdate('warmCartCleaned', e.target.checked)}
              className="mr-2"
            />
            Warmhaltewagen gereinigt
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.coldCartCleaned}
              onChange={(e) => onUpdate('coldCartCleaned', e.target.checked)}
              className="mr-2"
            />
            Kühlvitrine gereinigt
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.displayCaseCleaned}
              onChange={(e) => onUpdate('displayCaseCleaned', e.target.checked)}
              className="mr-2"
            />
            Kühltheke gereinigt
          </label>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Allgemeine Reinigung</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.coffeeMachineCleaned}
              onChange={(e) => onUpdate('coffeeMachineCleaned', e.target.checked)}
              className="mr-2"
            />
            Kaffeemaschine gereinigt
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.waterDispenserCleaned}
              onChange={(e) => onUpdate('waterDispenserCleaned', e.target.checked)}
              className="mr-2"
            />
            Wasserspender gereinigt
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.waterDispenserNozzle}
              onChange={(e) => onUpdate('waterDispenserNozzle', e.target.checked)}
              className="mr-2"
            />
            Wasserspender-Düse desinfiziert
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.sinkCounterCleaned}
              onChange={(e) => onUpdate('sinkCounterCleaned', e.target.checked)}
              className="mr-2"
            />
            Spüle und Theke gereinigt
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={checklist.glassShelfCleaned}
              onChange={(e) => onUpdate('glassShelfCleaned', e.target.checked)}
              className="mr-2"
            />
            Glasregal gereinigt
          </label>
        </div>
      </div>
    </div>
  );
};