import React, { useState, type JSX } from 'react';
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    ChevronRight,
    Folder,
    FileText,
    FolderOpen,
    Plus,
    Search,
    MoreHorizontal
} from 'lucide-react';

interface ProjectNode {
    name: string;
    type: 'folder' | 'file';
    children?: ProjectNode[];
    isExpanded?: boolean;
}

interface ProjectExplorerProps {
    className?: string;
    onFileClick: (fileName: string, content: JSX.Element) => void;
}

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ className, onFileClick }) => {
    const [projectTree, setProjectTree] = useState<ProjectNode[]>([
        {
            name: 'Highway_Scenario_Test',
            type: 'folder',
            isExpanded: true,
            children: [
                {
                    name: 'Critical Event Sieve',
                    type: 'folder',
                    isExpanded: false,
                    children: [
                        { name: 'Anomalies', type: 'folder' },
                        { name: 'Output', type: 'folder' },
                        { name: 'Scene Generation', type: 'folder' },
                        { name: 'Scenario Generation', type: 'folder' },
                        { name: 'DriveLab', type: 'folder' },
                        { name: 'Fault Injection', type: 'folder' },
                        { name: 'Functional Safety', type: 'folder' },
                        { name: 'Cybersecurity', type: 'folder' },
                        { name: 'Penetration Testing', type: 'folder' },
                        { name: 'Hardware in the loop (HIL)', type: 'folder' },
                        { name: 'Software in the loop (SIL)', type: 'folder' },
                        { name: 'Fleet Management', type: 'folder' },
                        { name: 'Sensor Fusion', type: 'folder' }
                    ]
                }
            ]
        }
    ]);

    const toggleFolder = (path: string[]) => {
        setProjectTree(prev => {
            const newTree = [...prev];
            let current = newTree;

            for (let i = 0; i < path.length - 1; i++) {
                const folder = current.find(item => item.name === path[i]);
                if (folder?.children) {
                    current = folder.children;
                }
            }

            const targetFolder = current.find(item => item.name === path[path.length - 1]);
            if (targetFolder && targetFolder.type === 'folder') {
                targetFolder.isExpanded = !targetFolder.isExpanded;
            }

            return newTree;
        });
    };

    const handleFileClick = (fileName: string) => {
        let content: JSX.Element;

        switch (fileName) {
            case 'Critical Event Sieve':
                content = (
                    <div className="p-4 bg-zinc-950 text-white h-full">
                        <h2 className="text-lg font-semibold mb-3 text-zinc-200">Critical Event Sieve</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="bg-zinc-900 p-3 rounded border border-zinc-800">
                                <h3 className="text-sm font-medium mb-2 text-zinc-300">Annotated Frames</h3>
                                <div className="bg-zinc-800 h-48 flex items-center justify-center rounded border border-zinc-700">
                                    <div className="text-center text-zinc-400">
                                        <FileText size={32} className="mx-auto mb-2" />
                                        <p className="text-xs">No Frames</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 bg-zinc-900 p-3 rounded border border-zinc-800">
                                <h3 className="text-sm font-medium mb-3 text-zinc-300">Extract Traffic Critical Events (TCEs)</h3>
                                <div className="space-y-3">
                                    <div className="border-2 border-dashed border-zinc-600 p-4 rounded text-center">
                                        <p className="text-xs text-zinc-400 mb-2">Upload your video to extract TCE's</p>
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                                            Upload by file
                                        </Button>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-medium text-zinc-300">Select AI Model</label>
                                        <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">
                                            <option>FlowWatch-Mini</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                break;
            default:
                content = (
                    <div className="p-4 bg-zinc-950 text-white h-full">
                        <h2 className="text-lg font-semibold mb-3 text-zinc-200">{fileName}</h2>
                        <p className="text-xs text-zinc-400">Content for {fileName} will be implemented here.</p>
                    </div>
                );
        }

        onFileClick(fileName, content);
    };

    const renderTree = (nodes: ProjectNode[], path: string[] = []): JSX.Element[] => {
        return nodes.map((node, index) => {
            const currentPath = [...path, node.name];

            return (
                <div key={index} className="select-none">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start h-6 px-2 py-1 text-xs font-normal",
                            node.type === 'folder' ? 'text-zinc-300' : 'text-zinc-400',
                            "hover:bg-zinc-800 hover:text-white transition-colors"
                        )}
                        onClick={() => {
                            if (node.type === 'folder') {
                                if (node.children) {
                                    toggleFolder(currentPath);
                                } else {
                                    handleFileClick(node.name);
                                }
                            } else {
                                handleFileClick(node.name);
                            }
                        }}
                        style={{ paddingLeft: `${path.length * 12 + 8}px` }}
                    >
                        <div className="flex items-center w-full">
                            {node.type === 'folder' && (
                                node.isExpanded ?
                                    <ChevronDown size={12} className="mr-1 flex-shrink-0" /> :
                                    <ChevronRight size={12} className="mr-1 flex-shrink-0" />
                            )}
                            {node.type === 'folder' ? (
                                node.isExpanded ?
                                    <FolderOpen size={12} className="mr-2 text-amber-500 flex-shrink-0" /> :
                                    <Folder size={12} className="mr-2 text-amber-500 flex-shrink-0" />
                            ) : (
                                <FileText size={12} className="mr-2 text-blue-400 flex-shrink-0" />
                            )}
                            <span className="truncate text-left">{node.name}</span>
                        </div>
                    </Button>

                    {node.type === 'folder' && node.isExpanded && node.children && (
                        <div>
                            {renderTree(node.children, currentPath)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <TooltipProvider>
            <div className={cn(
                "w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full",
                className
            )}>
                {/* Header */}
                <div className="p-2 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider">
                            Explorer
                        </span>
                        <div className="flex space-x-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="p-1 h-6 w-6 hover:bg-zinc-800"
                                    >
                                        <Plus size={12} className="text-zinc-400" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent 
                                    side="bottom" 
                                    className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs"
                                >
                                    New File
                                </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="p-1 h-6 w-6 hover:bg-zinc-800"
                                    >
                                        <Search size={12} className="text-zinc-400" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent 
                                    side="bottom" 
                                    className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs"
                                >
                                    Search
                                </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="p-1 h-6 w-6 hover:bg-zinc-800"
                                    >
                                        <MoreHorizontal size={12} className="text-zinc-400" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent 
                                    side="bottom" 
                                    className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs"
                                >
                                    More Actions
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Project Tree */}
                <div className="flex-1 overflow-auto p-1">
                    {renderTree(projectTree)}
                </div>
            </div>
        </TooltipProvider>
    );
};

export default ProjectExplorer;