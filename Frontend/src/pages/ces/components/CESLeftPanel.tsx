import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    FileText,
    BarChart3,
    Download
} from 'lucide-react';

const CESLeftPanel: React.FC = () => {
    return (
        <div className="flex-1 p-4 overflow-auto">
            {/* Annotated Frames Section */}
            <Card className="mb-4 bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-200">Annotated Frames</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center text-zinc-400">
                            <FileText className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">No Frames</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Traffic Critical Events Table */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-zinc-200">Traffic Critical Events</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Select defaultValue="all-videos">
                                <SelectTrigger className="w-32 h-7 text-xs bg-zinc-800 text-white border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800  border-zinc-700">
                                    <SelectItem value="all-videos" className='text-xs'>All Videos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button size="sm" className="h-9 px-2 text-xs bg-zinc-700 hover:bg-zinc-600">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                KPI
                            </Button>
                            <Button size="sm" className="h-9 px-2 text-xs bg-zinc-700 hover:bg-zinc-600">
                                <Download className="w-3 h-3 mr-1" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-700">
                                <TableHead className="text-xs text-zinc-400">S#</TableHead>
                                <TableHead className="text-xs text-zinc-400">Frame Number</TableHead>
                                <TableHead className="text-xs text-zinc-400">Det. Time</TableHead>
                                <TableHead className="text-xs text-zinc-400">Anomaly Type</TableHead>
                                <TableHead className="text-xs text-zinc-400">Confidence</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-zinc-500 text-xs">
                                    No data available
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default CESLeftPanel;