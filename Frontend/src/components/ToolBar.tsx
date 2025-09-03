// Frontend/src/components/ToolBar.tsx
import React from 'react';
import {
    FileText,
    FolderOpen,
    Save,
    Undo,
    Redo,
    Play,
    Square,
    RotateCcw,
    Settings,
    HelpCircle,
    Search,
    Copy,
    Scissors,
    ClipboardPaste
} from 'lucide-react';

interface ToolBarProps {
    onNewFile?: () => void;
    onOpenFolder?: () => void;
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onRun?: () => void;
    onStop?: () => void;
    onRestart?: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
    onNewFile,
    onOpenFolder,
    onSave,
    onUndo,
    onRedo,
    onRun,
    onStop,
    onRestart
}) => {
    const toolbarItems = [
        // File operations
        {
            icon: FileText,
            tooltip: 'New File (Ctrl+N)',
            onClick: onNewFile,
            group: 'file'
        },
        {
            icon: FolderOpen,
            tooltip: 'Open Folder (Ctrl+K Ctrl+O)',
            onClick: onOpenFolder,
            group: 'file'
        },
        {
            icon: Save,
            tooltip: 'Save (Ctrl+S)',
            onClick: onSave,
            group: 'file'
        },
        // Separator
        { separator: true },
        // Edit operations
        {
            icon: Scissors,
            tooltip: 'Cut (Ctrl+X)',
            onClick: () => console.log('Cut'),
            group: 'edit'
        },
        {
            icon: Copy,
            tooltip: 'Copy (Ctrl+C)',
            onClick: () => console.log('Copy'),
            group: 'edit'
        },
        {
            icon: ClipboardPaste,
            tooltip: 'Paste (Ctrl+V)',
            onClick: () => console.log('Paste'),
            group: 'edit'
        },
        // Separator
        { separator: true },
        // Undo/Redo
        {
            icon: Undo,
            tooltip: 'Undo (Ctrl+Z)',
            onClick: onUndo,
            group: 'history'
        },
        {
            icon: Redo,
            tooltip: 'Redo (Ctrl+Y)',
            onClick: onRedo,
            group: 'history'
        },
        // Separator
        { separator: true },
        // Run operations
        {
            icon: Play,
            tooltip: 'Run (F5)',
            onClick: onRun,
            group: 'run',
            highlight: true
        },
        {
            icon: Square,
            tooltip: 'Stop (Shift+F5)',
            onClick: onStop,
            group: 'run'
        },
        {
            icon: RotateCcw,
            tooltip: 'Restart (Ctrl+Shift+F5)',
            onClick: onRestart,
            group: 'run'
        },
        // Separator
        { separator: true },
        // Tools
        {
            icon: Search,
            tooltip: 'Search (Ctrl+F)',
            onClick: () => console.log('Search'),
            group: 'tools'
        },
        {
            icon: Settings,
            tooltip: 'Settings (Ctrl+,)',
            onClick: () => console.log('Settings'),
            group: 'tools'
        },
        {
            icon: HelpCircle,
            tooltip: 'Help (F1)',
            onClick: () => console.log('Help'),
            group: 'tools'
        }
    ];

    return (
        <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-2 gap-1">
            {toolbarItems.map((item, index) => {
                if (item.separator) {
                    return (
                        <div
                            key={`separator-${index}`}
                            className="w-px h-5 bg-gray-600 mx-1"
                        />
                    );
                }

                const Icon = item.icon;

                return (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-700 transition-colors group relative ${item.highlight ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-white'
                            }`}
                        title={item.tooltip}
                    >
                        {Icon ? <Icon size={14} /> : null}

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 border border-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity delay-500 pointer-events-none z-50 whitespace-nowrap">
                            {item.tooltip}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ToolBar;