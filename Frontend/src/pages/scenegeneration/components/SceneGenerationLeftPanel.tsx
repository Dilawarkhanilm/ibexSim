import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MapPin,
    Eye,
    Grid3X3
} from 'lucide-react';

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

interface SceneGenerationLeftPanelProps {
    selectedLocation?: SelectedLocation | null;
    selectedTile?: TileInfo | null;
    onTileSelect?: (tile: TileInfo) => void;
    isGenerating?: boolean;
    onTaskUpdate?: (taskName: string) => void;
}

const SceneGenerationLeftPanel: React.FC<SceneGenerationLeftPanelProps> = ({
    selectedLocation,
    selectedTile,
    onTileSelect,
    isGenerating = false,
    onTaskUpdate
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<any>(null);
    const gridLayerRef = useRef<any>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [gridSize] = useState(5); // 5x5 grid
    const [hoveredTile, setHoveredTile] = useState<string | null>(null);

    // Load Leaflet dynamically
    useEffect(() => {
        const loadLeaflet = async () => {
            if (typeof window !== 'undefined' && !window.L) {
                // Add Leaflet CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                // Add Leaflet JS
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => setIsMapLoaded(true);
                document.head.appendChild(script);
            } else if (window.L) {
                setIsMapLoaded(true);
            }
        };

        loadLeaflet();
    }, []);

    // Initialize map when Leaflet is loaded and location is selected
    useEffect(() => {
        if (isMapLoaded && selectedLocation && mapRef.current && !leafletMapRef.current) {
            onTaskUpdate?.("Loading map tiles");

            // Initialize Leaflet map
            const map = window.L.map(mapRef.current, {
                center: [selectedLocation.lat, selectedLocation.lon],
                zoom: 15,
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                boxZoom: true,
                keyboard: true,
                dragging: true,
                touchZoom: true
            });

            // Add OpenStreetMap tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);

            // Add marker for selected location
            const marker = window.L.marker([selectedLocation.lat, selectedLocation.lon])
                .addTo(map)
                .bindPopup(`<b>${selectedLocation.name}</b><br>${selectedLocation.area}`)
                .openPopup();

            leafletMapRef.current = map;
            
            // Add grid overlay
            setTimeout(() => {
                addGridOverlay();
                onTaskUpdate?.("Map loaded - Click on a tile to select");
            }, 1000);
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, [isMapLoaded, selectedLocation]);

    // Add grid overlay to the map
    const addGridOverlay = () => {
        if (!leafletMapRef.current || !selectedLocation) return;

        const map = leafletMapRef.current;
        
        // Remove existing grid layer
        if (gridLayerRef.current) {
            map.removeLayer(gridLayerRef.current);
        }

        // Remove existing grid info controls
        map.eachLayer((layer: any) => {
            if (layer.options && layer.options.className === 'grid-info-control') {
                map.removeLayer(layer);
            }
        });

        // Create grid layer group
        const gridLayer = window.L.layerGroup();
        
        // Get current map bounds to make grid cover the visible area
        const mapBounds = map.getBounds();
        const center = map.getCenter();
        
        // Calculate grid bounds based on current view (make it larger than visible area)
        const latRange = mapBounds.getNorth() - mapBounds.getSouth();
        const lonRange = mapBounds.getEast() - mapBounds.getWest();
        
        const bounds = {
            north: center.lat + (latRange * 0.6),
            south: center.lat - (latRange * 0.6),
            east: center.lng + (lonRange * 0.6),
            west: center.lng - (lonRange * 0.6)
        };

        const latStep = (bounds.north - bounds.south) / gridSize;
        const lonStep = (bounds.east - bounds.west) / gridSize;

        // Create grid rectangles
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const tileBounds = {
                    north: bounds.south + (y + 1) * latStep,
                    south: bounds.south + y * latStep,
                    east: bounds.west + (x + 1) * lonStep,
                    west: bounds.west + x * lonStep
                };

                // Create rectangle
                const rectangle = window.L.rectangle([
                    [tileBounds.south, tileBounds.west],
                    [tileBounds.north, tileBounds.east]
                ], {
                    color: '#3b82f6',
                    weight: 2,
                    opacity: 0.8,
                    fillColor: selectedTile?.x === x && selectedTile?.y === y ? '#3b82f6' : 'transparent',
                    fillOpacity: selectedTile?.x === x && selectedTile?.y === y ? 0.3 : 0.1
                });

                // Add click handler
                rectangle.on('click', () => {
                    if (isGenerating) return;
                    
                    const tileInfo: TileInfo = {
                        id: `tile_${x}_${y}`,
                        x,
                        y,
                        bounds: tileBounds
                    };
                    
                    onTileSelect?.(tileInfo);
                    
                    // Update grid colors
                    addGridOverlay();
                });

                // Add hover effects
                rectangle.on('mouseover', () => {
                    if (!isGenerating) {
                        rectangle.setStyle({
                            fillColor: '#60a5fa',
                            fillOpacity: 0.2
                        });
                        setHoveredTile(`tile_${x}_${y}`);
                    }
                });

                rectangle.on('mouseout', () => {
                    if (!isGenerating) {
                        rectangle.setStyle({
                            fillColor: selectedTile?.x === x && selectedTile?.y === y ? '#3b82f6' : 'transparent',
                            fillOpacity: selectedTile?.x === x && selectedTile?.y === y ? 0.3 : 0.1
                        });
                        setHoveredTile(null);
                    }
                });

                // Add label
                const center = rectangle.getBounds().getCenter();
                const label = window.L.marker(center, {
                    icon: window.L.divIcon({
                        className: 'grid-label',
                        html: `<div style="
                            background: rgba(255,255,255,0.9); 
                            padding: 2px 6px; 
                            border-radius: 4px; 
                            font-size: 11px; 
                            font-weight: bold; 
                            color: #1f2937;
                            border: 1px solid #3b82f6;
                            text-align: center;
                            min-width: 20px;
                        ">${x},${y}</div>`,
                        iconSize: [30, 20],
                        iconAnchor: [15, 10]
                    })
                });

                gridLayer.addLayer(rectangle);
                gridLayer.addLayer(label);
            }
        }

        gridLayer.addTo(map);
        gridLayerRef.current = gridLayer;

        // Add single grid info control
        const gridInfo = window.L.control({ position: 'topleft' });
        gridInfo.onAdd = function() {
            const div = window.L.DomUtil.create('div', 'grid-info-control');
            div.innerHTML = `
                <div style="
                    background: rgba(0,0,0,0.7); 
                    color: white; 
                    padding: 8px; 
                    border-radius: 4px; 
                    font-size: 12px;
                    border: 1px solid #3b82f6;
                ">
                    ${gridSize}x${gridSize} Grid • Click to select tile
                    ${selectedTile ? `<br>Selected: (${selectedTile.x}, ${selectedTile.y})` : ''}
                </div>
            `;
            return div;
        };
        gridInfo.addTo(map);
    };

    // Update map when selected location changes
    useEffect(() => {
        if (leafletMapRef.current && selectedLocation) {
            leafletMapRef.current.setView([selectedLocation.lat, selectedLocation.lon], 15);
            
            // Remove existing markers and add new one
            leafletMapRef.current.eachLayer((layer: any) => {
                if (layer instanceof window.L.Marker) {
                    leafletMapRef.current.removeLayer(layer);
                }
            });

            window.L.marker([selectedLocation.lat, selectedLocation.lon])
                .addTo(leafletMapRef.current)
                .bindPopup(`<b>${selectedLocation.name}</b><br>${selectedLocation.area}`)
                .openPopup();

            addGridOverlay();
        }
    }, [selectedLocation, selectedTile]);

    return (
        <div className="flex-1 p-4 overflow-auto">
            {/* Search Location Section */}
            <Card className="mb-4 bg-zinc-900 border-zinc-800 transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200 flex items-center space-x-2">
                        <Grid3X3 size={16} />
                        <span>Search Location in Map</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!selectedLocation ? (
                        <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg h-80 flex items-center justify-center">
                            <div className="text-center text-zinc-400">
                                <MapPin className="w-16 h-16 mx-auto mb-3" />
                                <h3 className="text-lg font-medium mb-2">No Location Selected</h3>
                                <p className="text-sm">Please search and select a location from the right panel to load the map</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div 
                                ref={mapRef}
                                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg overflow-hidden" 
                                style={{ height: isGenerating ? '250px' : '500px' }}
                            />
                            
                            {!isMapLoaded && (
                                <div className="absolute inset-0 bg-zinc-800 border border-zinc-600 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-zinc-400">
                                        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                        <p className="text-sm">Loading Leaflet map...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preview Section - Only show when generating */}
            {isGenerating && selectedLocation && selectedTile && (
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200 flex items-center space-x-2">
                            <Eye size={16} />
                            <span>3D Scene Preview</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-zinc-800 border border-zinc-600 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                            <img 
                                src="https://cdnb.artstation.com/p/assets/images/images/030/857/589/large/marcos-delgado-marcos-delgado-environment-03.jpg?1601887832"
                                alt="3D Scene Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SceneGenerationLeftPanel;