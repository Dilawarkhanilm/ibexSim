// Frontend/src/components/layout/Sidebar.tsx
import React, { type JSX } from 'react';
import {
    Home,
    FolderOpen,
    Search,
    GitBranch,
    Bug,
    Shield,
    Puzzle,
    User,
    Activity,
    Zap,
    Car,
    FileText,
    Settings
} from 'lucide-react';
import CriticalEventSieve from '../../pages/ces/CriticalEventSieve';
import Dashboard from '../../pages/Dashboard';
import SceneGeneration from '../../pages/SceneGeneration';
import ScenarioGeneration from '../../pages/ScenarioGeneration';
import DriveLab from '../../pages/DriveLab';
import FileViewer from '../../pages/FileViewer';
import Profile from '../../pages/Profile';
import SettingsPage from '../../pages/SettingsPage';

interface SidebarProps {
    onNavigateToTab: (tabName: string, component: JSX.Element, icon?: JSX.Element) => void;
    onToggleExplorer: () => void;
    isExplorerOpen: boolean;
}
















const Sidebar: React.FC<SidebarProps> = ({ onNavigateToTab, onToggleExplorer, isExplorerOpen }) => {
    const navigationItems = [
        {
            name: 'Dashboard',
            icon: Home,
            component: <Dashboard />
        },
        {
            name: 'Critical Event Sieve',
            icon: Activity,
            component: <CriticalEventSieve />
        },
        {
            name: 'Scene Generation',
            icon: Zap,
            component: <SceneGeneration />
        },
        {
            name: 'Scenario Generation',
            icon: GitBranch,
            component: <ScenarioGeneration />
        },
        {
            name: 'Drive Lab',
            icon: Car,
            component: <DriveLab />
        },
        {
            name: 'File Viewer',
            icon: FileText,
            component: <FileViewer />
        },
    ];

    const toolItems = [
        { name: 'Search', icon: Search },
        { name: 'Source Control', icon: GitBranch },
        { name: 'Run and Debug', icon: Bug },
        { name: 'Testing', icon: Shield },
        { name: 'Extensions', icon: Puzzle },
    ];

    const bottomItems = [
        {
            name: 'Settings',
            icon: Settings,
            component: <SettingsPage />
        },
        {
            name: 'Profile',
            icon: User,
            component: <Profile />
        },
    ];

    type SidebarNavItem = {
        name: string;
        icon: React.ElementType;
        component?: JSX.Element;
    };

    const handleItemClick = (item: SidebarNavItem) => {
        if (item.component) {
            onNavigateToTab(item.name, item.component, <item.icon size={16} />);
        }
    };

    return (
        <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2">
            {/* Project Explorer */}
            <div className="mb-4">
                <button
                    onClick={onToggleExplorer}
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isExplorerOpen
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    title={isExplorerOpen ? "Close Explorer" : "Open Explorer"}
                >
                    <FolderOpen size={16} />
                </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col space-y-1 mb-4">
                {navigationItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleItemClick(item)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        title={item.name}
                    >
                        <item.icon size={16} />
                    </button>
                ))}
            </div>

            {/* Tool Items */}
            <div className="flex flex-col space-y-1 flex-1">
                {toolItems.map((item, index) => (
                    <button
                        key={index}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-gray-400"
                        title={item.name}
                    >
                        <item.icon size={16} />
                    </button>
                ))}
            </div>

            {/* Bottom Items */}
            <div className="flex flex-col space-y-1 mt-4">
                {bottomItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleItemClick(item)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        title={item.name}
                    >
                        <item.icon size={16} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;