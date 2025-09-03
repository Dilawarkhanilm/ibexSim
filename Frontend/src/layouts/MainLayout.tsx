import React, { useState } from 'react';
import Login from '../pages/Login';
import MainContent from '../pages/MainContent'; // Import your main layout component

const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'main'>('login'); // Start with 'login' directly

  const handleLogin = () => {
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'main':
        return <MainContent onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return renderPage();
};

export default MainLayout;
