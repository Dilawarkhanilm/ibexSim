// Frontend/src/components/layout/StatusBar.tsx
import React from 'react';
import { Cpu, Zap } from 'lucide-react';

const StatusBar: React.FC = () => {
    return (
        <div className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-3">
            {/* Left section */}
            <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Ready</span>
                </span>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                    <Zap size={12} />
                    <span>Simulation Engine: Active</span>
                </span>
                <span className="flex items-center space-x-1">
                    <Cpu size={12} />
                    <span>GPU: Ready</span>
                </span>
            </div>
        </div>
    );
};

export default StatusBar;