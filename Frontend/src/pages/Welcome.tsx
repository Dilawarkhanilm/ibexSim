// src/components/Dashboard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText, FolderOpen, Play, Zap, Settings, Keyboard, FileCode, Clock, Folder, Home } from "lucide-react";
import CreateNewProjectModal, { type CreateProjectPayload } from "@/components/modals/CreateNewProjectModal";
import RecentProjectsModal, { type RecentProject } from "@/components/modals/RecentProjectsModal";
import Dashboard from "@/pages/Dashboard";

interface WelcomeProps {
    className?: string;
    onNavigateToTab?: (tabName: string, component: React.JSX.Element, icon?: React.JSX.Element) => void;
}
type Recent = RecentProject;

const Welcome: React.FC<WelcomeProps> = ({ className, onNavigateToTab }) => {
    const [openCreate, setOpenCreate] = React.useState(false);
    const [openRecent, setOpenRecent] = React.useState(false);

    // Store all projects (not limited)
    const [allProjects, setAllProjects] = React.useState<Recent[]>(() => {
        const saved = localStorage.getItem("cortex.allProjects");
        if (saved) return JSON.parse(saved);
        return [
            { name: "Highway_Scenario_Test", path: "C:\\Users\\Developer\\Desktop\\Scenarios.test", lastAccessed: "2 hours ago" },
            { name: "Urban_Navigation_Sim", path: "C:\\Users\\Developer\\Desktop\\Scenarios.test", lastAccessed: "1 day ago" },
            { name: "Traffic_Light_Detection", path: "C:\\Users\\Developer\\Projects\\TrafficAI", lastAccessed: "3 days ago" },
            { name: "Parking_Assistant_AI", path: "C:\\Users\\Developer\\Projects\\ParkingAI", lastAccessed: "5 days ago" },
            { name: "Lane_Detection_Model", path: "C:\\Users\\Developer\\Projects\\LaneAI", lastAccessed: "1 week ago" },
            { name: "Collision_Avoidance", path: "C:\\Users\\Developer\\Projects\\CollisionAI", lastAccessed: "2 weeks ago" },
        ];
    });

    // Get only the latest 3 projects for dashboard display
    const recentProjects = React.useMemo(() => allProjects.slice(0, 3), [allProjects]);

    React.useEffect(() => {
        localStorage.setItem("cortex.allProjects", JSON.stringify(allProjects));
    }, [allProjects]);

    // keyboard: Ctrl+Shift+N and Ctrl+O
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const isAccel = e.ctrlKey || e.metaKey;
            if (isAccel && e.shiftKey && e.key.toLowerCase() === "n") {
                e.preventDefault();
                setOpenCreate(true);
                return;
            }
            if (isAccel && !e.shiftKey && e.key.toLowerCase() === "o") {
                e.preventDefault();
                setOpenRecent(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const handleCreate = (p: CreateProjectPayload) => {
        // @ts-expect-error provided by preload if wired
        window.cortex?.createWorkspace?.(p).catch(() => { });

        const newProject: Recent = {
            name: p.name,
            path: p.directory || "",
            lastAccessed: "just now"
        };

        // Add to all projects and move to top
        setAllProjects((prev) =>
            [newProject, ...prev.filter(project => project.path !== newProject.path)]
        );

        // Navigate to Welcome page after project creation
        if (onNavigateToTab) {
            const DashboardComponent = <Dashboard />;

            setTimeout(() => {
                onNavigateToTab("Dashboard", DashboardComponent, <Home size={16} />);
            }, 100);
        }
    };

    const openProject = (p: Recent) => {
        // call into Electron or router here
        // @ts-expect-error optional preload
        window.cortex?.openWorkspace?.(p).catch(() => { });

        // Move project to top of all projects list
        setAllProjects((prev) => {
            const rest = prev.filter((x) => x.path !== p.path);
            return [{ ...p, lastAccessed: "just now" }, ...rest];
        });
        setOpenRecent(false);

        // Navigate to Welcome page after opening project
        if (onNavigateToTab) {
            const DashboardComponent = <Dashboard />;

            // Small delay to ensure smooth transition
            setTimeout(() => {
                onNavigateToTab("Dashboard", DashboardComponent, <Home size={16} />);
            }, 100);
        }
    };

    const removeFromRecent = (path: string) => {
        setAllProjects((prev) => prev.filter((p) => p.path !== path));
    };

    const clearAllRecent = () => {
        setAllProjects([]);
    };

    const startItems = [
        { label: "New Project", shortcut: "Ctrl+Shift+N", icon: FileText, onClick: () => setOpenCreate(true) },
        { label: "Open Project", shortcut: "Ctrl+O", icon: FolderOpen, onClick: () => setOpenRecent(true) },
        { label: "Open Folder", shortcut: "Ctrl+K", icon: Folder, onClick: () => console.log("Open Folder") },
    ];

    const testingItems = [
        { label: "New Simulation", shortcut: "Ctrl+Shift+S", icon: Play, onClick: () => console.log("New Simulation") },
        { label: "Quick Test", shortcut: "Ctrl+T", icon: Zap, onClick: () => console.log("Quick Test") },
        { label: "Scenario Builder", shortcut: "Ctrl+Shift+B", icon: FileCode, onClick: () => console.log("Scenario Builder") },
        { label: "Batch Processing", shortcut: "Shift+Ctrl+P", icon: Settings, onClick: () => console.log("Batch Processing") },
    ];

    const toolItems = [
        { label: "Settings", shortcut: "Ctrl+,", icon: Settings, onClick: () => console.log("Settings") },
        { label: "Keyboard Shortcuts", shortcut: "Ctrl+K", icon: Keyboard, onClick: () => console.log("Keyboard Shortcuts") },
    ];

    const renderActionCard = (title: string, items: any[]) => (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-200">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.map((item: any, index: number) => (
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
        <div className={cn("p-4 bg-zinc-950 text-white h-full overflow-auto", className)}>
            {/* Header */}
            <div className="text-center py-6 mb-3">
                <h1 className="text-xl font-light text-white mb-1">ibeXcortex Dashboard</h1>
                <p className="text-zinc-500 text-xs">Autonomous Vehicle Testing & Simulation Platform v1.0.4.5</p>
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {renderActionCard("Start", startItems)}
                {renderActionCard("Testing", testingItems)}
                {renderActionCard("Tools", toolItems)}
            </div>

            {/* Recent card - showing only latest 3 projects */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                        <Clock size={14} />
                        Recent Projects
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800"
                        onClick={() => setOpenRecent(true)}
                    >
                        View all
                    </Button>
                </CardHeader>
                <CardContent className="space-y-1">
                    {recentProjects.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-zinc-500 text-xs">No recent projects</p>
                        </div>
                    )}
                    {recentProjects.map((project, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start h-12 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
                            onClick={() => openProject(project)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-3 h-3 bg-amber-500 rounded-sm flex-shrink-0" />
                                <div className="flex-1 text-left min-w-0">
                                    <div className="font-medium text-xs truncate text-zinc-300">{project.name}</div>
                                </div>
                                <div className="text-[10px] text-zinc-600 flex-shrink-0">{project.lastAccessed}</div>
                            </div>
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {/* Modals */}
            <CreateNewProjectModal open={openCreate} onOpenChange={setOpenCreate} onCreate={handleCreate} />

            {/* Pass all projects to the modal */}
            <RecentProjectsModal
                open={openRecent}
                onOpenChange={setOpenRecent}
                projects={allProjects}
                onOpenProject={openProject}
                onRemoveProject={removeFromRecent}
                onClearAll={clearAllRecent}
            />
        </div>
    );
};

export default Welcome;