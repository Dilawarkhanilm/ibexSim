import React from 'react';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import {
    FileIcon,
    Settings,
    Play,
    Puzzle,
    FolderOpen,
    Save,
    Download,
    Undo2,
    Redo2,
    Search,
    Terminal,
    Bug,
    Keyboard,
    Palette
} from 'lucide-react';

interface MenuBarProps {
    className?: string;
}

const MenuBar: React.FC<MenuBarProps> = ({
    className
}) => {
    const menuItems = [
        {
            label: 'File',
            items: [
                { label: 'New Project', icon: <FileIcon className="w-3 h-3" />, shortcut: 'Ctrl+N' },
                { label: 'Open Project', icon: <FolderOpen className="w-3 h-3" />, shortcut: 'Ctrl+O' },
                { label: 'Open Folder', icon: <FolderOpen className="w-3 h-3" /> },
                { type: 'separator' },
                { label: 'Save', icon: <Save className="w-3 h-3" />, shortcut: 'Ctrl+S' },
                { label: 'Save As...', icon: <Save className="w-3 h-3" />, shortcut: 'Ctrl+Shift+S' },
                { label: 'Export', icon: <Download className="w-3 h-3" /> },
                { type: 'separator' },
                { label: 'Recent Files' },
                { label: 'Exit', shortcut: 'Alt+F4' }
            ]
        },
        {
            label: 'Edit',
            items: [
                { label: 'Undo', icon: <Undo2 className="w-3 h-3" />, shortcut: 'Ctrl+Z' },
                { label: 'Redo', icon: <Redo2 className="w-3 h-3" />, shortcut: 'Ctrl+Y' },
                { type: 'separator' },
                { label: 'Cut', shortcut: 'Ctrl+X' },
                { label: 'Copy', shortcut: 'Ctrl+C' },
                { label: 'Paste', shortcut: 'Ctrl+V' },
                { type: 'separator' },
                { label: 'Find', icon: <Search className="w-3 h-3" />, shortcut: 'Ctrl+F' },
                { label: 'Replace', shortcut: 'Ctrl+H' },
                { type: 'separator' },
                { label: 'Preferences', icon: <Settings className="w-3 h-3" /> }
            ]
        },
        {
            label: 'Tools',
            items: [
                { label: 'Command Palette', shortcut: 'Ctrl+Shift+P' },
                { label: 'Settings', icon: <Settings className="w-3 h-3" /> },
                { label: 'Extensions', icon: <Puzzle className="w-3 h-3" /> },
                { type: 'separator' },
                { label: 'Keyboard Shortcuts', icon: <Keyboard className="w-3 h-3" /> },
                { label: 'User Snippets' },
                { label: 'Color Theme', icon: <Palette className="w-3 h-3" /> }
            ]
        },
        {
            label: 'View',
            items: [
                { label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
                { label: 'Search', icon: <Search className="w-3 h-3" />, shortcut: 'Ctrl+Shift+F' },
                { label: 'Source Control', shortcut: 'Ctrl+Shift+G' },
                { type: 'separator' },
                { label: 'Debug Console', icon: <Bug className="w-3 h-3" /> },
                { label: 'Terminal', icon: <Terminal className="w-3 h-3" />, shortcut: 'Ctrl+`' },
                { label: 'Output' },
                { label: 'Problems' }
            ]
        },
        {
            label: 'Go',
            items: [
                { label: 'Go to File...', shortcut: 'Ctrl+P' },
                { label: 'Go to Line...', shortcut: 'Ctrl+G' },
                { label: 'Go to Symbol...', shortcut: 'Ctrl+Shift+O' },
                { type: 'separator' },
                { label: 'Go to Definition', shortcut: 'F12' },
                { label: 'Navigate Back', shortcut: 'Alt+←' },
                { label: 'Navigate Forward', shortcut: 'Alt+→' }
            ]
        },
        {
            label: 'Run',
            items: [
                { label: 'Start Debugging', icon: <Play className="w-3 h-3" />, shortcut: 'F5' },
                { label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
                { label: 'Stop', shortcut: 'Shift+F5' },
                { label: 'Restart', shortcut: 'Ctrl+Shift+F5' },
                { type: 'separator' },
                { label: 'Run Build Task', shortcut: 'Ctrl+Shift+B' },
                { label: 'Run Test Task' }
            ]
        },
        {
            label: 'Add-ons',
            items: [
                { label: 'Critical Event Sieve' },
                { label: 'Scene Generation' },
                { label: 'Scenario Generation' },
                { type: 'separator' },
                { label: 'Drive Lab' },
                { label: 'Functional Safety' },
                { label: 'Cyber Security' }
            ]
        },
        {
            label: 'Help',
            items: [
                { label: 'Documentation' },
                { label: 'Keyboard Shortcuts', icon: <Keyboard className="w-3 h-3" /> },
                { label: 'Release Notes' },
                { type: 'separator' },
                { label: 'Report Issue' },
                { label: 'About' }
            ]
        }
    ];

    const handleItemClick = (item: string) => {
        console.log('Menu item clicked:', item);
    };

    return (
        <div className={cn(
            "h-8 border-b bg-zinc-900 border-zinc-800 text-zinc-300 flex items-center px-2 text-xs select-none",
            className
        )}>
            <Menubar className="border-none bg-transparent h-auto p-0">
                {menuItems.map((menu) => (
                    <MenubarMenu key={menu.label}>
                        <MenubarTrigger className="px-2 py-2 h-auto text-xs font-normal rounded-none text-zinc-300 hover:bg-zinc-800 hover:text-white data-[state=open]:bg-zinc-800 data-[state=open]:text-white">
                            <span className="flex items-center  ">
                                {menu.label}
                            </span>
                        </MenubarTrigger>
                        <MenubarContent
                            className="min-w-48 text-xs bg-zinc-900 border-zinc-800"
                            align="start"
                        >
                            {menu.items.map((item, index) => {
                                if (item.type === 'separator') {
                                    return <MenubarSeparator key={index} className="bg-zinc-800" />;
                                }

                                return (
                                    <MenubarItem
                                        key={index}
                                        className="text-xs cursor-pointer flex items-center justify-between text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                                        onClick={() => handleItemClick(item.label ?? "")}
                                    >
                                        <span className="flex items-center gap-2">
                                            {item.icon}
                                            {item.label}
                                        </span>
                                        {item.shortcut && (
                                            <span className="text-[10px] opacity-60 text-zinc-400">
                                                {item.shortcut}
                                            </span>
                                        )}
                                    </MenubarItem>
                                );
                            })}
                        </MenubarContent>
                    </MenubarMenu>
                ))}
            </Menubar>
        </div>
    );
};

export default MenuBar;