import React, { useState } from "react";
import CustomTitleBar from "./components/CustomTitleBar";
import MenuBar from "./components/MenuBar";
import ToolBar from "./components/ToolBar";
import MainLayout from "./layouts/MainLayout";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'main'>('login');

  const handleLogin = () => setCurrentPage('main');
  const handleLogout = () => setCurrentPage('login');

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
            onRun={() => console.log("Run")}
            onStop={() => console.log("Stop")}
            onRestart={() => console.log("Restart")}
          />
        </>
      )}
      <div className="flex-1 overflow-hidden">
        <MainLayout
          currentPage={currentPage}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default App;
