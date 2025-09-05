import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    FileText,
    FolderOpen,
    GitBranch,
    Play,
    Zap,
    Settings,
    Keyboard,
    FileCode,
    Clock,
    Folder
} from 'lucide-react';

interface DashboardProps {
    className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
    const startItems = [
        {
            label: 'New Project',
            shortcut: 'Ctrl+Shift+N',
            icon: FileText,
            onClick: () => console.log('New Project')
        },
        {
            label: 'Open Project',
            shortcut: 'Ctrl+O',
            icon: FolderOpen,
            onClick: () => console.log('Open Project')
        },
        {
            label: 'Open Folder',
            shortcut: 'Ctrl+K',
            icon: Folder,
            onClick: () => console.log('Open Folder')
        },
        {
            label: 'Clone Repository',
            icon: GitBranch,
            onClick: () => console.log('Clone Repository')
        }
    ];

    const testingItems = [
        {
            label: 'New Simulation',
            shortcut: 'Ctrl+Shift+S',
            icon: Play,
            onClick: () => console.log('New Simulation')
        },
        {
            label: 'Quick Test',
            shortcut: 'Ctrl+T',
            icon: Zap,
            onClick: () => console.log('Quick Test')
        },
        {
            label: 'Scenario Builder',
            shortcut: 'Ctrl+Shift+B',
            icon: FileCode,
            onClick: () => console.log('Scenario Builder')
        },
        {
            label: 'Batch Processing',
            shortcut: 'Shift+Ctrl+P',
            icon: Settings,
            onClick: () => console.log('Batch Processing')
        }
    ];

    const toolItems = [
        {
            label: 'Settings',
            shortcut: 'Ctrl+,',
            icon: Settings,
            onClick: () => console.log('Settings')
        },
        {
            label: 'Keyboard Shortcuts',
            shortcut: 'Ctrl+K',
            icon: Keyboard,
            onClick: () => console.log('Keyboard Shortcuts')
        },
        {
            label: 'User Snippets',
            icon: FileCode,
            onClick: () => console.log('User Snippets')
        }
    ];

    const recentProjects = [
        {
            name: 'Highway_Scenario_Test',
            path: 'C:\\Users\\Developer\\Desktop\\Scenarios.test',
            lastAccessed: '2 hours ago'
        },
        {
            name: 'Urban_Navigation_Sim',
            path: 'C:\\Users\\Developer\\Desktop\\Scenarios.test',
            lastAccessed: '1 day ago'
        },

    ];

    const renderActionCard = (title: string, items: any[]) => (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-200">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-between h-8 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
                        onClick={item.onClick}
                    >
                        <div className="flex items-center gap-2">
                            <item.icon size={12} />
                            <span>{item.label}</span>
                        </div>
                        {item.shortcut && (
                            <Badge variant="secondary" className="h-5 px-2 text-[10px] bg-zinc-800 text-zinc-500 border-zinc-700">
                                {item.shortcut}
                            </Badge>
                        )}
                    </Button>
                ))}
            </CardContent>
        </Card>
    );

    return (
        <div className={cn(
            "p-4 bg-zinc-950 text-white h-full overflow-auto",
            className
        )}>
            {/* Header */}
            <div className="text-center py-6 mb-6">
                <h1 className="text-xl font-light text-white mb-1">
                    ibexXcortex Dashboard
                </h1>
                <p className="text-zinc-500 text-xs">
                    Autonomous Vehicle Testing & Simulation Platform v1.0.4.5
                </p>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {renderActionCard('Start', startItems)}
                {renderActionCard('Testing', testingItems)}
                {renderActionCard('Tools', toolItems)}
            </div>

            {/* Recent Projects */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                        <Clock size={14} />
                        Recent Projects
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {recentProjects.map((project, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start h-12 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-3 h-3 bg-amber-500 rounded-sm flex-shrink-0"></div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="font-medium text-xs truncate text-zinc-300">
                                        {project.name}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 truncate">
                                        {project.path}
                                    </div>
                                </div>
                                <div className="text-[10px] text-zinc-600 flex-shrink-0">
                                    {project.lastAccessed}
                                </div>
                            </div>
                        </Button>
                    ))}

                    {recentProjects.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-zinc-500 text-xs">No recent projects</p>
                        </div>
                    )}
                </CardContent>
            </Card>


        </div>
    );
};

export default Dashboard;