import * as React from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, Search, Clock, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export type RecentProject = {
    name: string;
    path: string;
    lastAccessed: string;
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    projects: RecentProject[];
    onOpenProject: (p: RecentProject) => void;
    onRemoveProject: (path: string) => void;
    onClearAll?: () => void;
    className?: string;
};

export default function RecentProjectsModal({
    open,
    onOpenChange,
    projects,
    onOpenProject,
    onClearAll,
    className,
}: Props) {
    const [q, setQ] = React.useState("");

    React.useEffect(() => {
        if (!open) {
            setQ("");
        }
    }, [open]);

    const filtered = React.useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return projects;
        return projects.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                p.path.toLowerCase().includes(term)
        );
    }, [q, projects]);

    const handleProjectClick = (project: RecentProject) => {
        onOpenProject(project);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "sm:max-w-2xl bg-zinc-900 border-2 border-zinc-700 text-white shadow-2xl",
                    "backdrop-blur-sm rounded-xl max-h-[70vh] flex flex-col",
                    className
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="space-y-2 pb-3">
                    <DialogTitle className="text-lg font-semibold text-white">
                        Open Recent Project
                    </DialogTitle>
                    <p className="text-xs text-zinc-400">
                        Click on any project to open it directly.
                    </p>
                </DialogHeader>

                {/* Search and Clear */}
                <div className="flex items-center gap-3 pb-3">
                    <div className="relative flex-1">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search projects by name..."
                            className={cn(
                                "pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500",
                                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0",
                                "transition-all duration-200 h-9"
                            )}
                        />
                    </div>
                    {onClearAll && projects.length > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(
                                "bg-zinc-800 text-zinc-300 border-zinc-700 h-9 px-3",
                                "hover:bg-zinc-700 hover:text-white hover:border-zinc-600",
                                "transition-colors duration-200"
                            )}
                            onClick={() => onClearAll()}
                        >
                            <Trash2 className="size-3.5 mr-1.5" />
                            Clear All
                        </Button>
                    )}
                </div>

                <Separator className="bg-zinc-700" />

                {/* Projects Grid */}
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-[280px] pr-2">
                        <div className="outline-none">
                            {filtered.length === 0 ? (
                                <div className="h-[240px] flex flex-col items-center justify-center text-center space-y-3">
                                    <div className="p-3 rounded-full bg-zinc-800">
                                        <Folder className="size-6 text-zinc-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium text-zinc-300 mb-1">
                                            {projects.length === 0 ? "No Recent Projects" : "No Projects Found"}
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            {projects.length === 0
                                                ? "Create your first project to get started"
                                                : "Try adjusting your search terms"
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 p-1">
                                    {filtered.map((p) => {
                                        return (
                                            <button
                                                key={p.path}
                                                type="button"
                                                onClick={() => handleProjectClick(p)}
                                                className={cn(
                                                    "group relative rounded-lg p-4 text-left transition-all duration-200",
                                                    "bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 border border-zinc-700/60",
                                                    "hover:from-zinc-700/70 hover:to-zinc-800/70 hover:border-zinc-600/70",
                                                    "hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20",
                                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                                                    "backdrop-blur-sm min-h-[100px]"
                                                )}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-start gap-2">
                                                        <div className="relative">
                                                            <div className={cn(
                                                                "p-2 rounded-lg transition-all duration-200",
                                                                "bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30",
                                                                "group-hover:from-blue-500/30 group-hover:to-indigo-600/30 group-hover:border-blue-400/40"
                                                            )}>
                                                                <Folder className={cn(
                                                                    "size-4 transition-all duration-200",
                                                                    "text-gray-400 group-hover:text-blue-400"
                                                                )} />
                                                            </div>
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-semibold text-white truncate mb-1 group-hover:text-blue-100 transition-colors duration-200">
                                                                {p.name}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="px-1">
                                                        <div className="text-xs text-zinc-400 truncate mb-2 group-hover:text-zinc-300 transition-colors duration-200">
                                                            {p.path}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors duration-200">
                                                                <Clock className="size-3" />
                                                                <span>{p.lastAccessed}</span>
                                                            </div>

                                                            {/* Hover indicator */}
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                                <span className="text-xs font-medium text-blue-400">Open</span>
                                                                <ExternalLink className="size-3 text-blue-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <Separator className="bg-zinc-700" />

                {/* Footer */}
                <div className="flex justify-end pt-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className={cn(
                            "bg-zinc-800 text-zinc-300 border-zinc-700 px-5",
                            "hover:bg-zinc-700 hover:text-white hover:border-zinc-600",
                            "transition-colors duration-200"
                        )}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}