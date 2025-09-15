import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Upload,
    FileText
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
    uploadedScenario?: File;
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

    const handleConfigChange = (key: keyof SimulationConfig, value: any) => {
        onConfigChange(key, value);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleConfigChange('uploadedScenario', file);
            onTaskUpdate?.(`Scenario uploaded: ${file.name}`);
        }
    };

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
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                        activeTab === 'default'
                            ? 'bg-blue-600 text-white'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                    disabled={isSimulating}
                >
                    Default
                </button>
                <button
                    onClick={() => setActiveTab('tce')}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                        activeTab === 'tce'
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
                        {/* Map Configuration */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Map</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-300">Type</Label>
                                    <Select 
                                        value={simulationConfig.map} 
                                        onValueChange={(value) => handleConfigChange('map', value)}
                                        disabled={isSimulating}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Street">Street</SelectItem>
                                            <SelectItem value="Highway">Highway</SelectItem>
                                            <SelectItem value="Urban">Urban</SelectItem>
                                            <SelectItem value="Rural">Rural</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weather Configuration */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Weather</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select 
                                    value={simulationConfig.weather} 
                                    onValueChange={(value) => handleConfigChange('weather', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Default">Default</SelectItem>
                                        <SelectItem value="Sunny">Sunny</SelectItem>
                                        <SelectItem value="Rainy">Rainy</SelectItem>
                                        <SelectItem value="Foggy">Foggy</SelectItem>
                                        <SelectItem value="Snowy">Snowy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Traffic Behaviour */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Traffic Behaviour</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select 
                                    value={simulationConfig.trafficBehaviour} 
                                    onValueChange={(value) => handleConfigChange('trafficBehaviour', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mixed Behaviour">Mixed Behaviour</SelectItem>
                                        <SelectItem value="Aggressive">Aggressive</SelectItem>
                                        <SelectItem value="Conservative">Conservative</SelectItem>
                                        <SelectItem value="Normal">Normal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Fault Injection */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Enable Fault Injection</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="fault-injection"
                                        checked={simulationConfig.enableFaultInjection}
                                        onCheckedChange={(checked) => handleConfigChange('enableFaultInjection', checked)}
                                        disabled={isSimulating}
                                    />
                                    <Label htmlFor="fault-injection" className="text-xs text-zinc-300">
                                        Enable Fault Injection
                                    </Label>
                                </div>
                                
                                {simulationConfig.enableFaultInjection && (
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-300">Select Fault</Label>
                                        <Select 
                                            value={simulationConfig.selectedFault} 
                                            onValueChange={(value) => handleConfigChange('selectedFault', value)}
                                            disabled={isSimulating}
                                        >
                                            <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                                <SelectValue placeholder="Select Fault" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sensor_failure">Sensor Failure</SelectItem>
                                                <SelectItem value="communication_loss">Communication Loss</SelectItem>
                                                <SelectItem value="brake_malfunction">Brake Malfunction</SelectItem>
                                                <SelectItem value="engine_failure">Engine Failure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Traffic Density */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Traffic Density</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select 
                                    value={simulationConfig.trafficDensity} 
                                    onValueChange={(value) => handleConfigChange('trafficDensity', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Less Dense">Less Dense</SelectItem>
                                        <SelectItem value="Medium Dense">Medium Dense</SelectItem>
                                        <SelectItem value="High Dense">High Dense</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Traffic Type */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Traffic Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select 
                                    value={simulationConfig.trafficType} 
                                    onValueChange={(value) => handleConfigChange('trafficType', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="No Bikes">No Bikes</SelectItem>
                                        <SelectItem value="With Bikes">With Bikes</SelectItem>
                                        <SelectItem value="Mixed Traffic">Mixed Traffic</SelectItem>
                                        <SelectItem value="Cars Only">Cars Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Simulation Time */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Simulation Time (seconds)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    type="number"
                                    value={simulationConfig.simulationTime}
                                    onChange={(e) => handleConfigChange('simulationTime', parseInt(e.target.value))}
                                    className="h-8 text-xs bg-zinc-800 border-zinc-700"
                                    min="1"
                                    max="3600"
                                    disabled={isSimulating}
                                />
                            </CardContent>
                        </Card>

                        {/* Perception Algorithm */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Perception Algorithm</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Select 
                                    value={simulationConfig.perceptionAlgorithm} 
                                    onValueChange={(value) => handleConfigChange('perceptionAlgorithm', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Default">Default</SelectItem>
                                        <SelectItem value="YOLO">YOLO</SelectItem>
                                        <SelectItem value="R-CNN">R-CNN</SelectItem>
                                        <SelectItem value="SSD">SSD</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-8 text-xs bg-zinc-700 hover:bg-zinc-600 border-zinc-600"
                                    disabled={isSimulating}
                                >
                                    <FileText className="w-3 h-3 mr-1" />
                                    OPEN JUPYTER NOTEBOOK
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeTab === 'tce' && (
                    <>
                        {/* Upload Scenario */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Upload Scenario</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                                    <p className="text-xs text-zinc-400 mb-2">Upload your clip</p>
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="scenario-upload"
                                        accept=".mp4,.avi,.mov"
                                        disabled={isSimulating}
                                    />
                                    <Label 
                                        htmlFor="scenario-upload"
                                        className={`inline-block px-3 py-1 text-xs rounded cursor-pointer transition-colors ${
                                            isSimulating 
                                                ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' 
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        Choose File
                                    </Label>
                                </div>
                                
                                {simulationConfig.uploadedScenario && (
                                    <div className="p-2 bg-zinc-700 rounded text-xs">
                                        <p className="text-zinc-300">
                                            {simulationConfig.uploadedScenario.name}
                                        </p>
                                        <p className="text-zinc-400">
                                            {(simulationConfig.uploadedScenario.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Weather Configuration */}
                        <Card className={`bg-zinc-800 border-zinc-700 ${isSimulating ? 'opacity-50' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-200">Weather</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select 
                                    value={simulationConfig.weather} 
                                    onValueChange={(value) => handleConfigChange('weather', value)}
                                    disabled={isSimulating}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Default">Default</SelectItem>
                                        <SelectItem value="Sunny">Sunny</SelectItem>
                                        <SelectItem value="Rainy">Rainy</SelectItem>
                                        <SelectItem value="Foggy">Foggy</SelectItem>
                                        <SelectItem value="Snowy">Snowy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default DriveLabRightPanel;