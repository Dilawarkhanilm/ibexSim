import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FileText,
    Map,
    X,
    FileVideo
} from 'lucide-react';

interface SimulationConfig {
    map: string;
    weather: string;
    trafficBehaviour: string;
    enableFaultInjection: boolean;
    selectedFault: string;
    trafficDensity: string;
    trafficType: string;
    simulationTime: number;
    perceptionAlgorithm: string;
    selectedVideo?: VideoReference | null;
}

interface VideoReference {
    id: string;
    name: string;
    url: string;
    duration: string;
    thumbnail: string;
}

interface DriveLabRightPanelProps {
    simulationConfig: SimulationConfig;
    onConfigChange: (key: keyof SimulationConfig, value: any) => void;
    isSimulating?: boolean;
    onTaskUpdate?: (taskName: string) => void;
}

const DriveLabRightPanel: React.FC<DriveLabRightPanelProps> = ({
    simulationConfig,
    onConfigChange,
    isSimulating = false,
    onTaskUpdate
}) => {
    const [activeTab, setActiveTab] = useState<'default' | 'tce'>('default');
    const [showVideoModal, setShowVideoModal] = useState(false);

    // Video catalog for TCE
    const videoCatalog: VideoReference[] = [
        {
            id: '1',
            name: 'Urban Traffic Scene',
            url: 'https://www.ibexvision.ai/assets/Real_Video-dMyhcSxc.mp4',
            duration: '2:34',
            thumbnail: '/api/placeholder/160/90'
        },
        {
            id: '2',
            name: 'Highway Intersection',
            url: 'https://www.ibexvision.ai/assets/Real_Video-dMyhcSxc.mp4',
            duration: '1:45',
            thumbnail: '/api/placeholder/160/90'
        },
        {
            id: '3',
            name: 'City Center Traffic',
            url: 'https://www.ibexvision.ai/assets/Real_Video-dMyhcSxc.mp4',
            duration: '3:12',
            thumbnail: '/api/placeholder/160/90'
        }
    ];

    const handleConfigChange = (key: keyof SimulationConfig, value: any) => {
        onConfigChange(key, value);
    };

    const handleVideoSelect = (video: VideoReference) => {
        if (isSimulating) return;
        setShowVideoModal(false);
        handleConfigChange('selectedVideo', video);
        onTaskUpdate?.(`Video selected: ${video.name}`);
    };

    const handleClearVideo = () => {
        if (isSimulating) return;
        handleConfigChange('selectedVideo', null);
    };

    const selectedVideo = simulationConfig.selectedVideo;

    return (
        <div className={`w-80 bg-zinc-900 border-l border-zinc-800 h-full flex flex-col ${isSimulating ? 'opacity-60' : ''}`}>
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex-shrink-0">
                <h3 className="text-sm font-medium text-zinc-200">Configuration</h3>
                {isSimulating && (
                    <p className="text-xs text-orange-400 mt-1">Simulation in progress...</p>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-zinc-800">
                <button
                    onClick={() => setActiveTab('default')}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${activeTab === 'default'
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                    disabled={isSimulating}
                >
                    Default
                </button>
                <button
                    onClick={() => setActiveTab('tce')}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${activeTab === 'tce'
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                    disabled={isSimulating}
                >
                    TCE
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {activeTab === 'default' && (
                    <>
                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Type</Label>
                            <Select
                                value={simulationConfig.map}
                                onValueChange={(value) => handleConfigChange('map', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Street" className='text-xs'>Street</SelectItem>
                                    <SelectItem value="Highway" className='text-xs'>Highway</SelectItem>
                                    <SelectItem value="Urban" className='text-xs'>Urban</SelectItem>
                                    <SelectItem value="Rural" className='text-xs'>Rural</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Weather</Label>
                            <Select
                                value={simulationConfig.weather}
                                onValueChange={(value) => handleConfigChange('weather', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Default" className='text-xs'>Default</SelectItem>
                                    <SelectItem value="Sunny" className='text-xs'>Sunny</SelectItem>
                                    <SelectItem value="Rainy" className='text-xs'>Rainy</SelectItem>
                                    <SelectItem value="Foggy" className='text-xs'>Foggy</SelectItem>
                                    <SelectItem value="Snowy" className='text-xs'>Snowy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Traffic Behaviour</Label>
                            <Select
                                value={simulationConfig.trafficBehaviour}
                                onValueChange={(value) => handleConfigChange('trafficBehaviour', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Mixed Behaviour" className='text-xs'>Mixed Behaviour</SelectItem>
                                    <SelectItem value="Aggressive" className='text-xs'>Aggressive</SelectItem>
                                    <SelectItem value="Conservative" className='text-xs'>Conservative</SelectItem>
                                    <SelectItem value="Normal" className='text-xs'>Normal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Traffic Behaviour</Label>
                            <div className="flex items-center space-x-1">
                                <Checkbox
                                    id="fault-injection"
                                    checked={simulationConfig.enableFaultInjection}
                                    onCheckedChange={(checked) => handleConfigChange('enableFaultInjection', checked)}
                                    disabled={isSimulating}
                                />
                                <Label htmlFor="fault-injection" className={`text-xs text-zinc-400 capitalize ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    Enable Fault Injection
                                </Label>
                            </div>
                        </div>

                        {simulationConfig.enableFaultInjection && (
                            <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                                <Label className="text-xs text-zinc-300">Select Fault</Label>
                                <Select
                                    value={simulationConfig.selectedFault}
                                    onValueChange={(value) => handleConfigChange('selectedFault', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                        <SelectValue placeholder="Select Fault" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                        <SelectItem value="sensor_failure" className='text-xs'>Sensor Failure</SelectItem>
                                        <SelectItem value="communication_loss" className='text-xs'>Communication Loss</SelectItem>
                                        <SelectItem value="brake_malfunction" className='text-xs'>Brake Malfunction</SelectItem>
                                        <SelectItem value="engine_failure" className='text-xs'>Engine Failure</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Traffic Density</Label>
                            <Select
                                value={simulationConfig.trafficDensity}
                                onValueChange={(value) => handleConfigChange('trafficDensity', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Less Dense" className='text-xs'>Less Dense</SelectItem>
                                    <SelectItem value="Medium Dense" className='text-xs'>Medium Dense</SelectItem>
                                    <SelectItem value="High Dense" className='text-xs'>High Dense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Traffic Type</Label>
                            <Select
                                value={simulationConfig.trafficType}
                                onValueChange={(value) => handleConfigChange('trafficType', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="No Bikes" className='text-xs'>No Bikes</SelectItem>
                                    <SelectItem value="With Bikes" className='text-xs'>With Bikes</SelectItem>
                                    <SelectItem value="Mixed Traffic" className='text-xs'>Mixed Traffic</SelectItem>
                                    <SelectItem value="Cars Only" className='text-xs'>Cars Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Simulation Time (seconds)</Label>
                            <Input
                                type="number"
                                value={simulationConfig.simulationTime}
                                onChange={(e) => handleConfigChange('simulationTime', parseInt(e.target.value))}
                                className={`h-8 text-xs bg-zinc-800 border-zinc-700 placeholder:text-xs no-spinner ${isSimulating ? 'cursor-not-allowed' : ''}`}
                                min="1"
                                max="3600"
                                disabled={isSimulating}
                            />
                        </div>

                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Perception Algorithm</Label>
                            <Select
                                value={simulationConfig.perceptionAlgorithm}
                                onValueChange={(value) => handleConfigChange('perceptionAlgorithm', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Default" className='text-xs'>Default</SelectItem>
                                    <SelectItem value="YOLO" className='text-xs'>YOLO</SelectItem>
                                    <SelectItem value="R-CNN" className='text-xs'>R-CNN</SelectItem>
                                    <SelectItem value="SSD" className='text-xs'>SSD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`w-full h-8 text-xs border-zinc-600 ${simulationConfig.perceptionAlgorithm === 'Default' || isSimulating
                                ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
                                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                                }`}
                            disabled={simulationConfig.perceptionAlgorithm === 'Default' || isSimulating}
                        >
                            <FileText className="w-3 h-3 mr-1" />
                            OPEN JUPYTER NOTEBOOK
                        </Button>

                    </>
                )}

                {activeTab === 'tce' && (
                    <>
                        {/* Video Selection from Catalog Only */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Select Video Reference</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    size="sm"
                                    className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setShowVideoModal(true)}
                                    disabled={isSimulating}
                                >
                                    <Map className="w-3 h-3 mr-1" />
                                    Browse Video Catalog
                                </Button>

                                {selectedVideo && (
                                    <div className="p-2 bg-zinc-700/50 rounded border border-zinc-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                <FileVideo className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-zinc-200 truncate font-medium">
                                                        {selectedVideo.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">
                                                        Duration: {selectedVideo.duration}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-5 w-5 p-0 hover:bg-red-600/20 flex-shrink-0"
                                                onClick={handleClearVideo}
                                                disabled={isSimulating}
                                            >
                                                <X className="w-3 h-3 text-red-400" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>


                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Traffic Density</Label>
                            <Select
                                value={simulationConfig.weather}
                                onValueChange={(value) => handleConfigChange('weather', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Default" className='text-xs'>Default</SelectItem>
                                    <SelectItem value="Sunny" className='text-xs'>Sunny</SelectItem>
                                    <SelectItem value="Rainy" className='text-xs'>Rainy</SelectItem>
                                    <SelectItem value="Foggy" className='text-xs'>Foggy</SelectItem>
                                    <SelectItem value="Snowy" className='text-xs'>Snowy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Perception Algorithm */}
                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Perception Algorithm</Label>
                            <Select
                                value={simulationConfig.perceptionAlgorithm}
                                onValueChange={(value) => handleConfigChange('perceptionAlgorithm', value)}
                                disabled={isSimulating}
                            >
                                <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="Default" className='text-xs'>Default</SelectItem>
                                    <SelectItem value="YOLO" className='text-xs'>YOLO</SelectItem>
                                    <SelectItem value="R-CNN" className='text-xs'>R-CNN</SelectItem>
                                    <SelectItem value="SSD" className='text-xs'>SSD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`w-full h-8 text-xs border-zinc-600 ${simulationConfig.perceptionAlgorithm === 'Default' || isSimulating
                                ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
                                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                                }`}
                            disabled={simulationConfig.perceptionAlgorithm === 'Default' || isSimulating}
                        >
                            <FileText className="w-3 h-3 mr-1" />
                            OPEN JUPYTER NOTEBOOK
                        </Button>
                       
                        <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                            <Label className="text-xs text-zinc-300">Traffic Behaviour</Label>
                            <div className="flex items-center space-x-1">
                                <Checkbox
                                    id="fault-injection"
                                    checked={simulationConfig.enableFaultInjection}
                                    onCheckedChange={(checked) => handleConfigChange('enableFaultInjection', checked)}
                                    disabled={isSimulating}
                                />
                                <Label htmlFor="fault-injection" className={`text-xs text-zinc-400 capitalize ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                    Enable Fault Injection
                                </Label>
                            </div>
                        </div>

                        {simulationConfig.enableFaultInjection && (
                            <div className={`space-y-2 ${isSimulating ? 'opacity-50' : ''}`}>
                                <Label className="text-xs text-zinc-300">Select Fault</Label>
                                <Select
                                    value={simulationConfig.selectedFault}
                                    onValueChange={(value) => handleConfigChange('selectedFault', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className={`h-8 text-xs bg-zinc-800 border-zinc-700 w-full ${isSimulating ? 'cursor-not-allowed' : ''}`}>
                                        <SelectValue placeholder="Select Fault" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                        <SelectItem value="sensor_failure" className='text-xs'>Sensor Failure</SelectItem>
                                        <SelectItem value="communication_loss" className='text-xs'>Communication Loss</SelectItem>
                                        <SelectItem value="brake_malfunction" className='text-xs'>Brake Malfunction</SelectItem>
                                        <SelectItem value="engine_failure" className='text-xs'>Engine Failure</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Video Catalog Modal */}
            {showVideoModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-[600px] h-[500px] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                            <h3 className="text-lg font-semibold text-zinc-200">Video Reference Catalog</h3>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowVideoModal(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="grid gap-3">
                                {videoCatalog.map((video) => (
                                    <div
                                        key={video.id}
                                        className="border border-zinc-700 rounded-lg p-3 hover:border-zinc-600 cursor-pointer transition-colors"
                                        onClick={() => handleVideoSelect(video)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-20 h-12 bg-zinc-700 rounded overflow-hidden relative">
                                                <video
                                                    src={video.url}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    preload="metadata"
                                                    onLoadedData={(e) => {
                                                        const videoElement = e.target as HTMLVideoElement;
                                                        videoElement.currentTime = 1;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <FileVideo className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-zinc-200">{video.name}</h4>
                                                <p className="text-xs text-zinc-400">Duration: {video.duration}</p>
                                                <p className="text-xs text-zinc-500 truncate mt-1">{video.url}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriveLabRightPanel;