import React from 'react';
import Login from '../pages/Login';
import MainContent from '../pages/MainContent';

interface VideoFile {
  id: string;
  file: File;
  name: string;
  size: number;
  duration?: number;
}

interface MainLayoutProps {
  currentPage: 'login' | 'main';
  onLogin: () => void;
  onLogout: () => void;
  onVideoPlayStateChange?: (isPlaying: boolean) => void;
  onVideoUpload?: (videos: VideoFile[]) => void;
  onFiltersChange?: (filters: string[]) => void;
  onTaskUpdate?: (taskName: string) => void;
  onRegisterVideoControls?: (controls: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
  }) => void;
  isVideoPlaying?: boolean;
  selectedFilters?: string[];
  currentTaskName?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  currentPage, 
  onLogin, 
  onLogout,
  onVideoPlayStateChange,
  onVideoUpload,
  onFiltersChange,
  onTaskUpdate,
  onRegisterVideoControls,
  isVideoPlaying = false,
  selectedFilters = ['All'],
  currentTaskName = ''
}) => {
  switch (currentPage) {
    case 'login':
      return <Login onLogin={onLogin} />;
    case 'main':
      return (
        <MainContent 
          onLogout={onLogout}
          onVideoPlayStateChange={onVideoPlayStateChange}
          onVideoUpload={onVideoUpload}
          onFiltersChange={onFiltersChange}
          onTaskUpdate={onTaskUpdate}
          onRegisterVideoControls={onRegisterVideoControls}
          isVideoPlaying={isVideoPlaying}
          selectedFilters={selectedFilters}
          currentTaskName={currentTaskName}
        />
      );
    default:
      return null;
  }
};

export default MainLayout;