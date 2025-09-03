// Frontend/src/components/MenuBar.tsx
import React, { useState } from 'react';

const MenuBar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const menuItems = [
        {
            label: 'File',
            items: [
                'New Project',
                'Open Project',
                'Open Folder',
                'Save',
                'Save As...',
                'Export',
                'Recent Files',
                'Exit'
            ]
        },
        {
            label: 'Edit',
            items: [
                'Undo',
                'Redo',
                'Cut',
                'Copy',
                'Paste',
                'Find',
                'Replace',
                'Preferences'
            ]
        },
        {
            label: 'Tools',
            items: [
                'Command Palette',
                'Settings',
                'Extensions',
                'Keyboard Shortcuts',
                'User Snippets',
                'Color Theme'
            ]
        },
        {
            label: 'View',
            items: [
                'Explorer',
                'Search',
                'Source Control',
                'Debug Console',
                'Terminal',
                'Output',
                'Problems'
            ]
        },
        {
            label: 'Go',
            items: [
                'Go to File...',
                'Go to Line...',
                'Go to Symbol...',
                'Go to Definition',
                'Navigate Back',
                'Navigate Forward'
            ]
        },
        {
            label: 'Run',
            items: [
                'Start Debugging',
                'Run Without Debugging',
                'Stop',
                'Restart',
                'Run Build Task',
                'Run Test Task'
            ]
        },
        {
            label: 'Add-ons',
            items: [
                'Critical Event Sieve',
                'Scene Generation',
                'Scenario Generation',
                'Drive Lab',
                'Functional Safety',
                'Cyber Security'
            ]
        },
        {
            label: 'Help',
            items: [
                'Documentation',
                'Keyboard Shortcuts',
                'Release Notes',
                'Report Issue',
                'About'
            ]
        }
    ];

    const handleMenuClick = (label: string) => {
        setActiveMenu(activeMenu === label ? null : label);
    };

    const handleItemClick = (item: string) => {
        console.log('Menu item clicked:', item);
        setActiveMenu(null);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    return (
        <div className="h-6 bg-gray-800 border-b border-gray-700 flex items-center px-2 text-xs text-gray-300 relative select-none">
            {menuItems.map((menu) => (
                <div key={menu.label} className="relative" onMouseLeave={handleMouseLeave}>
                    <button
                        className={`px-3 py-1 hover:bg-gray-700 transition-colors ${activeMenu === menu.label ? 'bg-gray-700' : ''
                            }`}
                        onClick={() => handleMenuClick(menu.label)}
                        onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
                    >
                        {menu.label}
                    </button>

                    {activeMenu === menu.label && (
                        <div className="absolute top-full left-0 bg-gray-800 border border-gray-700 shadow-lg min-w-48 z-50">
                            {menu.items.map((item, index) => (
                                <button
                                    key={index}
                                    className="block w-full text-left px-3 py-2 hover:bg-gray-700 text-xs text-gray-300 border-b border-gray-700 last:border-b-0"
                                    onClick={() => handleItemClick(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MenuBar;