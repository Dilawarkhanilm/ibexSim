import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {

    Search
} from 'lucide-react';

const SceneGenerationRightPanel: React.FC = () => {
    const [searchLocation, setSearchLocation] = useState('');

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
                                On Server
                            </Button>
                            <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs bg-zinc-700 hover:bg-zinc-600">
                                Upload GPX File
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

                {/* Map Information Section */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Map Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-xs text-zinc-400">Area:</span>
                                <span className="text-xs text-zinc-300">N/A</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-zinc-400">Latitude:</span>
                                <span className="text-xs text-zinc-300">---</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-zinc-400">Longitude:</span>
                                <span className="text-xs text-zinc-300">---</span>
                            </div>
                        </div>

                        <Button className="w-full h-8 bg-zinc-700 hover:bg-zinc-600 text-xs">
                            Scene Generate
                        </Button>
                    </CardContent>
                </Card>

                {/* Location Settings */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Location Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Map Type</Label>
                            <Select defaultValue="satellite">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="satellite">Satellite</SelectItem>
                                    <SelectItem value="roadmap">Roadmap</SelectItem>
                                    <SelectItem value="terrain">Terrain</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Zoom Level</Label>
                            <Select defaultValue="15">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="10">10 - City Level</SelectItem>
                                    <SelectItem value="12">12 - District Level</SelectItem>
                                    <SelectItem value="15">15 - Street Level</SelectItem>
                                    <SelectItem value="18">18 - Building Level</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Tile Size</Label>
                            <Select defaultValue="512">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="256">256x256</SelectItem>
                                    <SelectItem value="512">512x512</SelectItem>
                                    <SelectItem value="1024">1024x1024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Scene Parameters */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Scene Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Weather Condition</Label>
                            <Select defaultValue="clear">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="clear">Clear</SelectItem>
                                    <SelectItem value="cloudy">Cloudy</SelectItem>
                                    <SelectItem value="rainy">Rainy</SelectItem>
                                    <SelectItem value="foggy">Foggy</SelectItem>
                                    <SelectItem value="snowy">Snowy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Time of Day</Label>
                            <Select defaultValue="day">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="dawn">Dawn</SelectItem>
                                    <SelectItem value="day">Day</SelectItem>
                                    <SelectItem value="dusk">Dusk</SelectItem>
                                    <SelectItem value="night">Night</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">Traffic Density</Label>
                            <Select defaultValue="medium">
                                <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="extreme">Extreme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SceneGenerationRightPanel;