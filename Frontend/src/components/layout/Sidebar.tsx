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
    Settings,
    User,
    Activity,
    Zap,
    Car,
    FileText,
} from 'lucide-react';
import CriticalEventSieve from '../../pages/ces/CriticalEventSieve';

interface SidebarProps {
    onNavigateToTab: (tabName: string, component: JSX.Element, icon?: JSX.Element) => void;
    onToggleExplorer: () => void;
    isExplorerOpen: boolean;
}

// Dashboard Component
const DashboardComponent = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
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

 

// Scene Generation Component
const SceneGenerationComponent = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Scene Generation</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generate Virtual Scenes</h3>
            <p className="text-gray-400 mb-4">Create realistic driving scenarios for testing.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Weather Conditions</h4>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2">
                        <option>Clear</option>
                        <option>Rain</option>
                        <option>Snow</option>
                        <option>Fog</option>
                    </select>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Time of Day</h4>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2">
                        <option>Day</option>
                        <option>Night</option>
                        <option>Dawn</option>
                        <option>Dusk</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
);

// Scenario Generation Component
const ScenarioGenerationComponent = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Scenario Generation</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Automated Scenario Builder</h3>
            <p className="text-gray-400 mb-4">Generate complex testing scenarios automatically.</p>
            <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Scenario Type</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="bg-blue-600 px-4 py-2 rounded text-sm">Highway</button>
                        <button className="bg-gray-600 px-4 py-2 rounded text-sm">Urban</button>
                        <button className="bg-gray-600 px-4 py-2 rounded text-sm">Parking</button>
                        <button className="bg-gray-600 px-4 py-2 rounded text-sm">Emergency</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Drive Lab Component
const DriveLabComponent = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Drive Lab</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Autonomous Vehicle Testing Lab</h3>
            <p className="text-gray-400 mb-4">Advanced testing environment for autonomous vehicles.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Vehicle Configuration</h4>
                    <div className="space-y-2">
                        <input className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2" placeholder="Vehicle Model" />
                        <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2">
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Truck</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Sensor Setup</h4>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span>LiDAR</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span>Camera</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Radar</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// File Viewer Component
const FileViewerComponent = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">File Viewer</h2>
        <div className="bg-gray-800 rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Project Files</h3>
                <button className="bg-blue-600 px-4 py-2 rounded text-sm">Upload File</button>
            </div>
            <div className="bg-gray-700 rounded p-4 h-96">
                <div className="text-center text-gray-400 mt-32">
                    <FileText size={48} className="mx-auto mb-2" />
                    <p>No files selected</p>
                    <p className="text-sm">Select a file to view its contents</p>
                </div>
            </div>
        </div>
    </div>
);

// Settings Component
const SettingsComponent = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">General</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Theme</label>
                        <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2">
                            <option>Dark</option>
                            <option>Light</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2">
                            <option>English</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Profile Component
const ProfileComponent = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Developer</h3>
                    <p className="text-gray-400">demo@ibexvision.ai</p>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" defaultValue="Developer" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" defaultValue="demo@ibexvision.ai" />
                </div>
            </div>
        </div>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ onNavigateToTab, onToggleExplorer, isExplorerOpen }) => {
    const navigationItems = [
        {
            name: 'Dashboard',
            icon: Home,
            component: <DashboardComponent />
        },
        {
            name: 'Critical Event Sieve',
            icon: Activity,
            component: <CriticalEventSieve />
        },
        {
            name: 'Scene Generation',
            icon: Zap,
            component: <SceneGenerationComponent />
        },
        {
            name: 'Scenario Generation',
            icon: GitBranch,
            component: <ScenarioGenerationComponent />
        },
        {
            name: 'Drive Lab',
            icon: Car,
            component: <DriveLabComponent />
        },
        {
            name: 'File Viewer',
            icon: FileText,
            component: <FileViewerComponent />
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
            component: <SettingsComponent />
        },
        {
            name: 'Profile',
            icon: User,
            component: <ProfileComponent />
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