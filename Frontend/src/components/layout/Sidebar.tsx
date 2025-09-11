import React, { type JSX } from 'react';
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
import Dashboard from '../../pages/Welcome';
import SceneGeneration from '../../pages/scenegeneration/SceneGeneration';
import ScenarioGeneration from '../../pages/scenariogeneration/ScenarioGeneration';
import DriveLab from '../../pages/DriveLab';
import FileViewer from '../../pages/FileViewer';
import Profile from '../../pages/Profile';
import SettingsPage from '../../pages/SettingsPage';
 
interface SidebarProps {
    className?: string;
    onNavigateToTab: (tabName: string, component: JSX.Element, icon?: JSX.Element) => void;
    onToggleExplorer: () => void;
    isExplorerOpen: boolean;
    activeTab?: string;
    onLogout?: () => void;
}

type SidebarNavItem = {
    name: string;
    icon: React.ElementType;
    component?: JSX.Element | (() => JSX.Element);
};

const Sidebar: React.FC<SidebarProps> = ({
    className,
    onNavigateToTab,
    onToggleExplorer,
    isExplorerOpen,
    activeTab,
    onLogout
}) => {
    const navigationItems: SidebarNavItem[] = [
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

    const toolItems: SidebarNavItem[] = [
        { name: 'Search', icon: Search },
        { name: 'Source Control', icon: GitBranch },
        { name: 'Run and Debug', icon: Bug },
        { name: 'Testing', icon: Shield },
        { name: 'Extensions', icon: Puzzle },
    ];

    const bottomItems: SidebarNavItem[] = [
        {
            name: 'Settings',
            icon: Settings,
            component: <SettingsPage />
        },
        {
            name: 'Profile',
            icon: User,
            component: () => <Profile onLogout={onLogout} />
        },
    ];

    const handleItemClick = (item: SidebarNavItem) => {
        if (item.component) {
            const component = typeof item.component === 'function' ? item.component() : item.component;
            onNavigateToTab(item.name, component, <item.icon size={16} />);
        }
    };

    const isActive = (itemName: string) => activeTab === itemName;

    const renderSidebarButton = (
        item: SidebarNavItem,
        onClick?: () => void,
        isActiveItem?: boolean
    ) => (
        <Tooltip key={item.name}>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "w-8 h-8 p-0 rounded-md transition-all duration-200",
                        isActiveItem
                            ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                        "hover:scale-105"
                    )}
                    onClick={onClick}
                >
                    <item.icon size={16} />
                </Button>
            </TooltipTrigger>
            <TooltipContent
                side="right"
                className="bg-zinc-900 border-zinc-700 text-zinc-200"
                sideOffset={8}
            >
                {item.name}
            </TooltipContent>
        </Tooltip>
    );

    return (
        <TooltipProvider delayDuration={300}>
            <div className={cn(
                "w-12 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-3",
                className
            )}>
                {/* Project Explorer */}
                <div className="mb-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "w-8 h-8 p-0 rounded-md transition-all duration-200",
                                    isExplorerOpen
                                        ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                                    "hover:scale-105"
                                )}
                                onClick={onToggleExplorer}
                            >
                                <FolderOpen size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            className="bg-zinc-900 border-zinc-700 text-zinc-200"
                            sideOffset={8}
                        >
                            {isExplorerOpen ? "Close Explorer" : "Open Explorer"}
                        </TooltipContent>
                    </Tooltip>
                </div>

                <Separator className="w-6 bg-zinc-700 mb-3" />

                {/* Navigation Items */}
                <div className="flex flex-col space-y-1 mb-3">
                    {navigationItems.map((item) =>
                        renderSidebarButton(
                            item,
                            () => handleItemClick(item),
                            isActive(item.name)
                        )
                    )}
                </div>

                <Separator className="w-6 bg-zinc-700 mb-3" />

                {/* Tool Items */}
                <div className="flex flex-col space-y-1 flex-1">
                    {toolItems.map((item) =>
                        renderSidebarButton(item)
                    )}
                </div>

                <Separator className="w-6 bg-zinc-700 mb-3" />

                {/* Bottom Items */}
                <div className="flex flex-col space-y-1">
                    {bottomItems.map((item) =>
                        renderSidebarButton(
                            item,
                            () => handleItemClick(item),
                            isActive(item.name)
                        )
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
};

export default Sidebar;