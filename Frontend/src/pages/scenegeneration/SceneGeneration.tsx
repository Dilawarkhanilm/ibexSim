import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import SceneGenerationLeftPanel from './components/SceneGenerationLeftPanel';
import SceneGenerationRightPanel from './components/SceneGenerationRightPanel';

interface SelectedLocation {
    name: string;
    lat: number;
    lon: number;
    area: string;
}

interface TileInfo {
    id: string;
    x: number;
    y: number;
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}

interface SceneGenerationProps {
    onVideoPlayStateChange?: (isPlaying: boolean) => void;
    onTaskUpdate?: (taskName: string) => void;
    onRegisterVideoControls?: (controls: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    }) => void;
}

const SceneGeneration: React.FC<SceneGenerationProps> = ({
    onVideoPlayStateChange,
    onTaskUpdate,
    onRegisterVideoControls
}) => {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'completed' | 'paused'>('idle');

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    // Helper function for task updates with debugging
    const updateTask = (taskName: string) => {
        console.log('SceneGeneration: Updating task to:', taskName);
        onTaskUpdate?.(taskName);
    };

    const handleLocationSelect = (location: SelectedLocation) => {
        if (isGenerating && !isPaused) return;
        
        console.log('SceneGeneration: Location selected:', location.name);
        setSelectedLocation(location);
        setSelectedTile(null); // Clear selected tile when location changes
        updateTask(`Location selected: ${location.name}`);
    };

    const handleTileSelect = (tile: TileInfo) => {
        if (isGenerating && !isPaused) return;
        
        console.log('SceneGeneration: Tile selected:', `(${tile.x}, ${tile.y})`);
        setSelectedTile(tile);
        updateTask(`Tile selected: (${tile.x}, ${tile.y})`);
    };

    const handlePlay = () => {
        if (!selectedLocation || !selectedTile) {
            updateTask("Please select location and tile first");
            return;
        }

        setIsGenerating(true);
        setIsPaused(false);
        setGenerationState('generating');
        onVideoPlayStateChange?.(true);
        updateTask("Starting 3D scene generation");

        // Simulate generation process
        setTimeout(() => {
            if (generationState === 'generating') {
                setGenerationState('completed');
                setIsGenerating(false);
                onVideoPlayStateChange?.(false);
                updateTask("3D scene generation completed");
            }
        }, 5000);
    };

    const handlePause = () => {
        if (isGenerating) {
            setIsPaused(true);
            setGenerationState('paused');
            onVideoPlayStateChange?.(false);
            updateTask("Generation paused - location can be changed");
        }
    };

    const handleStop = () => {
        setIsGenerating(false);
        setIsPaused(false);
        setGenerationState('idle');
        setSelectedLocation(null);
        setSelectedTile(null);
        onVideoPlayStateChange?.(false);
        updateTask("Reset to clean state");
    };

    const handleRestart = () => {
        if (selectedLocation && selectedTile) {
            handleStop();
            setTimeout(() => {
                handlePlay();
            }, 100);
        }
    };

    // Register video controls with parent component
    useEffect(() => {
        if (onRegisterVideoControls) {
            onRegisterVideoControls({
                play: handlePlay,
                pause: handlePause,
                stop: handleStop,
                restart: handleRestart
            });
        }
    }, [onRegisterVideoControls, selectedLocation, selectedTile, isGenerating]);

    // Set initial status when component mounts
    useEffect(() => {
        updateTask("Ready - Please select a location and tile");
    }, []);

    // Update task when location/tile state changes
    useEffect(() => {
        if (selectedLocation && selectedTile) {
            updateTask(`Ready to generate - Location: ${selectedLocation.name}, Tile: (${selectedTile.x}, ${selectedTile.y})`);
        } else if (selectedLocation && !selectedTile) {
            updateTask(`Location selected: ${selectedLocation.name} - Please select a tile`);
        } else if (!selectedLocation && !selectedTile) {
            updateTask("Ready - Please select a location and tile");
        }
    }, [selectedLocation, selectedTile]);

    return (
        <div className="h-full bg-zinc-950 text-white flex relative">
            {/* Left Panel - Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <SceneGenerationLeftPanel 
                    selectedLocation={selectedLocation}
                    selectedTile={selectedTile}
                    onTileSelect={handleTileSelect}
                    isGenerating={isGenerating && !isPaused}
                    onTaskUpdate={updateTask}
                />
            </div>

            {/* Toggle Button */}
            <div className="absolute top-4 right-0 z-50">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleRightSidebar}
                    className={cn(
                        "p-1 h-8 w-8 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 transition-all duration-300",
                        isRightSidebarOpen
                            ? 'rounded-l-md border-r-0'
                            : 'rounded-l-md'
                    )}
                    style={{
                        right: isRightSidebarOpen ? '320px' : '0px'
                    }}
                >
                    {isRightSidebarOpen ? (
                        <ChevronRight className="w-3 h-3 text-zinc-300" />
                    ) : (
                        <ChevronLeft className="w-3 h-3 text-zinc-300" />
                    )}
                </Button>
            </div>

            {/* Right Panel - Sidebar */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isRightSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0',
                "overflow-hidden"
            )}>
                <SceneGenerationRightPanel 
                    onLocationSelect={handleLocationSelect}
                    onTileSelect={handleTileSelect}
                    selectedLocation={selectedLocation}
                    selectedTile={selectedTile}
                    isGenerating={isGenerating && !isPaused}
                    onTaskUpdate={updateTask}
                />
            </div>
        </div>
    );
};

export default SceneGeneration;