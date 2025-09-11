import React, { useEffect, type JSX } from 'react';
import Sidebar from '../components/layout/Sidebar';
import StatusBar from '../components/layout/StatusBar';
import TabsContainer from '../components/TabsContainer';
import TabContent from '../components/TabContent';
import ProjectExplorer from '../components/ProjectExplorer';
import { TabManagerProvider, useTabManager } from '../contexts/TabManagerContext';
import { Home, Activity, FileText } from 'lucide-react';
import Welcome from './Welcome';
import Profile from './Profile';
import CriticalEventSieve from './ces/CriticalEventSieve';

interface VideoFile {
  id: string;
  file: File;
  name: string;
  size: number;
  duration?: number;
}

interface MainContentProps {
  onLogout: () => void;
  onVideoPlayStateChange?: (isPlaying: boolean) => void;
  onVideoUpload?: (videos: VideoFile[]) => void;
  onFiltersChange?: (filters: string[]) => void;
  onRegisterVideoControls?: (controls: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
  }) => void;
  isVideoPlaying?: boolean;
  selectedFilters?: string[];
}

const MainContentInner: React.FC<MainContentProps> = ({ 
  onLogout,
  onVideoPlayStateChange,
  onVideoUpload,
  onFiltersChange,
  onRegisterVideoControls,
  isVideoPlaying = false,
  selectedFilters = ['All']
}) => {
  const { tabList, activeTab, addTab, removeTab, setActiveTab, clearAllTabs } = useTabManager();
  const [showProjectExplorer, setShowProjectExplorer] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<'Welcome' | 'tabs'>('Welcome');

  // Initialize with Dashboard view (no tabs)
  useEffect(() => {
    setCurrentView('Welcome');
  }, []);

  // Handle navigation from sidebar clicks
  const handleNavigateToTab = (tabName: string, component: JSX.Element, icon?: JSX.Element) => {
    if (tabName === 'Welcome') {
      setCurrentView('Welcome');
      clearAllTabs();
      setShowProjectExplorer(false); // Explorer off on Welcome
      return;
    }

    setShowProjectExplorer(true); // Explorer auto-open on Dashboard or any other tab

    // Switch to tabs view for all other pages
    setCurrentView('tabs');

    // Check if tab already exists
    const existingTab = tabList.find(tab => tab.name === tabName);

    if (existingTab) {
      // If tab exists, just switch to it
      setActiveTab(tabName);
    } else {
      // Create component with appropriate props
      let finalComponent = component;
      
      if (tabName === 'Profile') {
        finalComponent = <Profile onLogout={onLogout} />;
      } else if (tabName === 'Critical Event Sieve') {
        finalComponent = (
          <CriticalEventSieve
            onVideoPlayStateChange={onVideoPlayStateChange}
            onVideoUpload={onVideoUpload}
            onRegisterVideoControls={onRegisterVideoControls}
          />
        );
      }

      // If tab doesn't exist, create it and switch to it
      addTab({
        name: tabName,
        component: finalComponent,
        icon
      });
      setActiveTab(tabName);
    }
  };

  // Handle explorer toggle from sidebar
  const handleToggleExplorer = () => {
    setShowProjectExplorer(prev => !prev);
  };

  // Handle file clicks from project explorer
  const handleFileClick = (fileName: string, content: JSX.Element) => {
    // Switch to tabs view when opening files
    setCurrentView('tabs');

    let icon: JSX.Element;
    let finalContent = content;

    switch (fileName) {
      case 'Critical Event Sieve':
        icon = <Activity size={16} />;
        // Override content with video-enabled component
        finalContent = (
          <CriticalEventSieve
            onVideoPlayStateChange={onVideoPlayStateChange}
            onVideoUpload={onVideoUpload}
            onRegisterVideoControls={onRegisterVideoControls}
          />
        );
        break;
      default:
        icon = <FileText size={16} />;
    }

    // Check if tab already exists
    const existingTab = tabList.find(tab => tab.name === fileName);

    if (existingTab) {
      // If tab exists, just switch to it
      setActiveTab(fileName);
    } else {
      // If tab doesn't exist, create it and switch to it
      addTab({
        name: fileName,
        component: finalContent,
        icon
      });
      setActiveTab(fileName);
    }
  };

  // Handle tab closing
  const handleCloseTab = (tabName: string) => {
    removeTab(tabName);

    // If we're closing the last tab, switch back to dashboard
    if (tabList.length === 1) {
      setTimeout(() => {
        setCurrentView('Welcome');
      }, 100);
    }
  };

  // Dashboard View - Full screen without tabs or project explorer
  if (currentView === 'Welcome') {
    return (
      <div className="h-full flex flex-col relative">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            onNavigateToTab={handleNavigateToTab}
            onToggleExplorer={handleToggleExplorer}
            isExplorerOpen={false}
            activeTab="Welcome"
          />

          {/* Welcome screen content */}
          <div className="flex-1 overflow-hidden">
            <Welcome onNavigateToTab={handleNavigateToTab} />
          </div>
        </div>

        <StatusBar 
          isVideoPlaying={isVideoPlaying}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  }

  // Tabs View - Show tabs, project explorer, and tab content
  return (
    <div className="h-full flex flex-col bg-zinc-950 relative">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onNavigateToTab={handleNavigateToTab}
          onToggleExplorer={handleToggleExplorer}
          isExplorerOpen={showProjectExplorer}
          activeTab={activeTab ?? undefined}
        />

        {/* Project Explorer - with smooth transition */}
        <div className={`transition-all duration-300 ease-in-out ${showProjectExplorer ? 'w-60' : 'w-0'} overflow-hidden`}>
          <ProjectExplorer onFileClick={handleFileClick} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs - Only show when not on dashboard */}
          {tabList.length > 0 && (
            <TabsContainer
              tabs={tabList}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onCloseTab={handleCloseTab}
            />
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden overflow-y-auto">
            {tabList.length > 0 ? (
              <TabContent
                tabs={tabList}
                activeTab={activeTab}
              />
            ) : (
              // Empty state when no tabs
              <div className="flex-1 flex items-center justify-center text-white">
                <div className="text-center">
                  <Home size={48} className="mx-auto mb-4 text-zinc-500" />
                  <h2 className="text-xl font-semibold mb-2 text-zinc-200">No tabs open</h2>
                  <p className="text-zinc-400 text-sm">Click on sidebar items or project files to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar 
        isVideoPlaying={isVideoPlaying}
        selectedFilters={selectedFilters}
      />
    </div>
  );
};

const MainContent: React.FC<MainContentProps> = ({ 
  onLogout,
  onVideoPlayStateChange,
  onVideoUpload,
  onFiltersChange,
  onRegisterVideoControls,
  isVideoPlaying,
  selectedFilters
}) => {
  return (
    <TabManagerProvider>
      <MainContentInner 
        onLogout={onLogout}
        onVideoPlayStateChange={onVideoPlayStateChange}
        onVideoUpload={onVideoUpload}
        onFiltersChange={onFiltersChange}
        onRegisterVideoControls={onRegisterVideoControls}
        isVideoPlaying={isVideoPlaying}
        selectedFilters={selectedFilters}
      />
    </TabManagerProvider>
  );
};

export default MainContent;