import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (employeeName: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [employeeName, setEmployeeName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Melm2') {
      onLogin(employeeName);
    } else {
      setError('Ungültiges Passwort');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Melmer Stübchen Anmeldung</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-2">
            Mitarbeitername
          </label>
          <input
            type="text"
            id="employeeName"
            required
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Passwort
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Anmelden
        </button>
      </form>
    </div>
  );
}