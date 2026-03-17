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
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header user={user} />
      <main className="ml-64 pt-28 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
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
