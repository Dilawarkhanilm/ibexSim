import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Video,
    Eye,
    Play,
    Pause
} from 'lucide-react';

interface ScenarioGenerationLeftPanelProps {
    selectedVideo?: { url: string; name: string } | null;
    uploadedVideos?: File[]; // ADD THIS PROP
    simulationPoint?: { lat: number; lon: number } | null;
    isPlaying?: boolean;
    onVideoPlayStateChange?: (isPlaying: boolean) => void;
    onRegisterVideoControls?: (controls: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    }) => void;
}

const ScenarioGenerationLeftPanel: React.FC<ScenarioGenerationLeftPanelProps> = ({
    selectedVideo,
    uploadedVideos = [], // ADD DEFAULT VALUE
    simulationPoint,
    isPlaying = false,
    onVideoPlayStateChange,
    onRegisterVideoControls
}) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const realVideoRef = useRef<HTMLVideoElement>(null);
    const simVideoRef = useRef<HTMLVideoElement>(null);
    const controlsRegisteredRef = useRef(false);

    // FIX: Check both selectedVideo and uploadedVideos
    const hasContent = (selectedVideo || uploadedVideos.length > 0) && simulationPoint;

    const videoUrl = 'https://www.ibexvision.ai/assets/Real_Video-dMyhcSxc.mp4';
    const simVideoUrl = 'https://www.ibexvision.ai/assets/Simulation_Video-CP4CqP_a.mp4'

    const handlePlay = () => {
        console.log('LeftPanel: handlePlay called, hasContent:', hasContent);
        if (hasContent && realVideoRef.current && simVideoRef.current) {
            console.log('LeftPanel: Playing videos');
            realVideoRef.current.play();
            simVideoRef.current.play();
            setIsVideoPlaying(true);
            onVideoPlayStateChange?.(true);
        } else {
            console.warn('LeftPanel: Cannot play - missing content or video refs');
        }
    };

    const handlePause = () => {
        console.log('LeftPanel: handlePause called');
        if (realVideoRef.current && simVideoRef.current) {
            realVideoRef.current.pause();
            simVideoRef.current.pause();
            setIsVideoPlaying(false);
            onVideoPlayStateChange?.(false);
        }
    };

    const handleStop = () => {
        console.log('LeftPanel: handleStop called');
        if (realVideoRef.current && simVideoRef.current) {
            realVideoRef.current.pause();
            simVideoRef.current.pause();
            realVideoRef.current.currentTime = 0;
            simVideoRef.current.currentTime = 0;
            setIsVideoPlaying(false);
            onVideoPlayStateChange?.(false);
        }
    };

    const handleRestart = () => {
        console.log('LeftPanel: handleRestart called, hasContent:', hasContent);
        if (hasContent && realVideoRef.current && simVideoRef.current) {
            realVideoRef.current.currentTime = 0;
            simVideoRef.current.currentTime = 0;
            realVideoRef.current.play();
            simVideoRef.current.play();
            setIsVideoPlaying(true);
            onVideoPlayStateChange?.(true);
        }
    };

    // Register video controls - ALWAYS call hooks before any conditional returns
    useEffect(() => {
        if (onRegisterVideoControls) {
            let controls;
            
            if (hasContent) {
                // Register functional controls when content is available
                controls = {
                    play: handlePlay,
                    pause: handlePause,
                    stop: handleStop,
                    restart: handleRestart
                };
                console.log('LeftPanel: Registering functional video controls, hasContent:', hasContent);
            } else {
                // Register placeholder controls when no content
                controls = {
                    play: () => console.log('LeftPanel: Play called but no content'),
                    pause: () => console.log('LeftPanel: Pause called but no content'),
                    stop: () => console.log('LeftPanel: Stop called but no content'),
                    restart: () => console.log('LeftPanel: Restart called but no content')
                };
                console.log('LeftPanel: Registering placeholder controls (no content)');
            }
            
            onRegisterVideoControls(controls);
            controlsRegisteredRef.current = true;
        }
    }, [onRegisterVideoControls, hasContent, selectedVideo, simulationPoint, uploadedVideos.length]); // ADD uploadedVideos.length to dependencies

    // Sync internal state with prop
    useEffect(() => {
        setIsVideoPlaying(isPlaying);
    }, [isPlaying]);

    if (!hasContent) {
        return (
            <div className="flex-1 p-4 overflow-auto">
                <Card className="bg-zinc-900 border-zinc-800 h-full">
                    <CardContent className="h-full flex items-center justify-center">
                        <div className="text-center text-zinc-400">
                            <Video className="w-16 h-16 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-2">No Content Selected</h3>
                            <p className="text-sm">Select a location, starting point, and video reference to begin scenario generation</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 overflow-auto">
            <div className="h-full flex gap-4">
                {/* Real World Video - Left Side */}
                <Card className="flex-1 bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200 flex items-center">
                            <Eye className="w-6 h-6 mr-2" />
                            Real World
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <div className="w-full h-full bg-zinc-800 rounded overflow-hidden relative">
                            <video
                                ref={realVideoRef}
                                src={videoUrl}
                                className="w-full h-full object-cover"
                                controls={false}
                                muted
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Simulation Video - Right Side */}
                <Card className="flex-1 bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200 flex items-center">
                            <Video className="w-6 h-6 mr-2" />
                            Simulation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <div className="w-full h-full bg-zinc-800 rounded overflow-hidden relative">
                            <video
                                ref={simVideoRef}
                                src={simVideoUrl}
                                className="w-full h-full object-cover"
                                controls={false}
                                muted
                            />
                            {!isVideoPlaying && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="text-center text-zinc-400">
                                        <Video className="w-12 h-12 mx-auto mb-2" />
                                        <p className="text-sm">Simulation Ready</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ScenarioGenerationLeftPanel;