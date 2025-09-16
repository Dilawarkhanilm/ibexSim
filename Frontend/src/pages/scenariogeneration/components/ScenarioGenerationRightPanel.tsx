import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import 'leaflet/dist/leaflet.css';

import {
    Search,
    MapPin,
    Upload,
    X,
    FileVideo,
    Plus,
    Map,
    Navigation
} from 'lucide-react';

interface LocationSuggestion {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    class: string;
    type: string;
}

interface SelectedLocation {
    name: string;
    lat: number;
    lon: number;
    area: string;
}

interface SimulationPoint {
    lat: number;
    lon: number;
    name: string;
}

interface VideoReference {
    id: string;
    name: string;
    url: string;
    duration: string;
    thumbnail: string;
}

interface ScenarioGenerationRightPanelProps {
    onLocationSelect?: (location: SelectedLocation) => void;
    onSimulationPointSelect?: (point: SimulationPoint) => void;
    onVideoSelect?: (video: VideoReference | null) => void;
    onVideoUpload?: (videos: File[]) => void;
    selectedLocation?: SelectedLocation | null;
    simulationPoint?: SimulationPoint | null;
    selectedVideo?: VideoReference | null;
    uploadedVideos?: File[];
    isPlaybackActive?: boolean;
}

const ScenarioGenerationRightPanel: React.FC<ScenarioGenerationRightPanelProps> = ({
    onLocationSelect,
    onSimulationPointSelect,
    onVideoSelect,
    onVideoUpload,
    selectedLocation: propSelectedLocation,
    simulationPoint: propSimulationPoint,
    selectedVideo: propSelectedVideo,
    uploadedVideos: propUploadedVideos = [],
    isPlaybackActive = false,
}) => {
    // UI-only local states
    const [searchLocation, setSearchLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    
    
    // Local state for temporary map interaction (before confirmation)
    const [tempSimulationPoint, setTempSimulationPoint] = useState<SimulationPoint | null>(null);
    const [tempSelectedLocation, setTempSelectedLocation] = useState<SelectedLocation | null>(null);

    // Use props for display values
    const selectedLocation = propSelectedLocation;
    const simulationPoint = propSimulationPoint;
    const selectedVideo = propSelectedVideo;
    const uploadedVideos = propUploadedVideos;

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<import('leaflet').Map | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sample video catalog
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

    // Debounced location search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchLocation.trim().length > 2) {
            searchTimeoutRef.current = setTimeout(() => {
                searchLocations(searchLocation.trim());
            }, 500);
        } else {
            setLocationSuggestions([]);
            setShowSuggestions(false);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchLocation]);

    const searchLocations = async (query: string) => {
        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
            );

            if (response.ok) {
                const data: LocationSuggestion[] = await response.json();
                setLocationSuggestions(data);
                setShowSuggestions(data.length > 0);
            }
        } catch (error) {
            console.error('Error searching locations:', error);
            setLocationSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocationSelect = (suggestion: LocationSuggestion) => {
        const location: SelectedLocation = {
            name: suggestion.display_name.split(',')[0],
            lat: parseFloat(suggestion.lat),
            lon: parseFloat(suggestion.lon),
            area: suggestion.display_name
        };

        console.log('RightPanel: Location selected from search:', location);
        setSearchLocation(location.name);
        setShowSuggestions(false);
        setLocationSuggestions([]);
        setTempSelectedLocation(location);
        setShowMapModal(true);
        onLocationSelect?.(location);
    };

    const openCatalogMap = () => {
        const torontoLocation: SelectedLocation = {
            name: 'Toronto',
            lat: 43.6532,
            lon: -79.3832,
            area: 'Toronto, Ontario, Canada'
        };
        console.log('RightPanel: Location selected from catalog:', torontoLocation);
        setTempSelectedLocation(torontoLocation);
        setShowMapModal(true);
        onLocationSelect?.(torontoLocation);
    };

    const initializeMap = (location: SelectedLocation) => {
        if (mapRef.current && window.L) {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
            }

            const map = window.L.map(mapRef.current, {
                center: [location.lat, location.lon],
                zoom: 14,
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                dragging: true,
            });

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            map.on('click', (e: any) => {
                const point: SimulationPoint = {
                    lat: e.latlng.lat,
                    lon: e.latlng.lng,
                    name: `Point (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`
                };
        
                console.log('RightPanel: Simulation point clicked on map:', point);
                setTempSimulationPoint(point);
                
                map.eachLayer((layer: any) => {
                    if (layer instanceof window.L.Marker) {
                        map.removeLayer(layer);
                    }
                });
        
                window.L.marker([point.lat, point.lon], {
                    icon: window.L.divIcon({
                        className: 'simulation-point-marker',
                        html: '<div style="background: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(map);
            });

            leafletMapRef.current = map;
        }
    };

    useEffect(() => {
        if (showMapModal && !window.L) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                if (tempSelectedLocation) {
                    setTimeout(() => initializeMap(tempSelectedLocation), 100);
                }
            };
            document.head.appendChild(script);
        } else if (showMapModal && window.L && tempSelectedLocation) {
            setTimeout(() => initializeMap(tempSelectedLocation), 100);
        }
    }, [showMapModal, tempSelectedLocation]);

    const handleMapConfirm = () => {
        if (isPlaybackActive) return;
        console.log('RightPanel: Map confirmed, tempSimulationPoint:', tempSimulationPoint);
        setShowMapModal(false);
        if (tempSimulationPoint) {
            onSimulationPointSelect?.(tempSimulationPoint);
        }
    };

    const handleVideoSelect = (video: VideoReference) => {
        if (isPlaybackActive) return;
        console.log('RightPanel: Video selected from catalog:', video);
        setShowVideoModal(false);
        onVideoSelect?.(video);
    };

    const handleFileUpload = (files: FileList) => {
        if (isPlaybackActive) return;
        const videoFiles = Array.from(files).filter(file =>
            file.type.startsWith('video/')
        );
        console.log('RightPanel: Files uploaded:', videoFiles.length);
        if (videoFiles.length > 0) {
            onVideoUpload?.(videoFiles);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isPlaybackActive) return;
        const files = event.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        if (isPlaybackActive) return;
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        if (isPlaybackActive) return;
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        if (isPlaybackActive) return;
        event.preventDefault();
        setIsDragOver(false);
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files);
        }
    };

    const handleClearVideo = () => {
        if (isPlaybackActive) return;
        console.log('RightPanel: Clearing selected video');
        onVideoSelect?.(null);
    };

    const handleClearAll = () => {
        if (isPlaybackActive) return;
        console.log('RightPanel: Clearing all videos');
        onVideoSelect?.(null);
        onVideoUpload?.([]);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={cn(
            "w-80 bg-zinc-900 border-l border-zinc-800 h-full flex flex-col rounded-b-lg",
            isPlaybackActive && "opacity-60" // visual dim
            // optionally add: "pointer-events-none" for hard block
          )}>
            <div className="p-3 border-b border-zinc-800 flex-shrink-0">
                <h3 className="text-sm font-medium text-zinc-200">Tools</h3>
                {isPlaybackActive && (
                    <p className="text-xs text-orange-400 mt-1">Settings disabled during playback</p>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Select Location Section */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-200">Select Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                                onClick={openCatalogMap}
                                disabled={isPlaybackActive}
                            >
                                <Map className="w-3 h-3 mr-1" />
                                Browse in Catalog
                            </Button>
                        </div>

                        <div className="flex items-center my-2">
                            <div className="flex-grow border-t border-zinc-700" />
                            <span className="mx-2 text-xs text-zinc-500">or</span>
                            <div className="flex-grow border-t border-zinc-700" />
                        </div>

                        <div className="space-y-2 relative">
                            <Label className="text-xs text-zinc-300">Search for a location</Label>
                            <div className="relative">
                                <Input
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    placeholder="Enter location name"
                                    className="h-8 text-xs bg-zinc-800 border-zinc-700 pr-8 placeholder:text-xs"
                                    disabled={isPlaybackActive} 
                                />
                                <div className="absolute right-2 top-2">
                                    {isSearching ? (
                                        <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search className="w-3 h-3 text-zinc-400" />
                                    )}
                                </div>
                            </div>

                            {/* Location Suggestions */}
                            {showSuggestions && locationSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                                    {locationSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion.place_id}
                                            className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors border-b border-zinc-700 last:border-b-0"
                                            onClick={() => handleLocationSelect(suggestion)}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {suggestion.display_name.split(',')[0]}
                                                    </p>
                                                    <p className="text-zinc-400 truncate">
                                                        {suggestion.display_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Location Info */}
                {selectedLocation && simulationPoint && (
                    <Card className="bg-zinc-800 border-zinc-700">
                        <CardHeader>
                            <CardTitle className="text-sm text-zinc-200 flex items-center">
                                <Navigation className="w-4 h-4 mr-2" />
                                Simulation Starting Point
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Location:</span>
                                    <span className="text-zinc-300">{selectedLocation.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Latitude:</span>
                                    <span className="text-zinc-300 font-mono">{simulationPoint.lat.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Longitude:</span>
                                    <span className="text-zinc-300 font-mono">{simulationPoint.lon.toFixed(6)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Simulation References Section */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-200">Select Simulation Reference</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                                onClick={() => setShowVideoModal(true)}
                                disabled={isPlaybackActive}
                            >
                                <Map className="w-3 h-3 mr-1" />
                                Browse in Catalog
                            </Button>
                        </div>

                        <div className="flex items-center my-2">
                            <div className="flex-grow border-t border-zinc-700" />
                            <span className="mx-2 text-xs text-zinc-500">or</span>
                            <div className="flex-grow border-t border-zinc-700" />
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                            multiple
                        />

                        {/* Upload Area or Video List */}
                        {(selectedVideo === null && uploadedVideos.length === 0) ? (
                            <div
                                className={`relative p-6 transition-colors cursor-pointer ${isDragOver ? 'bg-zinc-700/50' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                
                            >
                                {/* Corner borders */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Top-left corner */}
                                    <div className="absolute top-0 left-0 w-8 h-8">
                                        <div className={`absolute top-0 left-0 w-8 h-0.5 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute top-0 left-0 w-0.5 h-8 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Top-right corner */}
                                    <div className="absolute top-0 right-0 w-8 h-8">
                                        <div className={`absolute top-0 right-0 w-8 h-0.5 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute top-0 right-0 w-0.5 h-8 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Bottom-left corner */}
                                    <div className="absolute bottom-0 left-0 w-8 h-8">
                                        <div className={`absolute bottom-0 left-0 w-8 h-0.5 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute bottom-0 left-0 w-0.5 h-8 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Bottom-right corner */}
                                    <div className="absolute bottom-0 right-0 w-8 h-8">
                                        <div className={`absolute bottom-0 right-0 w-8 h-0.5 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                        <div className={`absolute bottom-0 right-0 w-0.5 h-8 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    </div>
                                    {/* Top center */}
                                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    {/* Bottom center */}
                                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    {/* Left center */}
                                    <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                    {/* Right center */}
                                    <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 ${isDragOver ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                </div>

                                <div className="flex flex-col items-center justify-center h-20 space-y-2">
                                    <Upload className={`w-6 h-6 ${isDragOver ? 'text-blue-400' : 'text-zinc-400'}`} />
                                    <span className={`text-xs ${isDragOver ? 'text-blue-400' : 'text-zinc-400'}`}>
                                        {isDragOver ? 'Drop videos here' : 'Upload video for simulation'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-300">
                                        {(selectedVideo ? 1 : 0) + uploadedVideos.length} video{((selectedVideo ? 1 : 0) + uploadedVideos.length) !== 1 ? 's' : ''} selected
                                    </span>
                                    <div className="flex space-x-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 px-2 text-xs text-blue-400 hover:bg-blue-600/20"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isPlaybackActive}
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add More
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 px-2 text-xs text-red-400 hover:bg-red-600/20"
                                            onClick={handleClearAll}
                                            disabled={isPlaybackActive}
                                        >
                                            <X className="w-3 h-3 mr-1" />
                                            Clear All
                                        </Button>
                                    </div>
                                </div>

                                <div className="max-h-32 overflow-y-auto space-y-1">
                                    {selectedVideo && (
                                        <div className="flex items-center justify-between p-2 bg-zinc-700/50 rounded">
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
                                            >
                                                <X className="w-3 h-3 text-red-400" />
                                            </Button>
                                        </div>
                                    )}
                                    {uploadedVideos.map((video, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-zinc-700/50 rounded">
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
                                                className="h-5 w-5 p-0 hover:bg-red-600/20 flex-shrink-0"
                                                onClick={() => onVideoUpload?.(uploadedVideos.filter((_, i) => i !== index))}
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
            </div>

            {/* Map Selection Modal */}
            {showMapModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-[800px] h-[600px] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                            <h3 className="text-lg font-semibold text-zinc-200">Select Simulation Starting Point</h3>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowMapModal(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 p-4">
                            <div className="text-sm text-zinc-400 mb-2">
                                Click on the map to select your simulation starting point
                            </div>
                            <div
                                ref={mapRef}
                                className="w-full h-full bg-zinc-800 border border-zinc-600 rounded"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 border-t border-zinc-700">
                            <div className="text-xs text-zinc-400">
                                {tempSimulationPoint ? `Selected: ${tempSimulationPoint.name}` : 'No point selected'}
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setShowMapModal(false)}
                                    className="bg-zinc-700 hover:bg-zinc-600 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleMapConfirm}
                                    disabled={!tempSimulationPoint || isPlaybackActive}
                                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                                >
                                    Confirm Selection
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                <X className="w-4 h-4"/>
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

export default ScenarioGenerationRightPanel;