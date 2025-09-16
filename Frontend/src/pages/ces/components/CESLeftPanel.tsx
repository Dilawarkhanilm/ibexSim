import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    FileText,
    BarChart3,
    Download,
    Play,
    Pause,
    Volume2,
    VolumeX,
    SkipBack,
    SkipForward
} from 'lucide-react';

interface VideoFile {
    id: string;
    file: File;
    name: string;
    size: number;
    duration?: number;
}

interface CESLeftPanelProps {
    videos?: VideoFile[];
    selectedVideoIds?: string[];
    onSelectedVideosChange?: (selectedIds: string[]) => void;
    isPlaying?: boolean;
    onPlayStateChange?: (isPlaying: boolean) => void;
    onRegisterVideoControls?: (controls: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    }) => void;
    selectedFilters?: string[];
}

const CESLeftPanel: React.FC<CESLeftPanelProps> = ({
    videos = [],
    selectedVideoIds = [],
    onSelectedVideosChange,
    isPlaying = false,
    onPlayStateChange,
    onRegisterVideoControls,
    selectedFilters = ['All']
}) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [selectedVideos, setSelectedVideos] = useState<string[]>(selectedVideoIds);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playQueue, setPlayQueue] = useState<VideoFile[]>([]);

    // Update selected videos when prop changes
    useEffect(() => {
        setSelectedVideos(selectedVideoIds);
    }, [selectedVideoIds]);

    // Handle external play state changes
    useEffect(() => {
        if (isPlaying && !isVideoPlaying) {
            handlePlay();
        } else if (!isPlaying && isVideoPlaying) {
            handlePause();
        }
    }, [isPlaying]);

    // Create play queue based on selected videos
    useEffect(() => {
        if (selectedVideos.length > 0) {
            const queue = videos.filter(video => selectedVideos.includes(video.id));
            setPlayQueue(queue);
            if (queue.length > 0 && currentVideoIndex >= queue.length) {
                setCurrentVideoIndex(0);
            }
        } else {
            setPlayQueue([]);
        }
    }, [selectedVideos, videos]);

    // Load current video
    useEffect(() => {
        if (playQueue.length > 0 && currentVideoIndex < playQueue.length) {
            const currentVideo = playQueue[currentVideoIndex];
            if (currentVideoUrl) {
                URL.revokeObjectURL(currentVideoUrl);
            }
            const url = URL.createObjectURL(currentVideo.file);
            setCurrentVideoUrl(url);
        }

        return () => {
            if (currentVideoUrl) {
                URL.revokeObjectURL(currentVideoUrl);
            }
        };
    }, [playQueue, currentVideoIndex]);

    const handlePlay = () => {
        if (videoRef.current && playQueue.length > 0) {
            videoRef.current.play();
            setIsVideoPlaying(true);
            onPlayStateChange?.(true);
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
            onPlayStateChange?.(false);
        }
    };

    const handleStop = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsVideoPlaying(false);
            setCurrentVideoIndex(0);
            onPlayStateChange?.(false);
        }
    };

    const handleRestart = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            if (isVideoPlaying) {
                videoRef.current.play();
            }
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
    }, [onRegisterVideoControls, playQueue.length]);

    const handleVideoEnded = () => {
        if (currentVideoIndex < playQueue.length - 1) {
            // Play next video in queue
            setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
            // All videos completed
            setIsVideoPlaying(false);
            setCurrentVideoIndex(0);
            onPlayStateChange?.(false);
        }
    };

    const handlePreviousVideo = () => {
        if (currentVideoIndex > 0) {
            setCurrentVideoIndex(currentVideoIndex - 1);
        }
    };

    const handleNextVideo = () => {
        if (currentVideoIndex < playQueue.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleVolumeChange = () => {
        if (videoRef.current) {
            setVolume(videoRef.current.volume);
            setIsMuted(videoRef.current.muted);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current && duration > 0) {
            const rect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            videoRef.current.currentTime = newTime;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Generate dummy data based on current video
    const generateDummyData = (videoName: string) => {
        const anomalyTypes = [
            'Biker-Four-Wheeler Clash',
            'Obstacle Collision',
            'Out of Control - Left/ Right Deviation',
            'Oncoming Vehicle Clash',
            'Pedestrian-Vehicle Clash'
        ];

        const anomalyColors = {
            'Biker-Four-Wheeler Clash': 'text-red-400 bg-red-500/10',
            'Obstacle Collision': 'text-orange-400 bg-orange-500/10',
            'Out of Control - Left/ Right Deviation': 'text-yellow-400 bg-yellow-500/10',
            'Oncoming Vehicle Clash': 'text-purple-400 bg-purple-500/10',
            'Pedestrian-Vehicle Clash': 'text-pink-400 bg-pink-500/10'
        };

        // Generate consistent data based on video name hash
        const hash = videoName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);

        const numEvents = Math.abs(hash % 8) + 3; // 3-10 events
        const events = [];

        for (let i = 0; i < numEvents; i++) {
            const seed = Math.abs(hash + i * 1000);
            const anomalyType = anomalyTypes[seed % anomalyTypes.length];
            const frameNumber = (seed % 9000) + 1000; // Random frame between 1000-9999
            const confidence = Math.floor((seed % 40) + 60); // Confidence between 60-99
            const detectionTime = `${Math.floor(frameNumber / 30 / 60)}:${String(Math.floor((frameNumber / 30) % 60)).padStart(2, '0')}`;

            events.push({
                id: i + 1,
                frameNumber,
                detectionTime,
                anomalyType,
                confidence,
                colors: anomalyColors[anomalyType as keyof typeof anomalyColors]
            });
        }

        return events.sort((a, b) => a.frameNumber - b.frameNumber);
    };

    const getDummyData = () => {
        if (playQueue.length === 0 || !playQueue[currentVideoIndex]) {
            return [];
        }
        return generateDummyData(playQueue[currentVideoIndex].name);
    };

    const getFilteredData = () => {
        const data = getDummyData();
        
        // If 'All' is selected or no filters, show all data
        if (selectedFilters.includes('All') || selectedFilters.length === 0) {
            return data;
        }
        
        // Filter data based on selected anomaly types
        return data.filter(event => selectedFilters.includes(event.anomalyType));
    };

    const getVideoSelectionOptions = () => {
        const options = [
            { value: "all-videos", label: "All Videos", isSelected: selectedVideos.length === videos.length && videos.length > 0 },
            ...videos.map(video => ({
                value: video.id,
                label: video.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                isSelected: selectedVideos.includes(video.id)
            }))
        ];
        return options;
    };

    const handleVideoSelectionChange = (value: string) => {
        if (value === "all-videos") {
            // Toggle all videos
            if (selectedVideos.length === videos.length && videos.length > 0) {
                // If all are selected, deselect all
                setSelectedVideos([]);
                onSelectedVideosChange?.([]);
            } else {
                // If not all are selected, select all
                const allIds = videos.map(v => v.id);
                setSelectedVideos(allIds);
                onSelectedVideosChange?.(allIds);
            }
        } else {
            // Toggle individual video
            let newSelection: string[];
            if (selectedVideos.includes(value)) {
                // Remove from selection
                newSelection = selectedVideos.filter(id => id !== value);
            } else {
                // Add to selection
                newSelection = [...selectedVideos, value];
            }
            setSelectedVideos(newSelection);
            onSelectedVideosChange?.(newSelection);
        }
    };

    const getCurrentSelectionLabel = () => {
        if (videos.length === 0) {
            return "No Videos Available";
        } else if (selectedVideos.length === 0) {
            return "Select Videos";
        } else if (selectedVideos.length === videos.length) {
            return "All Videos";
        } else if (selectedVideos.length === 1) {
            const selectedVideo = videos.find(v => v.id === selectedVideos[0]);
            return selectedVideo?.name.replace(/\.[^/.]+$/, "") || "1 Video Selected";
        } else {
            return `${selectedVideos.length} Videos Selected`;
        }
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            {/* Annotated Frames Section */}
            <Card className="mb-4 bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200">Annotated Frames</CardTitle>
                </CardHeader>
                <CardContent>
                    {currentVideoUrl && playQueue.length > 0 ? (
                        <div className="bg-zinc-800 border border-zinc-600 rounded-lg overflow-hidden">
                            {/* Video Player */}
                            <video
                                ref={videoRef}
                                src={currentVideoUrl}
                                className="w-full h-64 bg-black"
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onVolumeChange={handleVolumeChange}
                                onEnded={handleVideoEnded}
                                controls={false}
                            />
                            
                            {/* Video Controls */}
                            <div className="p-3 bg-zinc-800 space-y-2">
                                {/* Progress Bar */}
                                <div 
                                    className="w-full bg-zinc-700 rounded-full h-1.5 cursor-pointer"
                                    onClick={handleProgressClick}
                                >
                                    <div 
                                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                    />
                                </div>
                                
                                {/* Controls Row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-zinc-300 hover:text-white"
                                            onClick={handlePreviousVideo}
                                            disabled={currentVideoIndex === 0}
                                        >
                                            <SkipBack className="w-4 h-4" />
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-zinc-300 hover:text-white"
                                            onClick={isVideoPlaying ? handlePause : handlePlay}
                                        >
                                            {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-zinc-300 hover:text-white"
                                            onClick={handleNextVideo}
                                            disabled={currentVideoIndex === playQueue.length - 1}
                                        >
                                            <SkipForward className="w-4 h-4" />
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-zinc-300 hover:text-white"
                                            onClick={toggleMute}
                                        >
                                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-zinc-400">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </span>
                                        
                                        {playQueue.length > 1 && (
                                            <span className="text-xs text-zinc-400">
                                                ({currentVideoIndex + 1}/{playQueue.length})
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Current Video Info */}
                                {playQueue[currentVideoIndex] && (
                                    <div className="text-xs text-zinc-400 truncate">
                                        Playing: {playQueue[currentVideoIndex].name}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg h-64 flex items-center justify-center">
                            <div className="text-center text-zinc-400">
                                <FileText className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-sm">
                                    {videos.length === 0 ? "No Videos Uploaded" : "Select videos to play"}
                                </p>
                                {videos.length > 0 && selectedVideos.length === 0 && (
                                    <p className="text-xs mt-1">Choose videos from the dropdown below</p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Traffic Critical Events Table */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-zinc-200">Traffic Critical Events</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Select 
                                value="" // Always empty to allow clicking on any option
                                onValueChange={handleVideoSelectionChange}
                                disabled={isVideoPlaying} // Disable during playback
                            >
                                <SelectTrigger className={`w-48 h-7 text-xs bg-zinc-800 text-white border-zinc-700 ${isVideoPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <SelectValue placeholder={getCurrentSelectionLabel()} />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    {getVideoSelectionOptions().map((option) => (
                                        <SelectItem 
                                            key={option.value} 
                                            value={option.value} 
                                            className={`text-xs cursor-pointer transition-all ${
                                                option.isSelected 
                                                    ? 'bg-blue-600/30 text-blue-200 border-l-4 border-blue-500 font-medium' 
                                                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                                            }`}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button 
                                size="sm" 
                                className={`h-7 px-2 text-xs bg-zinc-700 hover:bg-zinc-600 ${isVideoPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={isVideoPlaying}
                            >
                                <BarChart3 className="w-3 h-3 mr-1" />
                                KPI
                            </Button>
                            <Button 
                                size="sm" 
                                className={`h-7 px-2 text-xs bg-zinc-700 hover:bg-zinc-600 ${isVideoPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={isVideoPlaying}
                            >
                                <Download className="w-3 h-3 mr-1" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-700">
                                <TableHead className="text-xs text-zinc-400">S#</TableHead>
                                <TableHead className="text-xs text-zinc-400">Frame Number</TableHead>
                                <TableHead className="text-xs text-zinc-400">Det. Time</TableHead>
                                <TableHead className="text-xs text-zinc-400">Anomaly Type</TableHead>
                                <TableHead className="text-xs text-zinc-400">Confidence</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                const filteredData = getFilteredData();
                                
                                // Debug logging
                                console.log('Debug Info:', {
                                    videos: videos.length,
                                    selectedVideos: selectedVideos,
                                    selectedFilters: selectedFilters,
                                    playQueue: playQueue.length,
                                    currentVideoIndex: currentVideoIndex,
                                    dummyDataLength: getDummyData().length,
                                    filteredDataLength: filteredData.length
                                });
                                
                                if (videos.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-zinc-500 text-xs">
                                                Upload videos to see critical events
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                                
                                if (selectedVideos.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-zinc-500 text-xs">
                                                Select videos to see critical events
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                                
                                if (filteredData.length === 0) {
                                    const rawData = getDummyData();
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-zinc-500 text-xs">
                                                {rawData.length === 0 
                                                    ? "No critical events generated for selected video" 
                                                    : `No events match filters (${rawData.length} total events available)`}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                                
                                return filteredData.map((event) => (
                                    <TableRow key={event.id} className="border-zinc-700 hover:bg-zinc-800/50">
                                        <TableCell className="text-xs text-zinc-300">{event.id}</TableCell>
                                        <TableCell className="text-xs text-zinc-300">{event.frameNumber}</TableCell>
                                        <TableCell className="text-xs text-zinc-300">{event.detectionTime}</TableCell>
                                        <TableCell className="text-xs">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.colors}`}>
                                                {event.anomalyType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            <span className={`font-medium ${
                                                event.confidence >= 90 ? 'text-green-400' :
                                                event.confidence >= 75 ? 'text-yellow-400' :
                                                'text-orange-400'
                                            }`}>
                                                {event.confidence}%
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ));
                            })()}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default CESLeftPanel;