import React from 'react';
import Login from '../pages/Login';
import MainContent from '../pages/MainContent';

interface MainLayoutProps {
  currentPage: 'login' | 'main';
  onLogin: () => void;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ currentPage, onLogin, onLogout }) => {
  switch (currentPage) {
    case 'login':
      return <Login onLogin={onLogin} />;
    case 'main':
      return <MainContent onLogout={onLogout} />;
    default:
      return null;
  }
};

export default MainLayout;
