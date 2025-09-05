import React, { useEffect, type JSX } from 'react';
import Sidebar from '../components/layout/Sidebar';
import StatusBar from '../components/layout/StatusBar';
import TabsContainer from '../components/TabsContainer';
import TabContent from '../components/TabContent';
import ProjectExplorer from '../components/ProjectExplorer';
import { TabManagerProvider, useTabManager } from '../contexts/TabManagerContext';
import { Home, Activity, FileText } from 'lucide-react';
import Dashboard from './Dashboard';
import Profile from './Profile';

interface MainContentProps {
  onLogout: () => void;
}

const MainContentInner: React.FC<MainContentProps> = ({ onLogout }) => {
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
      // Create component with logout prop if it's Profile
      let finalComponent = component;
      if (tabName === 'Profile') {
        finalComponent = <Profile onLogout={onLogout} />;
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
      <div className="h-full flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            onNavigateToTab={handleNavigateToTab}
            onToggleExplorer={handleToggleExplorer}
            isExplorerOpen={false} // Force closed for dashboard
            activeTab="Dashboard"
          />

          {/* Dashboard Content - Full width */}
          <div className="flex-1 overflow-hidden">
            <Dashboard />
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar />
      </div>
    );
  }

  // Tabs View - Show tabs, project explorer, and tab content
  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onNavigateToTab={handleNavigateToTab}
          onToggleExplorer={handleToggleExplorer}
          isExplorerOpen={showProjectExplorer}
          activeTab={activeTab || undefined}
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