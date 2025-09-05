import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import LogoImage from "../assets/Images/icon.png";

interface CustomTitleBarProps {
    title?: string;
    showLogo?: boolean;
    className?: string;
    variant?: 'default' | 'dark' | 'glass';
}

const CustomTitleBar: React.FC<CustomTitleBarProps> = ({
    title = "ibexCortex",
    showLogo = true,
    className,
    variant = 'dark'
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

    const variantStyles = {
        default: "bg-primary-500 border-border",
        dark: "bg-primary-500 border-zinc-800",
        glass: "bg-primary-500 backdrop-blur-md border-border/50"
    };

    return (
        <TooltipProvider>
            <div className={cn(
                "flex items-center justify-between h-8 border-b select-none",
                variantStyles[variant],
                className
            )}>
                {/* Left section - Logo and Title */}
                <div className="flex items-center px-3 space-x-2 flex-1 min-w-0">
                    {showLogo && (
                        <div className="flex items-center space-x-1">
                            {/* App Logo using Avatar */}
                            <Avatar className="w-5 h-3 rounded-none">
                                <AvatarImage src={LogoImage} className='rounded-none' alt="CortexSim Logo" />
                                <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                                    CX
                                </AvatarFallback>
                            </Avatar>
                            
                            {/* App Title */}
                            <span className="text-white text-xs font-medium truncate">
                                {title}
                            </span>
                        </div>
                    )}
                </div>

                {/* Middle section - Draggable area */}
                <div
                    className="flex-1 h-full"
                    style={{ WebkitAppRegion: 'drag' } as any}
                />

                {/* Right section - Window Controls */}
                <div className="flex items-center">
                    {/* Minimize Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleMinimize}
                                className="h-8 w-11 rounded-none text-white hover:bg-white/20 hover:text-white"
                                style={{ WebkitAppRegion: 'no-drag' } as any}
                            >
                                <Minus className="w-3 h-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Minimize</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Maximize/Restore Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleMaximize}
                                className="h-8 w-11 rounded-none text-white hover:bg-white/20 hover:text-white"
                                style={{ WebkitAppRegion: 'no-drag' } as any}
                            >
                                {isMaximized ? (
                                    <Square className="w-3 h-3" />
                                ) : (
                                    <Maximize2 className="w-3 h-3" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>{isMaximized ? "Restore" : "Maximize"}</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Close Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClose}
                                className="h-8 w-11 rounded-none text-white hover:bg-red-600 hover:text-white"
                                style={{ WebkitAppRegion: 'no-drag' } as any}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Close</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default CustomTitleBar;