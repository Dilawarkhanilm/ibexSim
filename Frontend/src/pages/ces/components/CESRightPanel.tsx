import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Upload,
    Play
} from 'lucide-react';

const CESRightPanel: React.FC = () => {
    const [confidenceThreshold, setConfidenceThreshold] = useState([50]);
    const [selectedModel, setSelectedModel] = useState('FlowWatch-Mini');
    const [clipDuration, setClipDuration] = useState('');
    const [videoQuality, setVideoQuality] = useState({
        low: true,
        medium: false,
        high: false
    });
    const [batchProcessing, setBatchProcessing] = useState(true);
    const [autoPause, setAutoPause] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const handleVideoQualityChange = (quality: 'low' | 'medium' | 'high', checked: boolean) => {
        setVideoQuality(prev => ({
            ...prev,
            [quality]: checked
        }));
    };

    const filterOptions = [
        'All',
        'Biker-Four-Wheeler Clash',
        'Obstacle Collision',
        'Out of Control - Left/ Right Deviation',
        'Oncoming Vehicle Clash',
        'Pedestrian-Vehicle Clash'
    ];

    return (
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 h-full flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex-shrink-0">
                <h3 className="text-sm font-medium text-zinc-200">Extract Traffic Critical Events (TCEs)</h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Upload Section */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-3 space-y-3">
                        <div className="flex space-x-2">
                            <Button size="sm" className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700">
                                <Upload className="w-3 h-3 mr-1" />
                                Upload by file
                            </Button>
                            <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs bg-zinc-700 hover:bg-zinc-600">
                                Import from S3
                            </Button>
                        </div>

                        {/* Stylized Upload Area */}
                        <div className="relative p-6">
                            {/* Corner borders */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Top-left corner */}
                                <div className="absolute top-0 left-0 w-8 h-8">
                                    <div className="absolute top-0 left-0 w-8 h-0.5 bg-zinc-600"></div>
                                    <div className="absolute top-0 left-0 w-0.5 h-8 bg-zinc-600"></div>
                                </div>
                                {/* Top-right corner */}
                                <div className="absolute top-0 right-0 w-8 h-8">
                                    <div className="absolute top-0 right-0 w-8 h-0.5 bg-zinc-600"></div>
                                    <div className="absolute top-0 right-0 w-0.5 h-8 bg-zinc-600"></div>
                                </div>
                                {/* Bottom-left corner */}
                                <div className="absolute bottom-0 left-0 w-8 h-8">
                                    <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-zinc-600"></div>
                                    <div className="absolute bottom-0 left-0 w-0.5 h-8 bg-zinc-600"></div>
                                </div>
                                {/* Bottom-right corner */}
                                <div className="absolute bottom-0 right-0 w-8 h-8">
                                    <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-zinc-600"></div>
                                    <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-zinc-600"></div>
                                </div>
                                {/* Top center */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-zinc-600"></div>
                                {/* Bottom center */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-zinc-600"></div>
                                {/* Left center */}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 bg-zinc-600"></div>
                                {/* Right center */}
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 bg-zinc-600"></div>
                            </div>
                            
                            {/* Center content */}
                            <div className="flex flex-col items-center justify-center h-20 space-y-2">
                                <Upload className="w-6 h-6 text-zinc-400" />
                                <span className="text-xs text-zinc-400">Upload video to extract TCE's</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Model Selection */}
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Select AI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700 w-full">
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
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">
                        Confidence Threshold: {confidenceThreshold[0]}%
                    </Label>
                    <Slider
                        value={confidenceThreshold}
                        onValueChange={setConfidenceThreshold}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Clip Duration */}
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Clip Duration (seconds)</Label>
                    <Input
                        type="number"
                        value={clipDuration}
                        onChange={(e) => setClipDuration(e.target.value)}
                        placeholder="Enter duration"
                        className="h-8 text-xs bg-zinc-800 border-zinc-700"
                    />
                </div>

                {/* Video Quality */}
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Video Quality</Label>
                    <div className="flex space-x-3">
                        {(['low', 'medium', 'high'] as const).map((quality) => (
                            <div key={quality} className="flex items-center space-x-1">
                                <Checkbox
                                    id={quality}
                                    checked={videoQuality[quality]}
                                    onCheckedChange={(checked) => handleVideoQualityChange(quality, checked as boolean)}
                                    // className="h-3 w-3"
                                />
                                <Label htmlFor={quality} className="text-xs text-zinc-400 capitalize">
                                    {quality}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Processing Options */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="batch-processing"
                            checked={batchProcessing}
                            onCheckedChange={(checked) => setBatchProcessing(checked === true)}
                            // className="h-3 w-3"
                        />
                        <Label htmlFor="batch-processing" className="text-xs text-zinc-400">
                            Batch Processing
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="auto-pause"
                            checked={autoPause}
                            onCheckedChange={(checked) => setAutoPause(checked === true)}
                            // className="h-3 w-3"
                        />
                        <Label htmlFor="auto-pause" className="text-xs text-zinc-400">
                            Auto-Pause
                        </Label>
                    </div>
                </div>

                {/* Filter */}
                <div className="space-y-2 ">
                    <Label className="text-xs text-zinc-300">Filter</Label>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700 w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                            {filterOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-xs">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Play Button */}
                <Button className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Play
                </Button>
            </div>
        </div>
    );
};

export default CESRightPanel;