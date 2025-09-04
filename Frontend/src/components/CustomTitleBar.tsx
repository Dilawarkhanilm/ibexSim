import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import LogoImage from "../assets/Images/icon.png"; // Replace with your logo path
interface CustomTitleBarProps {
    title?: string;
    showLogo?: boolean;
}

const CustomTitleBar: React.FC<CustomTitleBarProps> = ({
    title = "ibexCortex",
    showLogo = true
}) => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        // Check if window is maximized on component mount
        const checkMaximized = async () => {
            if (window.cortex?.windowControls?.isMaximized) {
                const maximized = await window.cortex.windowControls.isMaximized();
                setIsMaximized(maximized);
            }
        };
        checkMaximized();
    }, []);

    const handleMinimize = () => {
        if (window.cortex?.windowControls?.minimize) {
            window.cortex.windowControls.minimize();
        }
    };

    const handleMaximize = () => {
        if (window.cortex?.windowControls?.maximize) {
            window.cortex.windowControls.maximize();
            setIsMaximized(!isMaximized);
        }
    };

    const handleClose = () => {
        if (window.cortex?.windowControls?.close) {
            window.cortex.windowControls.close();
        }
    };

    return (
        <div className="flex items-center justify-between h-8 bg-primary-500 border-b border-gray-700 select-none">
            {/* Left section - Logo and Title */}
            <div className="flex items-center px-3 space-x-2 flex-1 min-w-0">
                {showLogo && (
                    <div className="flex items-center space-x-1">
                        {/* App Logo */}
                        <div className="w-4 h-4 bg-primary-500 rounded-sm flex items-center justify-center">
                            <img src={LogoImage} alt="CortexSim Logo" />
                        </div>
                        {/* App Title */}
                        <span className="text-white text-xs font-medium truncate">
                            {title}
                        </span>
                    </div>
                )}
            </div>

            {/* Middle section - Draggable area */}
            <div
                className="flex-1 h-full cursor-move"
                style={{ WebkitAppRegion: 'drag' } as any}
            />

            {/* Right section - Window Controls */}
            <div className="flex items-center">
                {/* Minimize Button */}
                <button
                    onClick={handleMinimize}
                    className="h-8 w-11 flex items-center justify-center hover:bg-gray-700 transition-colors group"
                    style={{ WebkitAppRegion: 'no-drag' } as any}
                    aria-label="Minimize window"
                >
                    <Minus className="w-3 h-3 text-gray-300 group-hover:text-white transition-colors" />
                </button>

                {/* Maximize/Restore Button */}
                <button
                    onClick={handleMaximize}
                    className="h-8 w-11 flex items-center justify-center hover:bg-gray-700 transition-colors group"
                    style={{ WebkitAppRegion: 'no-drag' } as any}
                    aria-label={isMaximized ? "Restore window" : "Maximize window"}
                >
                    {isMaximized ? (
                        <Square className="w-3 h-3 text-gray-300 group-hover:text-white transition-colors" />
                    ) : (
                        <Maximize2 className="w-3 h-3 text-gray-300 group-hover:text-white transition-colors" />
                    )}
                </button>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="h-8 w-11 flex items-center justify-center hover:bg-red-600 transition-colors group"
                    style={{ WebkitAppRegion: 'no-drag' } as any}
                    aria-label="Close window"
                >
                    <X className="w-3 h-3 text-gray-300 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );
};

export default CustomTitleBar;