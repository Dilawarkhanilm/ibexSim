import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Video,
    Eye,
} from 'lucide-react';

const ScenarioGenerationLeftPanel: React.FC = () => {
    return (
        <div className="flex-1 p-4 overflow-auto">
            {/* Video Selector Section */}
            <Card className="mb-4 bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200">Video Selector</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center text-zinc-400">
                            <Video className="w-16 h-16 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-2">No Video Selected</h3>
                            <p className="text-sm">Select a traffic event recording from S3 or upload your own to start scenario generation</p>
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
                            <p className="text-sm">Run Scenario Generator to view the simulated reconstruction of the chosen video</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ScenarioGenerationLeftPanel;