import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
    Car,
    Box,
    Camera,
    Radar,
    Zap,
    ChevronLeft,
    ChevronRight,
    Settings,
    X
} from 'lucide-react';

interface SelectedVehicle {
    id: string;
    name: string;
    type: string;
    model: string;
}

interface AddOnConfig {
    id: string;
    name: string;
    type: 'camera' | 'radar' | 'lidar';
    enabled: boolean;
    config?: any;
}

interface EnvironmentParameters {
    cloudiness: number;
    precipitation: number;
    sunAltitude: number;
    sunAzimuth: number;
    precipitationDeposits: number;
    windIntensity: number;
    fogDensity: number;
    wetness: number;
}

interface DriveLabLeftPanelProps {
    selectedVehicle?: SelectedVehicle | null;
    addOns?: AddOnConfig[];
    onVehicleSelect?: (vehicle: SelectedVehicle) => void;
    onAddOnToggle?: (addOnId: string, enabled: boolean) => void;
    isSimulating?: boolean;
    onTaskUpdate?: (taskName: string) => void;
}

interface FeedView {
    id: string;
    name: string;
    video: string;
    icon: React.ComponentType<any>;
}

const DriveLabLeftPanel: React.FC<DriveLabLeftPanelProps> = ({
    selectedVehicle,
    addOns = [],
    onVehicleSelect,
    onAddOnToggle,
    isSimulating = false,
    onTaskUpdate
}) => {
    const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
    const [show3DModel, setShow3DModel] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState<string>('camera');
    const [showParametersModal, setShowParametersModal] = useState(false);
    const [environmentParams, setEnvironmentParams] = useState<EnvironmentParameters>({
        cloudiness: 50,
        precipitation: 0,
        sunAltitude: 45,
        sunAzimuth: 180,
        precipitationDeposits: 0,
        windIntensity: 20,
        fogDensity: 0,
        wetness: 0
    });

    // Sample vehicles data
    const availableVehicles: SelectedVehicle[] = [
        { id: 'sedan_1', name: 'Sedan Model A', type: 'Sedan', model: 'Standard' },
        { id: 'suv_1', name: 'SUV Model B', type: 'SUV', model: 'Premium' },
        { id: 'truck_1', name: 'Truck Model C', type: 'Truck', model: 'Heavy Duty' },
        { id: 'sports_1', name: 'Sports Car D', type: 'Sports', model: 'Performance' }
    ];

    // Feed data for simulation view
    const feedViews: FeedView[] = [
        {
            id: 'camera',
            name: 'Camera Feed',
            video: 'https://www.ibexvision.ai/assets/Cameras_Video-D9H3KlGC.mp4',
            icon: Camera
        },
        {
            id: 'radar',
            name: 'Radar Feed',
            video: 'https://www.ibexvision.ai/assets/radar_feed-C8jwOtqK.mp4',
            icon: Radar
        },
        {
            id: 'lidar',
            name: 'Lidar Feed',
            video: 'https://www.ibexvision.ai/assets/lidar_feed-CnxU1ngo.mp4',
            icon: Zap
        },
        {
            id: 'combined',
            name: 'Combined View',
            video: 'https://www.ibexvision.ai/assets/Combined_Video-Doxscma3.mp4',
            icon: Box
        }
    ];

    const handleVehicleSelect = (vehicle: SelectedVehicle) => {
        if (isSimulating) return;
        onVehicleSelect?.(vehicle);
    };

    const handlePreviousVehicle = () => {
        if (isSimulating) return;
        const newIndex = currentVehicleIndex > 0 ? currentVehicleIndex - 1 : availableVehicles.length - 1;
        setCurrentVehicleIndex(newIndex);
        handleVehicleSelect(availableVehicles[newIndex]);
    };

    const handleNextVehicle = () => {
        if (isSimulating) return;
        const newIndex = currentVehicleIndex < availableVehicles.length - 1 ? currentVehicleIndex + 1 : 0;
        setCurrentVehicleIndex(newIndex);
        handleVehicleSelect(availableVehicles[newIndex]);
    };

    const handle3DModelClick = () => {
        if (!isSimulating) {
            setShow3DModel(true);
        }
    };

    const handleFeedSelect = (feedId: string) => {
        setSelectedFeed(feedId);
    };

    const handleParameterChange = (paramKey: keyof EnvironmentParameters, value: number[]) => {
        setEnvironmentParams(prev => ({
            ...prev,
            [paramKey]: value[0]
        }));
    };

    const handleParametersClick = () => {
        if (!isSimulating) {
            setShowParametersModal(true);
        }
    };

    // Auto-select first vehicle on mount
    useEffect(() => {
        if (!selectedVehicle && availableVehicles.length > 0 && !isSimulating) {
            handleVehicleSelect(availableVehicles[0]);
        }
    }, []);

    // Set default feed to camera when simulation starts
    useEffect(() => {
        if (isSimulating) {
            setSelectedFeed('camera');
        }
    }, [isSimulating]);

    return (
        <div className="flex-1 p-4 overflow-auto space-y-4">
            {/* Selected Vehicle Section */}
            <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300">
                <CardHeader className="">
                    <CardTitle className="text-sm text-zinc-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Car size={16} />
                            <span>Select Vehicle</span>
                        </div>
                        {/* Parameters Button - Only show when vehicle is selected and not simulating */}
                        {selectedVehicle && !isSimulating && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleParametersClick}
                                className="h-7 px-2 text-xs bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                            >
                                <Settings size={12} className="mr-1" />
                                Parameters
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!selectedVehicle ? (
                        <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg h-80 flex items-center justify-center">
                            <div className="text-center text-zinc-400">
                                <Car className="w-16 h-16 mx-auto mb-3" />
                                <h3 className="text-lg font-medium mb-2">No Vehicle Selected</h3>
                                <p className="text-sm">Use the navigation arrows to select a vehicle</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Vehicle Navigation - Only show when not simulating */}
                            {!isSimulating && (
                                <div className="flex items-center justify-between mb-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousVehicle}
                                        className="h-8 w-8 p-0 bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-xs text-zinc-400">
                                            {currentVehicleIndex + 1} of {availableVehicles.length}
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextVehicle}
                                        className="h-8 w-8 p-0 bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Main Display Area with Feed Selection Side by Side */}
                            <div className="flex gap-4 mb-4">
                                {/* Main Video Display - Left Side */}
                                <div className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg h-160 relative overflow-hidden">
                                    {isSimulating ? (
                                        selectedFeed === 'combined' ? (
                                            // Show 2x2 matrix of all feeds for combined view
                                            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                                                <div className="relative border-r border-b border-zinc-600">
                                                    <video
                                                        src={feedViews.find(f => f.id === 'camera')?.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        className="absolute inset-0 w-full h-full object-contain"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                                                        Camera
                                                    </div>
                                                </div>
                                                <div className="relative border-b border-zinc-600">
                                                    <video
                                                        src={feedViews.find(f => f.id === 'radar')?.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        className="absolute inset-0 w-full h-full object-contain"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                                                        Radar
                                                    </div>
                                                </div>
                                                <div className="relative border-r border-zinc-600">
                                                    <video
                                                        src={feedViews.find(f => f.id === 'lidar')?.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        className="absolute inset-0 w-full h-full object-contain"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                                                        Lidar
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <video
                                                        src={feedViews.find(f => f.id === 'combined')?.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        className="absolute inset-0 w-full h-full object-contain"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                                                        Combined
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Show selected feed video during simulation
                                            <video
                                                key={selectedFeed}
                                                src={feedViews.find(f => f.id === selectedFeed)?.video}
                                                autoPlay
                                                loop
                                                muted
                                                className="absolute inset-0 w-full h-full object-contain"
                                            />
                                        )
                                    ) : show3DModel ? (
                                        // Show 3D model view
                                        <img
                                            src="https://wallpapers.com/images/featured/3d-car-h706rbre4lzn83ot.jpg"
                                            alt="3D Vehicle Model"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        // Show placeholder with 3D model option
                                        <>
                                            <img
                                                src="https://images.unsplash.com/photo-1549924231-f129b911e442?w=500&h=300&fit=crop"
                                                alt="Vehicle Preview"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-all"
                                                onClick={handle3DModelClick}
                                            >
                                                <div className="text-center text-white">
                                                    <Box className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="text-sm font-medium">Click here to view 3D model</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Feed Selection - Right Side Vertical Layout */}
                                {isSimulating && (
  <div className="w-50 flex flex-col gap-4">
    {feedViews.map((feed) => (
      <button
        key={feed.id}
        onClick={() => handleFeedSelect(feed.id)}
        className={`
          p-2 rounded-lg border transition-all duration-200 
          flex flex-col items-center relative overflow-hidden cursor-pointer
          ${selectedFeed === feed.id
            ? 'bg-blue-600 border-blue-500 text-white'
            : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
          }
        `}
      >
        {/* Video container with adjustable height */}
        <div className="w-full h-30 rounded overflow-hidden relative">
          <video
            src={feed.video}
            muted
            loop
            autoPlay
            className="w-full h-full object-cover"
          />
          
          {/* Label overlay */}
          <div className="absolute top-1 left-1 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
            {feed.name.replace(' Feed', '').replace(' View', '')}
          </div>
        </div>
        
        {/* Selection indicator */}
        {selectedFeed === feed.id && (
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
        )}
      </button>
    ))}
  </div>
)}
                            </div>

                            {/* Vehicle Info with Add-on Icons */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-400">Name:</span>
                                        <span className="text-zinc-300 font-medium">{selectedVehicle.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-zinc-400">Type:</span>
                                        <span className="text-zinc-300">{selectedVehicle.type}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-zinc-400">Model:</span>
                                        <span className="text-zinc-300">{selectedVehicle.model}</span>
                                    </div>
                                </div>

                                {/* Equipment Info - Only show when not simulating */}
                                {!isSimulating && (
                                    <div className="pt-2 border-t border-zinc-700">
                                        <p className="text-xs text-zinc-400 mb-2">Equipment:</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Camera size={12} className="text-blue-400" />
                                                <span className="text-xs text-zinc-300">1x Camera</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Radar size={12} className="text-green-400" />
                                                <span className="text-xs text-zinc-300">1x Radar</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Zap size={12} className="text-yellow-400" />
                                                <span className="text-xs text-zinc-300">1x Lidar</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Environment Parameters Modal */}
            {showParametersModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-[500px] max-h-[600px] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                            <h3 className="text-lg font-semibold text-zinc-200 flex items-center space-x-2">
                                <Settings size={18} />
                                <span>Environment Parameters</span>
                            </h3>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowParametersModal(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-6">
                            {/* Cloudiness */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Cloudiness</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.cloudiness}%</span>
                                </div>
                                <Slider
                                    value={[environmentParams.cloudiness]}
                                    onValueChange={(value) => handleParameterChange('cloudiness', value)}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Precipitation */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Precipitation</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.precipitation}%</span>
                                </div>
                                <Slider
                                    value={[environmentParams.precipitation]}
                                    onValueChange={(value) => handleParameterChange('precipitation', value)}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Sun Altitude */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Sun Altitude</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.sunAltitude}°</span>
                                </div>
                                <Slider
                                    value={[environmentParams.sunAltitude]}
                                    onValueChange={(value) => handleParameterChange('sunAltitude', value)}
                                    max={90}
                                    min={-90}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Sun Azimuth */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Sun Azimuth</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.sunAzimuth}°</span>
                                </div>
                                <Slider
                                    value={[environmentParams.sunAzimuth]}
                                    onValueChange={(value) => handleParameterChange('sunAzimuth', value)}
                                    max={360}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Precipitation Deposits */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Precipitation Deposits</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.precipitationDeposits}%</span>
                                </div>
                                <Slider
                                    value={[environmentParams.precipitationDeposits]}
                                    onValueChange={(value) => handleParameterChange('precipitationDeposits', value)}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Wind Intensity */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Wind Intensity</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.windIntensity}%</span>
                                </div>
                                <Slider
                                    value={[environmentParams.windIntensity]}
                                    onValueChange={(value) => handleParameterChange('windIntensity', value)}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Fog Density */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Fog Density</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.fogDensity}%</span>
                                </div>
                                <Slider
                                    value={[environmentParams.fogDensity]}
                                    onValueChange={(value) => handleParameterChange('fogDensity', value)}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Wetness */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-zinc-200">Wetness</Label>
                                    <span className="text-xs text-zinc-400">{environmentParams.wetness}%</span>
                                </div>
                                <Slider
                                    value={[environmentParams.wetness]}
                                    onValueChange={(value) => handleParameterChange('wetness', value)}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 p-4 border-t border-zinc-700">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowParametersModal(false)}
                                className="bg-zinc-800 hover:bg-zinc-700 border-zinc-600"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriveLabLeftPanel;