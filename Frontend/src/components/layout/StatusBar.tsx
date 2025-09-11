import React, { useState, useEffect } from 'react';
import { Cpu, Zap, ChevronUp, ChevronDown, X, CheckCircle, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";

export interface BackgroundTask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  startTime: Date;
  endTime?: Date;
  details?: string;
}

interface StatusBarProps {
  isVideoPlaying?: boolean;
  selectedFilters?: string[];
  onTaskUpdate?: (task: BackgroundTask) => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  isVideoPlaying = false, 
  selectedFilters = ['All'],
  onTaskUpdate 
}) => {
  const [backgroundTasks, setBackgroundTasks] = useState<BackgroundTask[]>([]);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<BackgroundTask | null>(null);

  // Function to add a new background task
  const addBackgroundTask = (name: string, details?: string): string => {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask: BackgroundTask = {
      id: taskId,
      name,
      status: 'running',
      progress: 0,
      startTime: new Date(),
      details
    };

    setBackgroundTasks(prev => [...prev, newTask]);
    setCurrentTask(newTask);
    onTaskUpdate?.(newTask);
    
    return taskId;
  };

  // Function to update task progress
  const updateTaskProgress = (taskId: string, progress: number, details?: string) => {
    setBackgroundTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, progress, details: details || task.details }
        : task
    ));

    // Update current task if it's the one being updated
    setCurrentTask(prev => 
      prev?.id === taskId 
        ? { ...prev, progress, details: details || prev.details }
        : prev
    );
  };

  // Function to complete a task
  const completeTask = (taskId: string, status: 'completed' | 'failed' = 'completed') => {
    setBackgroundTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, progress: 100, endTime: new Date() }
        : task
    ));

    // Clear current task if it's the completed one
    setCurrentTask(prev => prev?.id === taskId ? null : prev);

    // Auto-hide completed tasks after 3 seconds
    setTimeout(() => {
      setBackgroundTasks(prev => prev.filter(task => task.id !== taskId));
    }, 3000);
  };

  // Function to remove a specific task
  const removeTask = (taskId: string) => {
    setBackgroundTasks(prev => prev.filter(task => task.id !== taskId));
    setCurrentTask(prev => prev?.id === taskId ? null : prev);
  };

  // Simulate video processing when playback starts
  useEffect(() => {
    if (isVideoPlaying) {
      // Add initial launching task
      const launchTaskId = addBackgroundTask("Extracting");
      
      // Progress simulation for launching
      let progress = 0;
      const launchInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(launchInterval);
          completeTask(launchTaskId);
          
          // Start extraction task after launch completes
          setTimeout(() => {
            startExtractionTask();
          }, 500);
        }
        updateTaskProgress(launchTaskId, Math.min(progress, 100));
      }, 200);

      return () => {
        clearInterval(launchInterval);
      };
    }
  }, [isVideoPlaying]);

  // Function to start extraction task with random frame updates
  const startExtractionTask = () => {
    const filterName = selectedFilters.includes('All') || selectedFilters.length === 0 
      ? 'Critical Events' 
      : selectedFilters[0];
    
    const extractionTaskId = addBackgroundTask(
      "Extraction",
      `Preparing extraction for ${filterName}`
    );

    let progress = 0;
    let frameNumber = Math.floor(Math.random() * 5000) + 1000;

    const extractionInterval = setInterval(() => {
      progress += Math.random() * 15;
      frameNumber += Math.floor(Math.random() * 50) + 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(extractionInterval);
        completeTask(extractionTaskId);
      } else {
        updateTaskProgress(
          extractionTaskId, 
          Math.min(progress, 100),
          `Extracting behaviour ${filterName} at frame ${frameNumber}`
        );
      }
    }, 800);

    return extractionTaskId;
  };

  // Get active tasks count
  const activeTasks = backgroundTasks.filter(task => task.status === 'running');
  const hasActiveTasks = activeTasks.length > 0;

  // Format task duration
  const getTaskDuration = (task: BackgroundTask): string => {
    const endTime = task.endTime || new Date();
    const duration = Math.floor((endTime.getTime() - task.startTime.getTime()) / 1000);
    return `${duration}s`;
  };

  // Format progress bar
  const getProgressColor = (status: BackgroundTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <>
      {/* Background Tasks Panel */}
      {isTaskPanelOpen && (
        <div className="absolute bottom-6 left-0 right-0 bg-zinc-900 border-t border-zinc-700 max-h-64 overflow-hidden">
          <div className="p-3 border-b border-zinc-700 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-200">Background Tasks</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-zinc-400 hover:text-white"
              onClick={() => setIsTaskPanelOpen(false)}
            >
              <X size={14} />
            </Button>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {backgroundTasks.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">
                No background tasks
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {backgroundTasks.map((task) => (
                  <div key={task.id} className="bg-zinc-800 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {task.status === 'running' && <Loader size={14} className="animate-spin text-blue-400" />}
                        {task.status === 'completed' && <CheckCircle size={14} className="text-green-400" />}
                        {task.status === 'failed' && <X size={14} className="text-red-400" />}
                        <span className="text-sm text-zinc-200">{task.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-zinc-400">{getTaskDuration(task)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-zinc-400 hover:text-white"
                          onClick={() => removeTask(task.id)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(task.status)}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    
                    {/* Task Details */}
                    {task.details && (
                      <p className="text-xs text-zinc-400">{task.details}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Status Bar */}
      <div className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-3 relative">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${hasActiveTasks ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
            <span>{hasActiveTasks ? 'Processing' : 'Ready'}</span>
          </span>
          
          {/* Current Task Display */}
          {currentTask && (
            <span className="flex items-center space-x-2">
              <Loader size={12} className="animate-spin" />
              <span className="truncate max-w-xs">
                {currentTask.details || currentTask.name}
              </span>
              <span className="text-blue-200">
                {Math.round(currentTask.progress)}%
              </span>
            </span>
          )}
        </div>

        {/* Center section - Background Tasks Toggle */}
        {backgroundTasks.length > 0 && (
          <button
            className="flex items-center space-x-1 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
            onClick={() => setIsTaskPanelOpen(!isTaskPanelOpen)}
          >
            <span>{activeTasks.length} background task{activeTasks.length !== 1 ? 's' : ''}</span>
            {isTaskPanelOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        )}

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Zap size={12} />
            <span>Simulation Engine: {hasActiveTasks ? 'Processing' : 'Active'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Cpu size={12} />
            <span>GPU: {hasActiveTasks ? 'Busy' : 'Ready'}</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default StatusBar;