import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ScenarioGenerationLeftPanel from './components/ScenarioGenerationLeftPanel';
import ScenarioGenerationRightPanel from './components/ScenarioGenerationRightPanel';

interface VideoReference {
    id: string;
    name: string;
    url: string;
    duration: string;
    thumbnail: string;
}

interface SelectedLocation {
    name: string;
    lat: number;
    lon: number;
    area: string;
}

interface SimulationPoint {
    lat: number;
    lon: number;
    name: string;
}

interface ScenarioGenerationProps {
    onVideoPlayStateChange?: (isPlaying: boolean) => void;
    onTaskUpdate?: (taskName: string) => void;
    onRegisterVideoControls?: (controls: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    }) => void;
}

const ScenarioGeneration: React.FC<ScenarioGenerationProps> = ({
    onVideoPlayStateChange,
    onTaskUpdate,
    onRegisterVideoControls
}) => {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [simulationPoint, setSimulationPoint] = useState<SimulationPoint | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<VideoReference | null>(null);
    const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Store the video controls from left panel
    const videoControlsRef = useRef<{
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    } | null>(null);

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    // Handle location selection from right panel
    const handleLocationSelect = (location: SelectedLocation) => {
        console.log('ScenarioGeneration: Location selected:', location);
        setSelectedLocation(location);
        onTaskUpdate?.(`Location selected: ${location.name}`);
    };

    // Handle simulation point selection
    const handleSimulationPointSelect = (point: SimulationPoint) => {
        console.log('ScenarioGeneration: Simulation point selected:', point);
        setSimulationPoint(point);
        onTaskUpdate?.(`Starting point selected: ${point.name}`);
    };

    // Handle video selection from catalog
    const handleVideoSelect = (video: VideoReference | null) => {
        console.log('ScenarioGeneration: Video selected:', video);
        if (video) {
            setSelectedVideo(video);
            onTaskUpdate?.(`Reference selected: ${video.name}`);
        } else {
            setSelectedVideo(null);
            onTaskUpdate?.('Video reference cleared');
        }
    };

    // Handle video upload
    const handleVideoUpload = (videos: File[]) => {
        console.log('ScenarioGeneration: Videos uploaded:', videos.length);
        setUploadedVideos(videos);
        if (videos.length > 0) {
            onTaskUpdate?.(`Video uploaded: ${videos[0].name}`);
        } else {
            onTaskUpdate?.('Uploaded videos cleared');
        }
    };

    // Handle video play state changes from left panel
    const handleVideoPlayStateChange = (isPlaying: boolean) => {
        console.log('ScenarioGeneration: Video play state changed:', isPlaying);
        setIsVideoPlaying(isPlaying);
        onVideoPlayStateChange?.(isPlaying);

        if (isPlaying) {
            onTaskUpdate?.("Scenario generation started");
        } else {
            onTaskUpdate?.("Scenario generation paused");
        }
    };

    // Handle video controls registration from left panel
    const handleRegisterVideoControls = (controls: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    }) => {
        console.log('ScenarioGeneration: Registering controls from left panel');
        videoControlsRef.current = controls;

        // Forward to parent (App.tsx) so ToolBar can use them
        if (onRegisterVideoControls) {
            console.log('ScenarioGeneration: Forwarding controls to parent');
            onRegisterVideoControls(controls);
        } else {
            console.warn('ScenarioGeneration: No onRegisterVideoControls callback provided');
        }
    };

    // Check if content is ready for generation
    useEffect(() => {
        const hasLocation = selectedLocation !== null;
        const hasPoint = simulationPoint !== null;
        const hasVideo = selectedVideo !== null || uploadedVideos.length > 0;
        const ready = hasLocation && hasPoint && hasVideo;

        console.log('ScenarioGeneration: Checking ready state:', {
            hasLocation,
            hasPoint,
            hasVideo,
            ready,
            selectedLocation,
            simulationPoint,
            selectedVideo,
            uploadedVideosCount: uploadedVideos.length
        });

        setIsReady(ready);

        if (ready) {
            onTaskUpdate?.("Scenario generation ready");
        }
    }, [selectedLocation, simulationPoint, selectedVideo, uploadedVideos.length, onTaskUpdate]);

    // Re-register controls when ready state changes to ensure ToolBar gets updated
    useEffect(() => {
        if (isReady && videoControlsRef.current && onRegisterVideoControls) {
            console.log('ScenarioGeneration: Re-registering controls due to ready state change');
            onRegisterVideoControls(videoControlsRef.current);
        }
    }, [isReady, onRegisterVideoControls]);

    return (
        <div className="h-full bg-zinc-950 text-white flex relative">
            {/* Left Panel - Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <ScenarioGenerationLeftPanel
                    selectedVideo={selectedVideo}
                    simulationPoint={simulationPoint}
                    isPlaying={isVideoPlaying}
                    uploadedVideos={uploadedVideos}
                    onVideoPlayStateChange={handleVideoPlayStateChange}
                    onRegisterVideoControls={handleRegisterVideoControls}
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
                <ScenarioGenerationRightPanel
                    onLocationSelect={handleLocationSelect}
                    onSimulationPointSelect={handleSimulationPointSelect}
                    onVideoSelect={handleVideoSelect}
                    onVideoUpload={handleVideoUpload}
                    selectedLocation={selectedLocation}
                    simulationPoint={simulationPoint}
                    selectedVideo={selectedVideo}
                    uploadedVideos={uploadedVideos}
                    isPlaybackActive={isVideoPlaying}   // ← NEW
                />
            </div>
        </div>
    );
};

export default ScenarioGeneration;