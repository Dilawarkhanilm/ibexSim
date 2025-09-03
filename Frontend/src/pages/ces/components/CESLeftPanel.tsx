// Frontend/src/pages/ces/components/CESLeftPanel.tsx
import React from 'react';
import { FileText } from 'lucide-react';

const CESLeftPanel: React.FC = () => {
    return (
        <div className="flex-1 p-6 overflow-auto">
            {/* Annotated Frames Section */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-white">Annotated Frames</h3>
                <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg h-80 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <FileText className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-xl">No Frames</p>
                    </div>
                </div>
            </div>

            {/* Traffic Critical Events Table */}
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Traffic Critical Events</h3>
                    <div className="flex items-center space-x-2">
                        <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white">
                            <option>All Videos</option>
                        </select>
                        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors text-white">
                            KPI
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors text-white">
                            Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-300">S#</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-300">Frame Number</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-300">Det. Time</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-300">Anomaly Type</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-300">Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CESLeftPanel;