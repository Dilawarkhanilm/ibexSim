import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SceneGenerationLeftPanel from './components/SceneGenerationLeftPanel';
import SceneGenerationRightPanel from './components/SceneGenerationRightPanel';

const SceneGeneration: React.FC = () => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="h-full bg-zinc-950 text-white flex relative">
      {/* Left Panel - Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <SceneGenerationLeftPanel />
      </div>

      {/* Toggle Button */}
      <div className="absolute top-4 right-0 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRightSidebar}
          className={cn(
            "p-1 h-8 w-8 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 transition-all duration-300",
            isRightSidebarOpen
              ? 'rounded-l-md border-r-0'
              : 'rounded-l-md'
          )}
          style={{
            right: isRightSidebarOpen ? '320px' : '0px'
          }}
        >
          {isRightSidebarOpen ? (
            <ChevronRight className="w-3 h-3 text-zinc-300" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-zinc-300" />
          )}
        </Button>
      </div>

      {/* Right Panel - Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isRightSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0',
        "overflow-hidden"
      )}>
        <SceneGenerationRightPanel />
      </div>
    </div>
  );
};

export default SceneGeneration;