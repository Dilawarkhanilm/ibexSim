import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Search,
    MapPin,
    Upload
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

interface TileInfo {
    id: string;
    x: number;
    y: number;
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}

interface SceneGenerationRightPanelProps {
    onLocationSelect?: (location: SelectedLocation) => void;
    onTileSelect?: (tile: TileInfo) => void;
    selectedLocation?: SelectedLocation | null;
    selectedTile?: TileInfo | null;
    isGenerating?: boolean;
    onTaskUpdate?: (taskName: string) => void;
}

const SceneGenerationRightPanel: React.FC<SceneGenerationRightPanelProps> = ({
    onLocationSelect,
    onTileSelect,
    selectedLocation,
    selectedTile,
    isGenerating = false,
    onTaskUpdate
}) => {
    const [searchLocation, setSearchLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        onTaskUpdate?.("Searching locations");

        try {
            // Using Nominatim API for OpenStreetMap geocoding
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
            name: suggestion.display_name.split(',')[0], // Get primary name
            lat: parseFloat(suggestion.lat),
            lon: parseFloat(suggestion.lon),
            area: suggestion.display_name
        };

        setSearchLocation(location.name);
        setShowSuggestions(false);
        setLocationSuggestions([]);
        onLocationSelect?.(location);
        onTaskUpdate?.("Loading map tiles");
    };

    const handleInputFocus = () => {
        if (locationSuggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <div className={`w-80 bg-zinc-900 border-l border-zinc-800 h-full flex flex-col ${isGenerating ? 'opacity-60' : ''}`}>
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex-shrink-0">
                <h3 className="text-sm font-medium text-zinc-200">Tools</h3>
                {isGenerating && (
                    <p className="text-xs text-orange-400 mt-1">Generation in progress...</p>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Select Location Section */}
                <Card className={`bg-zinc-800 border-zinc-700 ${isGenerating ? 'opacity-50' : ''}`}>
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-200">Search Location in Map</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Upload GPX button */}
                        <div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className={`w-full h-8 text-xs bg-zinc-700 hover:bg-zinc-600 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isGenerating}
                            >
                                <Upload className="w-3 h-3 mr-1" />
                                Upload GFX
                            </Button>
                        </div>

                        <div className="flex items-center my-2">
                            <div className="flex-grow border-t border-zinc-700" />
                            <span className="mx-2 text-xs text-zinc-500">or</span>
                            <div className="flex-grow border-t border-zinc-700" />
                        </div>


                        {/* Location search input */}
                        <div className="space-y-2 relative">
                            <Label className="text-xs text-zinc-300">Search for a location</Label>
                            <div className="relative">
                                <Input
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    placeholder="Enter location name"
                                    className={`h-8 text-xs bg-zinc-800 border-zinc-700 pr-8 placeholder:text-xs ${isGenerating ? 'cursor-not-allowed' : ''}`}
                                    disabled={isGenerating}
                                />
                                <div className="absolute right-2 top-2">
                                    {isSearching ? (
                                        <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search className="w-3 h-3 text-zinc-400" />
                                    )}
                                </div>
                            </div>

                            {/* Location Suggestions Dropdown */}
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


                {/* Map Information Section */}
                {selectedLocation && (
                    <Card className={`bg-zinc-800 border-zinc-700 ${isGenerating ? 'opacity-50' : ''}`}>
                        <CardHeader>
                            <CardTitle className="text-sm text-zinc-200">Map Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Location:</span>
                                    <span className="text-xs text-zinc-300 truncate ml-2 max-w-32">
                                        {selectedLocation.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Latitude:</span>
                                    <span className="text-xs text-zinc-300">
                                        {selectedLocation.lat.toFixed(6)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Longitude:</span>
                                    <span className="text-xs text-zinc-300">
                                        {selectedLocation.lon.toFixed(6)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-zinc-400">Area:</span>
                                    <span className="text-xs text-zinc-300 text-right max-w-32 break-words">
                                        {selectedLocation.area.length > 30
                                            ? selectedLocation.area.substring(0, 30) + '...'
                                            : selectedLocation.area}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Selected Tile Information */}
                {selectedTile && (
                    <Card className={`bg-zinc-800 border-zinc-700 ${isGenerating ? 'opacity-50' : ''}`}>
                        <CardHeader>
                            <CardTitle className="text-sm text-zinc-200">Selected Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Tile ID:</span>
                                    <span className="text-xs text-zinc-300 font-mono">
                                        {selectedTile.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">Grid Position:</span>
                                    <span className="text-xs text-zinc-300 font-mono">
                                        ({selectedTile.x}, {selectedTile.y})
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">North:</span>
                                    <span className="text-xs text-zinc-300 font-mono">
                                        {selectedTile.bounds.north.toFixed(6)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">South:</span>
                                    <span className="text-xs text-zinc-300 font-mono">
                                        {selectedTile.bounds.south.toFixed(6)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">East:</span>
                                    <span className="text-xs text-zinc-300 font-mono">
                                        {selectedTile.bounds.east.toFixed(6)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-zinc-400">West:</span>
                                    <span className="text-xs text-zinc-300 font-mono">
                                        {selectedTile.bounds.west.toFixed(6)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SceneGenerationRightPanel;