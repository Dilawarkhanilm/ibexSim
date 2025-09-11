import React, { useState } from "react";
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

  // Register video control methods (this would be called from CESLeftPanel)
  const registerVideoControls = (controls: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
  }) => {
    setVideoControlRef(controls);
  };

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
            hasVideos={uploadedVideos.length > 0}
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
          onRegisterVideoControls={registerVideoControls}
          isVideoPlaying={isVideoPlaying}
          selectedFilters={selectedFilters}
        />
      </div>
    </div>
  );
};

export default App;