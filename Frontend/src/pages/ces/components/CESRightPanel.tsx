// Frontend/src/pages/ces/components/CESRightPanel.tsx
import React, { useState } from 'react';
import { Upload, Play } from 'lucide-react';

const CESRightPanel: React.FC = () => {
    const [confidenceThreshold, setConfidenceThreshold] = useState(50);
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

    const handleVideoQualityChange = (quality: 'low' | 'medium' | 'high') => {
        setVideoQuality(prev => ({
            ...prev,
            [quality]: !prev[quality]
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
        <div className="w-80 bg-gray-800 border-l border-gray-700 h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <h3 className="text-lg font-medium text-white">Extract Traffic Critical Events (TCEs)</h3>
            </div>

            {/* Sidebar Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Upload Section */}
                <div>
                    <div className="flex space-x-2 mb-4">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload by file
                        </button>
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded text-sm transition-colors">
                            Import from S3
                        </button>
                    </div>

                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <p className="text-sm text-gray-400 mb-4">Upload your video to extract TCE's</p>
                        <div className="bg-gray-700 border-2 border-dashed border-gray-500 rounded h-32 flex items-center justify-center">
                            <span className="text-gray-400">Upload your video</span>
                        </div>
                    </div>
                </div>

                {/* AI Model Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-white">Select AI Model</label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                        <option value="FlowWatch-Mini">FlowWatch-Mini</option>
                        <option value="FlowWatch-Pro">FlowWatch-Pro</option>
                        <option value="FlowWatch-Max">FlowWatch-Max</option>
                    </select>
                </div>

                {/* Confidence Threshold */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                        Confidence Threshold: {confidenceThreshold}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer ces-slider"
                    />
                </div>

                {/* Clip Duration */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-white">Clip Duration (seconds)</label>
                    <input
                        type="number"
                        value={clipDuration}
                        onChange={(e) => setClipDuration(e.target.value)}
                        placeholder="Enter duration"
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                </div>

                {/* Video Quality */}
                <div>
                    <label className="block text-sm font-medium mb-3 text-white">Video Quality</label>
                    <div className="flex space-x-4">
                        {(['low', 'medium', 'high'] as const).map((quality) => (
                            <label key={quality} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={videoQuality[quality]}
                                    onChange={() => handleVideoQualityChange(quality)}
                                    className="mr-2 w-4 h-4"
                                />
                                <span className="text-sm text-gray-300 capitalize">{quality}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Processing Options */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="batch-processing"
                            checked={batchProcessing}
                            onChange={(e) => setBatchProcessing(e.target.checked)}
                            className="mr-3 w-4 h-4"
                        />
                        <label htmlFor="batch-processing" className="text-sm text-gray-300">
                            Batch Processing
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="auto-pause"
                            checked={autoPause}
                            onChange={(e) => setAutoPause(e.target.checked)}
                            className="mr-3 w-4 h-4"
                        />
                        <label htmlFor="auto-pause" className="text-sm text-gray-300">
                            Auto-Pause
                        </label>
                    </div>
                </div>

                {/* Filter */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-white">Filter</label>
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    >
                        {filterOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Play Button */}
                <div className="pb-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 font-medium">
                        <Play className="w-4 h-4" />
                        Play
                    </button>
                </div>
            </div>

            {/* Custom Styles for Slider */}
            <style>{`
                .ces-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                }
                
                .ces-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                }
            `}</style>
        </div>
    );
};

export default CESRightPanel;