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

    const TILE_WIDTH_KM = 2;
    const TILE_HEIGHT_KM = 2;

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

    const addGridOverlay = () => {
        if (!leafletMapRef.current || !selectedLocation) return;
        const map = leafletMapRef.current;

        if (gridLayerRef.current) {
            map.removeLayer(gridLayerRef.current);
        }

        const gridLayer = window.L.layerGroup();

        // Fixed bounding box around city (instead of map.getBounds)
        // Example: Islamabad (replace with your backend-provided bounds)
        const minLat = 33.4;
        const maxLat = 33.9;
        const minLng = 72.8;
        const maxLng = 73.3;

        const KM_TO_DEG = 1 / 111;
        const tileWidthDeg = TILE_WIDTH_KM * KM_TO_DEG;
        const tileHeightDeg = TILE_HEIGHT_KM * KM_TO_DEG;

        let tileNumber = 1;

        for (let x = minLng; x < maxLng; x += tileWidthDeg) {
            for (let y = minLat; y < maxLat; y += tileHeightDeg) {
                const tileBounds = {
                    north: y + tileHeightDeg,
                    south: y,
                    east: x + tileWidthDeg,
                    west: x,
                };

                const rect = window.L.rectangle(
                    [
                        [tileBounds.south, tileBounds.west],
                        [tileBounds.north, tileBounds.east],
                    ],
                    {
                        color: "green",
                        weight: 1,
                        fillOpacity: 0,
                    }
                );

                // 👉 Add click handler
                rect.on("click", () => {
                    if (isGenerating) return;

                    const tileInfo: TileInfo = {
                        id: `tile_${tileNumber}`,
                        x: tileNumber - 1,
                        y: 0, // y-index agar chahiye to add kar sakte ho
                        bounds: tileBounds,
                    };

                    onTileSelect?.(tileInfo); // 🔑 Notify parent (SceneGeneration)
                    onTaskUpdate?.(`Tile selected: (${tileInfo.x}, ${tileInfo.y})`);

                    // Zoom into tile
                    map.fitBounds([
                        [tileBounds.south, tileBounds.west],
                        [tileBounds.north, tileBounds.east],
                    ]);
                });

                // 👉 Hover effect
                rect.on("mouseover", () => {
                    rect.setStyle({ color: "blue", weight: 2, fillOpacity: 0.3 });
                });
                rect.on("mouseout", () => {
                    rect.setStyle({ color: "green", weight: 1, fillOpacity: 0 });
                });

                const centerLat = y + tileHeightDeg / 2;
                const centerLng = x + tileWidthDeg / 2;

                const label = window.L.marker([centerLat, centerLng], {
                    icon: window.L.divIcon({
                        className: "tile-label",
                        html: `<div style="font-size:12px; font-weight:bold; color:red; text-shadow:1px 1px 2px white;">${tileNumber}</div>`,
                    }),
                });

                gridLayer.addLayer(rect);
                gridLayer.addLayer(label);
                tileNumber++;
            }
        }


        gridLayer.addTo(map);
        gridLayerRef.current = gridLayer;
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
                        <span>2km x 2km Grid Tiles</span>
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