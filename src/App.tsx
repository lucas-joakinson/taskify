import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import LoginPage from './pages/LoginPage';
import { authService } from './services/api';
import { User } from './types';

// Componente para proteger rotas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Layout principal do Dashboard
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        {/* ml-0 para mobile e ml-64 para desktop (espaço da sidebar fixa) */}
        <main className="lg:ml-64 pt-20 p-4 lg:p-8 min-h-screen overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TasksPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
