import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
     Search,
    Play,
    Settings
} from 'lucide-react';

const ScenarioGenerationRightPanel: React.FC = () => {
     const [searchLocation, setSearchLocation] = useState('');
    const [uploadedVideo, setUploadedVideo] = useState('');

    return (
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 h-full flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex-shrink-0">
                <h3 className="text-sm font-medium text-zinc-200">Tools</h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Select Location Section */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Select Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex space-x-2">
                            <Button size="sm" className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700">
                                Browse in Catalog
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Search for a location</Label>
                            <div className="relative">
                                <Input
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="Enter location name"
                                    className="h-8 text-xs bg-zinc-800 border-zinc-700 pr-8"
                                />
                                <Search className="absolute right-2 top-2 w-3 h-3 text-zinc-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upload Traffic Critical Point Section */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Upload Traffic Critical Point</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Upload your video from S3</Label>
                            <Input
                                value={uploadedVideo}
                                onChange={(e) => setUploadedVideo(e.target.value)}
                                placeholder="S3 bucket path or video URL"
                                className="h-8 text-xs bg-zinc-800 border-zinc-700"
                            />
                        </div>

                        <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center">
                            <div className="bg-zinc-700 border-2 border-dashed border-zinc-500 rounded h-20 flex items-center justify-center mb-2">
                                <span className="text-xs text-zinc-400">Upload video file area</span>
                            </div>
                            <Button size="sm" className="w-full h-8 text-xs bg-zinc-700 hover:bg-zinc-600">
                                Select Reference
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Scenario Parameters */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Scenario Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Scenario Type</Label>
                            <Select defaultValue="traffic-event">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="traffic-event">Traffic Event</SelectItem>
                                    <SelectItem value="pedestrian-crossing">Pedestrian Crossing</SelectItem>
                                    <SelectItem value="vehicle-interaction">Vehicle Interaction</SelectItem>
                                    <SelectItem value="emergency-scenario">Emergency Scenario</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Complexity Level</Label>
                            <Select defaultValue="medium">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="simple">Simple</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="complex">Complex</SelectItem>
                                    <SelectItem value="expert">Expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Duration (seconds)</Label>
                            <Input
                                type="number"
                                placeholder="30"
                                className="h-8 text-xs bg-zinc-800 border-zinc-700"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Generation Options */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Generation Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="include-weather"
                                    className="h-3 w-3"
                                />
                                <Label htmlFor="include-weather" className="text-xs text-zinc-400">
                                    Include Weather Variations
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="include-lighting"
                                    className="h-3 w-3"
                                />
                                <Label htmlFor="include-lighting" className="text-xs text-zinc-400">
                                    Include Lighting Conditions
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="randomize-actors"
                                    defaultChecked
                                    className="h-3 w-3"
                                />
                                <Label htmlFor="randomize-actors" className="text-xs text-zinc-400">
                                    Randomize Actor Behaviors
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="generate-variations"
                                    defaultChecked
                                    className="h-3 w-3"
                                />
                                <Label htmlFor="generate-variations" className="text-xs text-zinc-400">
                                    Generate Multiple Variations
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <Button className="w-full h-9 bg-green-600 hover:bg-green-700 text-xs">
                        <Play className="w-3 h-3 mr-1" />
                        Generate Scenario
                    </Button>

                    <Button variant="outline" className="w-full h-8 text-xs border-zinc-700 hover:bg-zinc-800">
                        <Settings className="w-3 h-3 mr-1" />
                        Advanced Settings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ScenarioGenerationRightPanel;