import React, { useState, useEffect } from "react";
import CustomTitleBar from "./components/CustomTitleBar";
import MenuBar from "./components/MenuBar";
import ToolBar from "./components/ToolBar";
import MainLayout from "./layouts/MainLayout";

interface VideoFile {
  id: string;
  file: File;
  name: string;
  size: number;
  duration?: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'main'>('login');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<VideoFile[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);
  const [currentTaskName, setCurrentTaskName] = useState<string>('');
  const [hasLocation, setHasLocation] = useState(false);
  const [hasTile, setHasTile] = useState(false);
  const [videoControlRef, setVideoControlRef] = useState<{
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
  } | null>(null);

  const handleLogin = () => setCurrentPage('main');
  const handleLogout = () => setCurrentPage('login');

  const handleVideoPlayStateChange = (isPlaying: boolean) => {
    setIsVideoPlaying(isPlaying);
  };

  const handleVideoUpload = (videos: VideoFile[]) => {
    setUploadedVideos(videos);
  };

  const handleFiltersChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleTaskUpdate = (taskName: string) => {
    setCurrentTaskName(taskName);
  };

  // Track location and tile selection state
  useEffect(() => {
    if (currentTaskName.includes('Location selected')) {
      setHasLocation(true);
    }
    if (currentTaskName.includes('Tile selected')) {
      setHasTile(true);
    }
    if (currentTaskName.includes('Reset to clean state')) {
      setHasLocation(false);
      setHasTile(false);
    }
  }, [currentTaskName]);

  // Video control handlers for toolbar
  const handlePlay = () => {
    videoControlRef?.play();
  };

  const handlePause = () => {
    videoControlRef?.pause();
  };

  const handleStop = () => {
    videoControlRef?.stop();
  };

  const handleRestart = () => {
    videoControlRef?.restart();
  };

  // Register video control methods (this would be called from CESLeftPanel or SceneGeneration)
  const registerVideoControls = (controls: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
  }) => {
    setVideoControlRef(controls);
  };

  // Determine if we have content to work with 
  // For CES: videos uploaded
  // For Scene Generation: both location AND tile selected
  const hasContent = uploadedVideos.length > 0 || (hasLocation && hasTile);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <CustomTitleBar />

      {currentPage === 'main' && (
        <>
          <MenuBar />
          <ToolBar
            onNewFile={() => console.log("New file")}
            onOpenFolder={() => console.log("Open folder")}
            onSave={() => console.log("Save")}
            onUndo={() => console.log("Undo")}
            onRedo={() => console.log("Redo")}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onRestart={handleRestart}
            onCut={() => console.log("Cut")}
            onCopy={() => console.log("Copy")}
            onPaste={() => console.log("Paste")}
            onSearch={() => console.log("Search")}
            onSettings={() => console.log("Settings")}
            onHelp={() => console.log("Help")}
            isPlaying={isVideoPlaying}
            hasVideos={hasContent}
          />
        </>
      )}
      <div className="flex-1 overflow-hidden">
        <MainLayout
          currentPage={currentPage}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onVideoPlayStateChange={handleVideoPlayStateChange}
          onVideoUpload={handleVideoUpload}
          onFiltersChange={handleFiltersChange}
          onTaskUpdate={handleTaskUpdate}
          onRegisterVideoControls={registerVideoControls}
          isVideoPlaying={isVideoPlaying}
          selectedFilters={selectedFilters}
          currentTaskName={currentTaskName}
        />
      </div>
    </div>
  );
};

export default App;