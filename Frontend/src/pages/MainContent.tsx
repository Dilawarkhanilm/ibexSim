// Frontend/src/pages/MainContent.tsx
import React, { useEffect, type JSX } from 'react';
import Sidebar from '../components/layout/Sidebar';
import StatusBar from '../components/layout/StatusBar';
import TabsContainer from '../components/TabsContainer';
import TabContent from '../components/TabContent';
import ProjectExplorer from '../components/ProjectExplorer';
import { TabManagerProvider, useTabManager } from '../contexts/TabManagerContext';
import { Home, Activity, FileText } from 'lucide-react';

interface MainContentProps {
  onLogout: () => void;
}

// Dashboard Component - Full screen without tabs
const DashboardComponent = () => (
  <div className="p-6 bg-gray-900 text-white h-full overflow-auto">
    <div className="text-center py-8">
      <h1 className="text-3xl font-light text-white mb-2">
        ibexXcortex Dashboard
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Autonomous Vehicle Testing & Simulation Platform v1.0.4.5
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {/* Start Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-white font-medium text-lg mb-4">Start</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>New Project</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+N</span>
          </div>
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Open Project</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+O</span>
          </div>
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Open Folder</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+K</span>
          </div>
          <div className="text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Clone Repository</span>
          </div>
        </div>
      </div>

      {/* Testing Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-white font-medium text-lg mb-4">Testing</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>New Simulation</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+S</span>
          </div>
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Quick Test</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+T</span>
          </div>
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Scenario Builder</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+B</span>
          </div>
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Batch Processing</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Shift+Ctrl+P</span>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-white font-medium text-lg mb-4">Tools</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Settings</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+,</span>
          </div>
          <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>Keyboard Shortcuts</span>
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+K</span>
          </div>
          <div className="text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span>User Snippets</span>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Projects */}
    <div className="mt-12">
      <h2 className="text-white text-xl font-medium mb-6">Recents</h2>
      <div className="space-y-3">
        {[
          'Highway_Scenario_Test',
          'Urban_Navigation_Sim',
        ].map((project, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800/30 p-3 rounded-lg cursor-pointer transition-colors"
          >
            <div className="w-4 h-4 bg-yellow-500 rounded-sm flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {project}
              </div>
              <div className="text-xs text-gray-500 truncate">
                C:\\Users\\Developer\\Desktop\\Scenarios.test
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MainContentInner: React.FC<MainContentProps> = () => {
  const { tabList, activeTab, addTab, removeTab, setActiveTab, clearAllTabs } = useTabManager();
  const [showProjectExplorer, setShowProjectExplorer] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'tabs'>('dashboard');

  // Initialize with Dashboard view (no tabs)
  useEffect(() => {
    setCurrentView('dashboard');
  }, []);

  // Handle navigation from sidebar clicks
  const handleNavigateToTab = (tabName: string, component: JSX.Element, icon?: JSX.Element) => {
    if (tabName === 'Dashboard') {
      // Switch to dashboard view (no tabs)
      setCurrentView('dashboard');
      clearAllTabs();
      return;
    }

    // Switch to tabs view for all other pages
    setCurrentView('tabs');

    // Check if tab already exists
    const existingTab = tabList.find(tab => tab.name === tabName);

    if (existingTab) {
      // If tab exists, just switch to it
      setActiveTab(tabName);
    } else {
      // If tab doesn't exist, create it and switch to it
      addTab({
        name: tabName,
        component,
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

    switch (fileName) {
      case 'Critical Event Sieve':
        icon = <Activity size={16} />;
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
        component: content,
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
        setCurrentView('dashboard');
      }, 100);
    }
  };

  // Dashboard View - Full screen without tabs or project explorer
  if (currentView === 'dashboard') {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            onNavigateToTab={handleNavigateToTab}
            onToggleExplorer={handleToggleExplorer}
            isExplorerOpen={false} // Force closed for dashboard
          />

          {/* Dashboard Content - Full width */}
          <div className="flex-1 overflow-hidden">
            <DashboardComponent />
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar />
      </div>
    );
  }

  // Tabs View - Show tabs, project explorer, and tab content
  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onNavigateToTab={handleNavigateToTab}
          onToggleExplorer={handleToggleExplorer}
          isExplorerOpen={showProjectExplorer}
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
          <div className="flex-1 overflow-hidden">
            {tabList.length > 0 ? (
              <TabContent
                tabs={tabList}
                activeTab={activeTab}
              />
            ) : (
              // Empty state when no tabs
              <div className="flex-1 flex items-center justify-center text-white">
                <div className="text-center">
                  <Home size={48} className="mx-auto mb-4 text-gray-500" />
                  <h2 className="text-xl font-semibold mb-2">No tabs open</h2>
                  <p className="text-gray-400">Click on sidebar items or project files to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

const MainContent: React.FC<MainContentProps> = ({ onLogout }) => {
  return (
    <TabManagerProvider>
      <MainContentInner onLogout={onLogout} />
    </TabManagerProvider>
  );
};

export default MainContent;