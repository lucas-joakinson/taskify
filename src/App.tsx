import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        user={user} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <div className="max-w-[1280px] mx-auto w-full p-6 lg:p-10">
          <div className="pt-16 lg:pt-0">
            {children}
          </div>
        </div>
      </main>
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
                <TasksPage globalSearchTerm={searchTerm} setGlobalSearchTerm={setSearchTerm} />
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
