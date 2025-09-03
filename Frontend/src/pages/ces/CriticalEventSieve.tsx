// Frontend/src/pages/ces/CriticalEventSieve.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CESLeftPanel from './components/CESLeftPanel';
import CESRightPanel from './components/CESRightPanel';

const CriticalEventSieve: React.FC = () => {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen);
    };

    return (
        <div className="h-full bg-gray-900 text-white flex relative">
            {/* Left Panel - Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <CESLeftPanel />
            </div>

            {/* Toggle Button - Fixed position, always visible */}
            <div className="absolute top-4 right-0 z-50">
                <button
                    onClick={toggleRightSidebar}
                    className={`p-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-all duration-300 ${
                        isRightSidebarOpen 
                            ? 'rounded-l-md border-r-0' 
                            : 'rounded-l-md translate-x-0'
                    }`}
                    title={isRightSidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    style={{
                        transform: isRightSidebarOpen ? 'translateX(0)' : 'translateX(0)',
                        right: isRightSidebarOpen ? '320px' : '0px'
                    }}
                >
                    {isRightSidebarOpen ? (
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-gray-300" />
                    )}
                </button>
            </div>

            {/* Right Panel - Sidebar */}
            <div className={`transition-all duration-300 ease-in-out ${
                isRightSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'
            } overflow-hidden`}>
                <CESRightPanel />
            </div>
        </div>
    );
};

export default CriticalEventSieve;