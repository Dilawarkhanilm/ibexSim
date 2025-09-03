// Frontend/src/components/ProjectExplorer.tsx
import React, { useState, type JSX } from 'react';
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
    onFileClick: (fileName: string, content: JSX.Element) => void;
}

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ onFileClick }) => {
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
        // Create different content based on file name
        let content: JSX.Element;

        switch (fileName) {
            case 'Critical Event Sieve':
                content = (
                    <div className="p-6 bg-gray-900 text-white h-full">
                        <h2 className="text-xl font-bold mb-4">Critical Event Sieve</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-800 p-4 rounded">
                                <h3 className="font-semibold mb-2">Annotated Frames</h3>
                                <div className="bg-gray-700 h-64 flex items-center justify-center rounded">
                                    <div className="text-center text-gray-400">
                                        <FileText size={48} className="mx-auto mb-2" />
                                        <p>No Frames</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 bg-gray-800 p-4 rounded">
                                <h3 className="font-semibold mb-4">Extract Traffic Critical Events (TCEs)</h3>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-600 p-8 rounded text-center">
                                        <p className="text-gray-400 mb-2">Upload your video to extract TCE's</p>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                            Upload by file
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Select AI Model</label>
                                        <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
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
                    <div className="p-6 bg-gray-900 text-white h-full">
                        <h2 className="text-xl font-bold mb-4">{fileName}</h2>
                        <p className="text-gray-400">Content for {fileName} will be implemented here.</p>
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
                    <div
                        className={`flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm ${node.type === 'folder' ? 'text-gray-300' : 'text-gray-400'
                            }`}
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
                        style={{ paddingLeft: `${path.length * 16 + 8}px` }}
                    >
                        {node.type === 'folder' && (
                            node.isExpanded ?
                                <ChevronDown size={14} className="mr-1" /> :
                                <ChevronRight size={14} className="mr-1" />
                        )}
                        {node.type === 'folder' ? (
                            node.isExpanded ?
                                <FolderOpen size={14} className="mr-2 text-yellow-500" /> :
                                <Folder size={14} className="mr-2 text-yellow-500" />
                        ) : (
                            <FileText size={14} className="mr-2 text-blue-400" />
                        )}
                        <span className="truncate">{node.name}</span>
                    </div>

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
        <div className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
            {/* Header */}
            <div className="p-2 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 uppercase font-medium">Explorer</span>
                    <div className="flex space-x-1">
                        <button className="p-1 hover:bg-gray-700 rounded">
                            <Plus size={14} className="text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded">
                            <Search size={14} className="text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded">
                            <MoreHorizontal size={14} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Project Tree */}
            <div className="flex-1 overflow-auto">
                {renderTree(projectTree)}
            </div>
        </div>
    );
};

export default ProjectExplorer;