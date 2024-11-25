import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { DailyChecklist } from './components/DailyChecklist';
import { AuthState } from './types';

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    employeeName: '',
  });

  const handleLogin = (employeeName: string) => {
    setAuth({
      isAuthenticated: true,
      employeeName,
    });
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      employeeName: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {auth.isAuthenticated ? (
        <div className="py-8">
          <DailyChecklist employeeName={auth.employeeName} onLogout={handleLogout} />
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;