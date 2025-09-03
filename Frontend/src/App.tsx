// Frontend/src/App.tsx
import React from "react";
import CustomTitleBar from "./components/CustomTitleBar";
import MenuBar from "./components/MenuBar";
import ToolBar from "./components/ToolBar";
import MainLayout from "./layouts/MainLayout";

const App: React.FC = () => {
  const handleNewFile = () => {
    console.log('New file created');
  };

  const handleOpenFolder = () => {
    console.log('Open folder clicked');
  };

  const handleSave = () => {
    console.log('Save clicked');
  };

  const handleUndo = () => {
    console.log('Undo clicked');
  };

  const handleRedo = () => {
    console.log('Redo clicked');
  };

  const handleRun = () => {
    console.log('Run clicked');
  };

  const handleStop = () => {
    console.log('Stop clicked');
  };

  const handleRestart = () => {
    console.log('Restart clicked');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Custom Title Bar */}
      <CustomTitleBar />

      {/* Menu Bar */}
      <MenuBar />

      {/* Tool Bar */}
      <ToolBar
        onNewFile={handleNewFile}
        onOpenFolder={handleOpenFolder}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRun={handleRun}
        onStop={handleStop}
        onRestart={handleRestart}
      />

      {/* Main Application Content */}
      <div className="flex-1 overflow-hidden">
        <MainLayout />
      </div>
    </div>
  );
};

export default App;