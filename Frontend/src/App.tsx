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
  const [hasVideoReference, setHasVideoReference] = useState(false);
  const [videoControlRef, setVideoControlRef] = useState<{
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
  } | null>(null);

  const handleLogin = () => setCurrentPage('main');
  const handleLogout = () => setCurrentPage('login');

  const handleVideoPlayStateChange = (isPlaying: boolean) => {
    console.log('App: Video play state changed to:', isPlaying);
    setIsVideoPlaying(isPlaying);
  };

  const handleVideoUpload = (videos: VideoFile[]) => {
    setUploadedVideos(videos);
  };

  const handleFiltersChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleTaskUpdate = (taskName: string) => {
    console.log('App: Task update received:', taskName);
    setCurrentTaskName(taskName);
  };

  // Track location, tile, and video reference selection state
  useEffect(() => {
    console.log('App: Tracking task name changes:', currentTaskName);
    
    if (currentTaskName.includes('Location selected')) {
      setHasLocation(true);
    }
    if (currentTaskName.includes('Starting point selected') || currentTaskName.includes('Tile selected')) {
      setHasTile(true);
    }
    if (currentTaskName.includes('Reference selected') || currentTaskName.includes('Video selected') || currentTaskName.includes('Video uploaded')) {
      setHasVideoReference(true);
    }
    if (currentTaskName.includes('Reset to clean state')) {
      setHasLocation(false);
      setHasTile(false);
      setHasVideoReference(false);
    }
  }, [currentTaskName]);

  // Video control handlers for toolbar
  const handlePlay = () => {
    console.log('App: ToolBar Play clicked, videoControlRef:', !!videoControlRef);
    if (videoControlRef) {
      videoControlRef.play();
    } else {
      console.warn('App: No video controls registered');
    }
  };

  const handlePause = () => {
    console.log('App: ToolBar Pause clicked');
    if (videoControlRef) {
      videoControlRef.pause();
    }
  };

  const handleStop = () => {
    console.log('App: ToolBar Stop clicked');
    if (videoControlRef) {
      videoControlRef.stop();
    }
  };

  const handleRestart = () => {
    console.log('App: ToolBar Restart clicked');
    if (videoControlRef) {
      videoControlRef.restart();
    }
  };

  // Register video control methods
  const registerVideoControls = (controls: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
  }) => {
    console.log('App: Registering video controls:', !!controls);
    setVideoControlRef(controls);
  };

  // Determine if we have content to work with 
  // For CES: videos uploaded
  // For Scene Generation: both location AND tile AND video reference selected
  const hasContent = uploadedVideos.length > 0 || 
    (hasLocation && hasTile) || 
    currentTaskName.includes("Scenario generation ready");

  console.log('App state:', { 
    hasLocation, 
    hasTile, 
    hasVideoReference, 
    hasContent, 
    currentTaskName,
    videoControlRef: !!videoControlRef,
    isVideoPlaying
  });

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