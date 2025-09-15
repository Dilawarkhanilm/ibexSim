import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Upload,
    X,
    FileVideo,
    Plus
} from 'lucide-react';

interface VideoFile {
    id: string;
    file: File;
    name: string;
    size: number;
    duration?: number;
}

interface CESRightPanelProps {
    onVideosChange?: (videos: VideoFile[]) => void;
    onFiltersChange?: (filters: string[]) => void;
    isPlaybackActive?: boolean;
}

const CESRightPanel: React.FC<CESRightPanelProps> = ({ onVideosChange, onFiltersChange, isPlaybackActive = false }) => {
    const [confidenceThreshold, setConfidenceThreshold] = useState([50]);
    const [selectedModel, setSelectedModel] = useState('FlowWatch-Mini');
    const [clipDuration, setClipDuration] = useState('60');
    const [videoQuality, setVideoQuality] = useState({
        low: true,
        medium: false,
        high: false
    });
    const [batchProcessing, setBatchProcessing] = useState(true);
    const [autoPause, setAutoPause] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);
    const [uploadedVideos, setUploadedVideos] = useState<VideoFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleVideoQualityChange = (
        quality: 'low' | 'medium' | 'high',
        checked: boolean
    ) => {
        if (isPlaybackActive) return; // Disable during playback
        
        setVideoQuality((prev) => {
            if (checked) {
                return {
                    low: quality === 'low',
                    medium: quality === 'medium',
                    high: quality === 'high',
                };
            }
            if (prev[quality]) return prev;

            return prev;
        });
    };

    const generateVideoId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    const handleFileUpload = (files: FileList) => {
        if (isPlaybackActive) return; // Disable during playback
        
        const videoFiles: VideoFile[] = [];
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('video/')) {
                const videoFile: VideoFile = {
                    id: generateVideoId(),
                    file: file,
                    name: file.name,
                    size: file.size
                };
                videoFiles.push(videoFile);
            }
        });

        if (videoFiles.length > 0) {
            const updatedVideos = [...uploadedVideos, ...videoFiles];
            setUploadedVideos(updatedVideos);
            onVideosChange?.(updatedVideos);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isPlaybackActive) return; // Disable during playback
        
        const files = event.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        if (isPlaybackActive) return; // Disable during playback
        
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        if (isPlaybackActive) return; // Disable during playback
        
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        if (isPlaybackActive) return; // Disable during playback
        
        event.preventDefault();
        setIsDragOver(false);
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files);
        }
    };

    const handleUploadButtonClick = () => {
        if (isPlaybackActive) return; // Disable during playback
        fileInputRef.current?.click();
    };

    const handleDeleteVideo = (videoId: string) => {
        if (isPlaybackActive) return; // Disable during playback
        
        const updatedVideos = uploadedVideos.filter(video => video.id !== videoId);
        setUploadedVideos(updatedVideos);
        onVideosChange?.(updatedVideos);
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteAllVideos = () => {
        if (isPlaybackActive) return; // Disable during playback
        
        setUploadedVideos([]);
        onVideosChange?.([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filterOptions = [
        'All',
        'Biker-Four-Wheeler Clash',
        'Obstacle Collision',
        'Out of Control - Left/ Right Deviation',
        'Oncoming Vehicle Clash',
        'Pedestrian-Vehicle Clash'
    ];

    const filterColors = {
        'All': 'text-zinc-300',
        'Biker-Four-Wheeler Clash': 'text-red-400',
        'Obstacle Collision': 'text-orange-400',
        'Out of Control - Left/ Right Deviation': 'text-yellow-400',
        'Oncoming Vehicle Clash': 'text-purple-400',
        'Pedestrian-Vehicle Clash': 'text-pink-400'
    };

    const handleFilterChange = (filter: string) => {
        if (isPlaybackActive) return; // Disable during playback
        
        let newFilters: string[];
        
        if (filter === 'All') {
            // If 'All' is selected, clear other filters and select only 'All'
            if (selectedFilters.includes('All')) {
                newFilters = []; // Deselect all if 'All' was already selected
            } else {
                newFilters = ['All'];
            }
        } else {
            // If any specific filter is selected, remove 'All' and toggle the filter
            let updatedFilters = selectedFilters.filter(f => f !== 'All');
            
            if (updatedFilters.includes(filter)) {
                // Remove filter if already selected
                updatedFilters = updatedFilters.filter(f => f !== filter);
            } else {
                // Add filter if not selected
                updatedFilters = [...updatedFilters, filter];
            }
            
            newFilters = updatedFilters;
        }
        
        setSelectedFilters(newFilters);
        onFiltersChange?.(newFilters);
    };

    const getCurrentFilterLabel = () => {
        if (selectedFilters.length === 0) {
            return "No Filters Selected";
        } else if (selectedFilters.includes('All')) {
            return "All Filters";
        } else if (selectedFilters.length === 1) {
            return selectedFilters[0];
        } else {
            return `${selectedFilters.length} Filters Selected`;
        }
    };

    const handleConfidenceThresholdChange = (value: number[]) => {
        if (isPlaybackActive) return; // Disable during playback
        setConfidenceThreshold(value);
    };

    const handleModelChange = (value: string) => {
        if (isPlaybackActive) return; // Disable during playback
        setSelectedModel(value);
    };

    const handleClipDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isPlaybackActive) return; // Disable during playback
        
        const val = Number(e.target.value);
        if (val >= 0 || e.target.value === "") {
            setClipDuration(e.target.value);
        }
    };

    const handleBatchProcessingChange = (checked: boolean) => {
        if (isPlaybackActive) return; // Disable during playback
        setBatchProcessing(checked);
    };

    const handleAutoPauseChange = (checked: boolean) => {
        if (isPlaybackActive) return; // Disable during playback
        setAutoPause(checked);
    };

    return (
        <div className={`w-80 bg-zinc-900 border-l border-zinc-800 h-full flex flex-col ${isPlaybackActive ? 'opacity-60' : ''}`}>
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex-shrink-0">
                <h3 className="text-sm font-medium text-zinc-200">Extract Traffic Critical Events (TCEs)</h3>
                {isPlaybackActive && (
                    <p className="text-xs text-orange-400 mt-1">Settings disabled during playback</p>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Upload Section */}
                <Card className={`bg-zinc-800 border-zinc-700 ${isPlaybackActive ? 'opacity-50' : ''}`}>
                    <CardContent className="p-3 space-y-3">
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                className={`flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 ${isPlaybackActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={handleUploadButtonClick}
                                disabled={isPlaybackActive}
                            >
                                <Upload className="w-3 h-3 mr-1" />
                                Upload Videos
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className={`flex-1 h-8 text-xs bg-zinc-700 hover:bg-zinc-600 ${isPlaybackActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isPlaybackActive}
                            >
                                Import from S3
                            </Button>
                        </div>

                        {/* Hidden file input - allow multiple files */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4,video/avi,video/mov,video/wmv,video/mkv"
                            onChange={handleFileInputChange}
                            className="hidden"
                            multiple
                            disabled={isPlaybackActive}
                        />

                        {/* Upload Area or Video List */}
                        {uploadedVideos.length === 0 ? (
                            <div
                                className={`relative p-6 transition-colors ${isPlaybackActive ? 'cursor-not-allowed' : 'cursor-pointer'} ${isDragOver && !isPlaybackActive ? 'bg-zinc-700/50' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleUploadButtonClick}
                            >
                                {/* Corner borders */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Top-left corner */}
                                    <div className="absolute top-0 left-0 w-8 h-8">
                                        <div className={`absolute top-0 left-0 w-8 h-0.5 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute top-0 left-0 w-0.5 h-8 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Top-right corner */}
                                    <div className="absolute top-0 right-0 w-8 h-8">
                                        <div className={`absolute top-0 right-0 w-8 h-0.5 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute top-0 right-0 w-0.5 h-8 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Bottom-left corner */}
                                    <div className="absolute bottom-0 left-0 w-8 h-8">
                                        <div className={`absolute bottom-0 left-0 w-8 h-0.5 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute bottom-0 left-0 w-0.5 h-8 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Bottom-right corner */}
                                    <div className="absolute bottom-0 right-0 w-8 h-8">
                                        <div className={`absolute bottom-0 right-0 w-8 h-0.5 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute bottom-0 right-0 w-0.5 h-8 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Top center */}
                                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    {/* Bottom center */}
                                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    {/* Left center */}
                                    <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    {/* Right center */}
                                    <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 ${isDragOver && !isPlaybackActive ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                </div>

                                <div className="flex flex-col items-center justify-center h-20 space-y-2">
                                    <Upload className={`w-6 h-6 ${isDragOver && !isPlaybackActive ? 'text-blue-400' : 'text-zinc-400'}`} />
                                    <span className={`text-xs ${isDragOver && !isPlaybackActive ? 'text-blue-400' : 'text-zinc-400'}`}>
                                        {isDragOver && !isPlaybackActive ? 'Drop videos here' : 'Upload videos to extract TCE\'s'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-300">
                                        {uploadedVideos.length} video{uploadedVideos.length !== 1 ? 's' : ''} uploaded
                                    </span>
                                    <div className="flex space-x-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className={`h-6 px-2 text-xs text-blue-400 hover:bg-blue-600/20 ${isPlaybackActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={handleUploadButtonClick}
                                            disabled={isPlaybackActive}
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add More
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className={`h-6 px-2 text-xs text-red-400 hover:bg-red-600/20 ${isPlaybackActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={handleDeleteAllVideos}
                                            disabled={isPlaybackActive}
                                        >
                                            <X className="w-3 h-3 mr-1" />
                                            Clear All
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="max-h-32 overflow-y-auto space-y-1">
                                    {uploadedVideos.map((video) => (
                                        <div key={video.id} className="flex items-center justify-between p-2 bg-zinc-700/50 rounded">
                                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                <FileVideo className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-zinc-200 truncate font-medium">
                                                        {video.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">
                                                        {formatFileSize(video.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={`h-5 w-5 p-0 hover:bg-red-600/20 flex-shrink-0 ${isPlaybackActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => handleDeleteVideo(video.id)}
                                                disabled={isPlaybackActive}
                                            >
                                                <X className="w-3 h-3 text-red-400" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Model Selection */}
                <div className={`space-y-2 ${isPlaybackActive ? 'opacity-50' : ''}`}>
                    <Label className="text-xs text-zinc-300">Select AI Model</Label>
                    <Select value={selectedModel} onValueChange={handleModelChange} disabled={isPlaybackActive}>
                        <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isPlaybackActive ? 'cursor-not-allowed' : ''}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="FlowWatch-Mini" className='text-xs'>FlowWatch-Mini</SelectItem>
                            <SelectItem value="FlowWatch-Pro" className='text-xs'>FlowWatch-Pro</SelectItem>
                            <SelectItem value="FlowWatch-Max" className='text-xs'>FlowWatch-Max</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Confidence Threshold */}
                <div className={`space-y-2 ${isPlaybackActive ? 'opacity-50' : ''}`}>
                    <Label className="text-xs text-zinc-300">
                        Confidence Threshold: {confidenceThreshold[0]}%
                    </Label>
                    <Slider
                        value={confidenceThreshold}
                        onValueChange={handleConfidenceThresholdChange}
                        max={100}
                        step={1}
                        className="w-full"
                        disabled={isPlaybackActive}
                    />
                </div>

                {/* Clip Duration */}
                <div className={`space-y-2 ${isPlaybackActive ? 'opacity-50' : ''}`}>
                    <Label className="text-xs text-zinc-300">Clip Duration (seconds)</Label>
                    <Input
                        type="number"
                        value={clipDuration}
                        onChange={handleClipDurationChange}
                        min={1}
                        placeholder="Enter duration"
                        className={`h-8 text-xs bg-zinc-800 border-zinc-700 placeholder:text-xs no-spinner ${isPlaybackActive ? 'cursor-not-allowed' : ''}`}
                        disabled={isPlaybackActive}
                    />
                </div>

                {/* Video Quality */}
                <div className={`space-y-2 ${isPlaybackActive ? 'opacity-50' : ''}`}>
                    <Label className="text-xs text-zinc-300">Video Quality</Label>
                    <div className="flex space-x-3">
                        {(['low', 'medium', 'high'] as const).map((quality) => (
                            <div key={quality} className="flex items-center space-x-1">
                                <Checkbox
                                    id={quality}
                                    checked={videoQuality[quality]}
                                    onCheckedChange={(checked) =>
                                        handleVideoQualityChange(quality, checked === true)
                                    }
                                    disabled={isPlaybackActive}
                                />
                                <Label htmlFor={quality} className={`text-xs text-zinc-400 capitalize ${isPlaybackActive ? 'cursor-not-allowed' : ''}`}>
                                    {quality}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Processing Options */}
                <div className={`space-y-2 ${isPlaybackActive ? 'opacity-50' : ''}`}>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="batch-processing"
                            checked={batchProcessing}
                            onCheckedChange={handleBatchProcessingChange}
                            disabled={isPlaybackActive}
                        />
                        <Label htmlFor="batch-processing" className={`text-xs text-zinc-400 ${isPlaybackActive ? 'cursor-not-allowed' : ''}`}>
                            Batch Processing
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="auto-pause"
                            checked={autoPause}
                            onCheckedChange={handleAutoPauseChange}
                            disabled={isPlaybackActive}
                        />
                        <Label htmlFor="auto-pause" className={`text-xs text-zinc-400 ${isPlaybackActive ? 'cursor-not-allowed' : ''}`}>
                            Auto-Pause
                        </Label>
                    </div>
                </div>

                {/* Filter */}
                <div className={`space-y-2 ${isPlaybackActive ? 'opacity-50' : ''}`}>
                    <Label className="text-xs text-zinc-300">Anomaly Type Filters</Label>
                    <Select 
                        value="" // Always empty to allow clicking on any option
                        onValueChange={handleFilterChange}
                        disabled={isPlaybackActive}
                    >
                        <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isPlaybackActive ? 'cursor-not-allowed' : ''}`}>
                            <SelectValue placeholder={getCurrentFilterLabel()} />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                            {filterOptions.map((option) => (
                                <SelectItem 
                                    key={option} 
                                    value={option} 
                                    className={`text-xs cursor-pointer transition-all ${
                                        selectedFilters.includes(option)
                                            ? 'bg-blue-600/30 text-blue-200 border-l-4 border-blue-500 font-medium'
                                            : `${filterColors[option as keyof typeof filterColors]} hover:bg-zinc-700 hover:text-white`
                                    }`}
                                >
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    {/* Filter Preview */}
                    {selectedFilters.length > 0 && !selectedFilters.includes('All') && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {selectedFilters.map((filter) => (
                                <span 
                                    key={filter}
                                    className={`px-2 py-1 rounded-full text-xs font-medium bg-opacity-20 ${
                                        filterColors[filter as keyof typeof filterColors]
                                    } ${
                                        filter === 'Biker-Four-Wheeler Clash' ? 'bg-red-500/20' :
                                        filter === 'Obstacle Collision' ? 'bg-orange-500/20' :
                                        filter === 'Out of Control - Left/ Right Deviation' ? 'bg-yellow-500/20' :
                                        filter === 'Oncoming Vehicle Clash' ? 'bg-purple-500/20' :
                                        filter === 'Pedestrian-Vehicle Clash' ? 'bg-pink-500/20' :
                                        'bg-zinc-500/20'
                                    } ${isPlaybackActive ? 'opacity-50' : ''}`}
                                >
                                    {filter}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CESRightPanel;