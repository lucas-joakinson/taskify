import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import LoginPage from './pages/LoginPage';
import { authService } from './services/api';
import { User } from './types';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const DashboardLayout = ({ 
  children, 
  searchTerm, 
  setSearchTerm 
}: { 
  children: React.ReactNode;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header fixo com largura controlada */}
        <Header user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* Main com padding-top para compensar o header fixo (h-20 = 80px) */}
        <main className="flex-1 pt-20 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <DashboardLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                <TasksPage globalSearchTerm={searchTerm} />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
