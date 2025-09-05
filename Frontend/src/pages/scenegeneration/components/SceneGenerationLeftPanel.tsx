import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MapPin,
    Eye
} from 'lucide-react';

const SceneGenerationLeftPanel: React.FC = () => {
    return (
        <div className="flex-1 p-4 overflow-auto">
            {/* Select Tile Section */}
            <Card className="mb-4 bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200">Select Tile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg h-80 flex items-center justify-center">
                        <div className="text-center text-zinc-400">
                            <MapPin className="w-16 h-16 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-2">No Location Selected</h3>
                            <p className="text-sm">Please select a location to load map tiles and generate testing scenarios</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center text-zinc-400">
                            <Eye className="w-16 h-16 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
                            <p className="text-sm">Scene preview will appear here once you select a location and generate tiles</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SceneGenerationLeftPanel;