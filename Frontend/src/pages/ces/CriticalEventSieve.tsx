import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import CESLeftPanel from './components/CESLeftPanel';
import CESRightPanel from './components/CESRightPanel';

interface VideoFile {
    id: string;
    file: File;
    name: string;
    size: number;
    duration?: number;
}

interface CriticalEventSieveProps {
    onVideoPlayStateChange?: (isPlaying: boolean) => void;
    onVideoUpload?: (videos: VideoFile[]) => void;
    onRegisterVideoControls?: (controls: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    }) => void;
    
}

const CriticalEventSieve: React.FC<CriticalEventSieveProps> = ({ 
    onVideoPlayStateChange,
    onVideoUpload,
    onRegisterVideoControls
}) => {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [uploadedVideos, setUploadedVideos] = useState<VideoFile[]>([]);
    const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    const handleVideosChange = (videos: VideoFile[]) => {
        setUploadedVideos(videos);
        onVideoUpload?.(videos);
        
        // If all videos are removed, clear selection
        if (videos.length === 0) {
            setSelectedVideoIds([]);
        } else {
            // Remove selected IDs that no longer exist
            const validIds = videos.map(v => v.id);
            setSelectedVideoIds(prev => prev.filter(id => validIds.includes(id)));
        }
    };

    const handleFiltersChange = (filters: string[]) => {
        setSelectedFilters(filters);
    };

    const handleSelectedVideosChange = (selectedIds: string[]) => {
        setSelectedVideoIds(selectedIds);
    };

    const handlePlayStateChange = (isPlaying: boolean) => {
        setIsVideoPlaying(isPlaying);
        onVideoPlayStateChange?.(isPlaying);
    };

    return (
        <div className="h-full bg-zinc-950 text-white flex relative">
            {/* Left Panel - Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <CESLeftPanel 
                    videos={uploadedVideos}
                    selectedVideoIds={selectedVideoIds}
                    onSelectedVideosChange={handleSelectedVideosChange}
                    isPlaying={isVideoPlaying}
                    onPlayStateChange={handlePlayStateChange}
                    onRegisterVideoControls={onRegisterVideoControls}
                    selectedFilters={selectedFilters}
                />
            </div>

            {/* Toggle Button */}
            <div className="absolute top-1 right-0 z-50">
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
                "transition-all duration-300 ease-in-out border-b border-zinc-800 rounded-lg",
                isRightSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0',
                "overflow-hidden"
            )}>
                <CESRightPanel 
                    onVideosChange={handleVideosChange}
                    onFiltersChange={handleFiltersChange}
                    isPlaybackActive={isVideoPlaying}
                />
            </div>
        </div>
    );
};

export default CriticalEventSieve;