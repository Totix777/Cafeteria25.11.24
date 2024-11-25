interface HeaderProps {
  employeeName: string;
  onLogout: () => void;
}

export function Header({ employeeName, onLogout }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Melmer Stübchen - Tägliche Inspektionscheckliste</h1>
      <div className="text-right">
        <p className="text-sm text-gray-600 mb-1">Angemeldet als: {employeeName}</p>
        <button
          type="button"
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Abmelden
        </button>
      </div>
    </div>
  );
}