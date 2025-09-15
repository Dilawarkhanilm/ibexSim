import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Car,
    Eye,
    Camera,
    Radar,
    Zap,
    ChevronLeft,
    ChevronRight
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

interface DriveLabLeftPanelProps {
    selectedVehicle?: SelectedVehicle | null;
    addOns?: AddOnConfig[];
    onVehicleSelect?: (vehicle: SelectedVehicle) => void;
    onAddOnToggle?: (addOnId: string, enabled: boolean) => void;
    isSimulating?: boolean;
    onTaskUpdate?: (taskName: string) => void;
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

    // Sample vehicles data
    const availableVehicles: SelectedVehicle[] = [
        { id: 'sedan_1', name: 'Sedan Model A', type: 'Sedan', model: 'Standard' },
        { id: 'suv_1', name: 'SUV Model B', type: 'SUV', model: 'Premium' },
        { id: 'truck_1', name: 'Truck Model C', type: 'Truck', model: 'Heavy Duty' },
        { id: 'sports_1', name: 'Sports Car D', type: 'Sports', model: 'Performance' }
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

    const handleAddOnClick = (addOn: AddOnConfig) => {
        if (isSimulating) return;
        onAddOnToggle?.(addOn.id, !addOn.enabled);
    };

    const getAddOnIcon = (type: string) => {
        switch (type) {
            case 'camera': return Camera;
            case 'radar': return Radar;
            case 'lidar': return Zap;
            default: return Camera;
        }
    };

    const getAddOnImage = (name: string) => {
        const images = {
            'Custom Camera': 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop',
            'Generic Camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop',
            'Custom Radar': 'https://images.unsplash.com/photo-1518709268805-4e9042af2a56?w=100&h=100&fit=crop',
            'Generic Radar': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop',
            'Custom Lidar': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop',
            'Generic Lidar': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
        };
        return images[name as keyof typeof images] || images['Custom Camera'];
    };

    // Auto-select first vehicle on mount
    useEffect(() => {
        if (!selectedVehicle && availableVehicles.length > 0 && !isSimulating) {
            handleVehicleSelect(availableVehicles[0]);
        }
    }, []);

    return (
        <div className="flex-1 p-4 overflow-auto space-y-4">
            {/* Selected Vehicle Section */}
            <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200 flex items-center space-x-2">
                        <Car size={16} />
                        <span>Selected Vehicle</span>
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
                            {/* Vehicle Navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousVehicle}
                                    disabled={isSimulating}
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
                                    disabled={isSimulating}
                                    className="h-8 w-8 p-0 bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* 3D Model Placeholder */}
                            <div className="bg-zinc-800 border border-zinc-600 rounded-lg h-64 flex items-center justify-center relative overflow-hidden mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1549924231-f129b911e442?w=500&h=300&fit=crop"
                                    alt="3D Vehicle Model"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <Eye className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-sm font-medium">Click here to view 3D model</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Info */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Name:</span>
                                    <span className="text-xs text-zinc-300 font-medium">
                                        {selectedVehicle.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Type:</span>
                                    <span className="text-xs text-zinc-300">
                                        {selectedVehicle.type}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Model:</span>
                                    <span className="text-xs text-zinc-300">
                                        {selectedVehicle.model}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add-Ons Section */}
            <Card className={`bg-zinc-900 border-zinc-800 ${isSimulating ? 'opacity-50' : ''}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200">Add-Ons</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                        {addOns.map((addOn) => {
                            const IconComponent = getAddOnIcon(addOn.type);
                            return (
                                <button
                                    key={addOn.id}
                                    onClick={() => handleAddOnClick(addOn)}
                                    disabled={isSimulating}
                                    className={`
                                        p-3 rounded-lg border transition-all duration-200 flex flex-col items-center space-y-2 text-center
                                        ${addOn.enabled 
                                            ? 'bg-blue-600 border-blue-500 text-white' 
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                                        }
                                        ${isSimulating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                    `}
                                >
                                    <img 
                                        src={getAddOnImage(addOn.name)}
                                        alt={addOn.name}
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                    <span className="text-xs font-medium">{addOn.name}</span>
                                    {addOn.enabled && (
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Add-On Summary */}
                    {addOns.some(a => a.enabled) && (
                        <div className="mt-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                            <p className="text-xs text-zinc-400 mb-2">Active Add-Ons:</p>
                            <div className="flex flex-wrap gap-1">
                                {addOns.filter(a => a.enabled).map(addOn => (
                                    <span 
                                        key={addOn.id} 
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                        {addOn.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DriveLabLeftPanel;