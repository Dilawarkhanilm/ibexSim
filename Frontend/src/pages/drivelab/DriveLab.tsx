import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import DriveLabLeftPanel from './components/DriveLabLeftPanel';
import DriveLabRightPanel from './components/DriveLabRightPanel';

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
    uploadedScenario?: File;
}

interface DriveLabProps {
    onVideoPlayStateChange?: (isPlaying: boolean) => void;
    onTaskUpdate?: (taskName: string) => void;
    onRegisterVideoControls?: (controls: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        restart: () => void;
    }) => void;
}

const DriveLab: React.FC<DriveLabProps> = ({
    onVideoPlayStateChange,
    onTaskUpdate,
    onRegisterVideoControls
}) => {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
    const [addOns, setAddOns] = useState<AddOnConfig[]>([]);
    const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
        map: 'Street',
        weather: 'Default',
        trafficBehaviour: 'Mixed Behaviour',
        enableFaultInjection: false,
        selectedFault: '',
        trafficDensity: 'Less Dense',
        trafficType: 'No Bikes',
        simulationTime: 60,
        perceptionAlgorithm: 'Default'
    });
    const [isSimulating, setIsSimulating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed' | 'paused'>('idle');

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    // Helper function for task updates
    const updateTask = (taskName: string) => {
        console.log('DriveLab: Updating task to:', taskName);
        onTaskUpdate?.(taskName);
    };

    const handleVehicleSelect = (vehicle: SelectedVehicle) => {
        if (isSimulating && !isPaused) return;
        
        console.log('DriveLab: Vehicle selected:', vehicle.name);
        setSelectedVehicle(vehicle);
        updateTask(`Vehicle selected: ${vehicle.name}`);
    };

    const handleAddOnToggle = (addOnId: string, enabled: boolean) => {
        if (isSimulating && !isPaused) return;
        
        setAddOns(prev => prev.map(addOn => 
            addOn.id === addOnId ? { ...addOn, enabled } : addOn
        ));
        
        const addOn = addOns.find(a => a.id === addOnId);
        if (addOn) {
            updateTask(`${addOn.name} ${enabled ? 'enabled' : 'disabled'}`);
        }
    };

    const handleConfigChange = (key: keyof SimulationConfig, value: any) => {
        if (isSimulating && !isPaused) return;
        
        setSimulationConfig(prev => ({ ...prev, [key]: value }));
        updateTask(`Configuration updated: ${key}`);
    };

    const handleRunSimulation = () => {
        if (!selectedVehicle) {
            updateTask("Please select a vehicle first");
            return;
        }

        setIsSimulating(true);
        setIsPaused(false);
        setSimulationState('running');
        onVideoPlayStateChange?.(true);
        updateTask("Simulation started - Initializing vehicle systems");

        // Simulate simulation process
        setTimeout(() => {
            if (simulationState === 'running') {
                setSimulationState('completed');
                setIsSimulating(false);
                onVideoPlayStateChange?.(false);
                updateTask("Simulation completed successfully");
            }
        }, 8000);
    };

    const handlePlay = () => {
        if (!isSimulating) {
            handleRunSimulation();
        } else if (isPaused) {
            setIsPaused(false);
            setSimulationState('running');
            onVideoPlayStateChange?.(true);
            updateTask("Simulation resumed");
        }
    };

    const handlePause = () => {
        if (isSimulating) {
            setIsPaused(true);
            setSimulationState('paused');
            onVideoPlayStateChange?.(false);
            updateTask("Simulation paused");
        }
    };

    const handleStop = () => {
        setIsSimulating(false);
        setIsPaused(false);
        setSimulationState('idle');
        onVideoPlayStateChange?.(false);
        updateTask("Simulation stopped - Ready for new configuration");
    };

    const handleRestart = () => {
        handleStop();
        setTimeout(() => {
            handleRunSimulation();
        }, 100);
    };

    // Initialize default add-ons
    useEffect(() => {
        const defaultAddOns: AddOnConfig[] = [
            { id: 'custom_camera', name: 'Custom Camera', type: 'camera', enabled: false },
            { id: 'generic_camera', name: 'Generic Camera', type: 'camera', enabled: false },
            { id: 'custom_radar', name: 'Custom Radar', type: 'radar', enabled: false },
            { id: 'generic_radar', name: 'Generic Radar', type: 'radar', enabled: false },
            { id: 'custom_lidar', name: 'Custom Lidar', type: 'lidar', enabled: false },
            { id: 'generic_lidar', name: 'Generic Lidar', type: 'lidar', enabled: false }
        ];
        setAddOns(defaultAddOns);
    }, []);

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
    }, [onRegisterVideoControls, selectedVehicle, isSimulating]);

    // Set initial status when component mounts
    useEffect(() => {
        updateTask("Ready - Please select a vehicle and configure simulation");
    }, []);

    // Update task when vehicle/config state changes
    useEffect(() => {
        if (selectedVehicle && !isSimulating) {
            const enabledAddOns = addOns.filter(a => a.enabled);
            if (enabledAddOns.length > 0) {
                updateTask(`Vehicle: ${selectedVehicle.name} with ${enabledAddOns.length} add-ons - Ready to run simulation`);
            } else {
                updateTask(`Vehicle: ${selectedVehicle.name} selected - Configure add-ons and run simulation`);
            }
        }
    }, [selectedVehicle, addOns, isSimulating]);

    return (
        <div className="h-full bg-zinc-950 text-white flex relative">
            {/* Left Panel - Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <DriveLabLeftPanel 
                    selectedVehicle={selectedVehicle}
                    addOns={addOns}
                    onVehicleSelect={handleVehicleSelect}
                    onAddOnToggle={handleAddOnToggle}
                    isSimulating={isSimulating && !isPaused}
                    onTaskUpdate={updateTask}
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

            {/* Right Panel - Configuration */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isRightSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0',
                "overflow-hidden"
            )}>
                <DriveLabRightPanel 
                    simulationConfig={simulationConfig}
                    onConfigChange={handleConfigChange}
                    isSimulating={isSimulating && !isPaused}
                    onTaskUpdate={updateTask}
                />
            </div>
        </div>
    );
};

export default DriveLab;