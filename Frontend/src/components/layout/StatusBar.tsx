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
  currentTaskName?: string;
  onTaskUpdate?: (task: BackgroundTask) => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  isVideoPlaying = false, 
  selectedFilters = ['All'],
  currentTaskName = '',
  onTaskUpdate 
}) => {
  const [backgroundTasks, setBackgroundTasks] = useState<BackgroundTask[]>([]);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<BackgroundTask | null>(null);
  const [, setProcessedTasks] = useState<Set<string>>(new Set()); // Track processed task names

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

  // Main task handling logic
  useEffect(() => {
    if (!currentTaskName || currentTaskName.trim() === '') {
      return;
    }

    console.log('StatusBar processing task:', currentTaskName);

    // Scene Generation Tasks (independent of video playing state)
    if (currentTaskName.includes('Location selected')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("Location Processing", currentTaskName);
      setTimeout(() => completeTask(taskId), 1000);
      return;
    }

    if (currentTaskName.includes('Starting point selected') || currentTaskName.includes('Tile selected')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("Starting Point Setup", currentTaskName);
      setTimeout(() => completeTask(taskId), 1000);
      return;
    }

    if (currentTaskName.includes('Reference selected') || currentTaskName.includes('Video selected')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("Video Reference Setup", currentTaskName);
      setTimeout(() => completeTask(taskId), 1000);
      return;
    }

    if (currentTaskName.includes('Video uploaded')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("Video Upload Processing", currentTaskName);
      setTimeout(() => completeTask(taskId), 1500);
      return;
    }

    if (currentTaskName.includes('Searching locations')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("Location Search", currentTaskName);
      setTimeout(() => completeTask(taskId), 2000);
      return;
    }

    if (currentTaskName.includes('Loading map')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("Map Loading", currentTaskName);
      
      // Simulate map loading progress
      let progress = 0;
      const mapInterval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          clearInterval(mapInterval);
          completeTask(taskId);
        }
        updateTaskProgress(taskId, Math.min(progress, 100));
      }, 300);
      return;
    }

    if (currentTaskName.includes('Starting 3D') || currentTaskName.includes('3D scene generation')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("3D Scene Generation", currentTaskName);
      
      // Simulate 3D generation progress
      let progress = 0;
      const generationInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(generationInterval);
          completeTask(taskId);
        } else {
          updateTaskProgress(taskId, Math.min(progress, 100), 
            `Generating 3D scene... ${Math.round(progress)}% complete`);
        }
      }, 500);
      return;
    }

    if (currentTaskName.includes('Scenario generation started')) {
      setProcessedTasks(prev => new Set(prev).add(currentTaskName));
      const taskId = addBackgroundTask("Scenario Generation", "Running scenario simulation...");
      
      let progress = 0;
      const scenarioInterval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress >= 100) {
          clearInterval(scenarioInterval);
          completeTask(taskId);
        } else {
          updateTaskProgress(taskId, Math.min(progress, 100), 
            `Scenario simulation running... ${Math.round(progress)}% complete`);
        }
      }, 800);
      return;
    }

    if (currentTaskName.includes('Scenario generation ready')) {
      // This is a status message, not a task - don't create a background task
      return;
    }

    // Clean up processed tasks periodically
    setTimeout(() => {
      setProcessedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentTaskName);
        return newSet;
      });
    }, 5000);
  }, [currentTaskName]);

  // Handle CES video processing tasks (only when video is actually playing for CES)
  useEffect(() => {
    // Only trigger CES tasks if video is playing AND we're not in scenario generation mode
    if (isVideoPlaying && !currentTaskName.includes('Generation') && !currentTaskName.includes('Scenario')) {
      const taskId = addBackgroundTask("Video Processing", "Initializing video analysis...");
      
      // Progress simulation for video processing
      let progress = 0;
      const processingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(processingInterval);
          completeTask(taskId);
          
          // Start extraction task after processing completes
          setTimeout(() => {
            startExtractionTask();
          }, 500);
        } else {
          updateTaskProgress(taskId, Math.min(progress, 100), 
            `Processing video... ${Math.round(progress)}% complete`);
        }
      }, 600);

      return () => {
        clearInterval(processingInterval);
      };
    }
  }, [isVideoPlaying, currentTaskName]);

  // Function to start extraction task with random frame updates (CES specific)
  const startExtractionTask = () => {
    const filterName = selectedFilters.includes('All') || selectedFilters.length === 0 
      ? 'Critical Events' 
      : selectedFilters[0];
    
    const extractionTaskId = addBackgroundTask(
      "Event Extraction",
      `Extracting ${filterName}...`
    );

    let progress = 0;
    let frameNumber = Math.floor(Math.random() * 5000) + 1000;

    const extractionInterval = setInterval(() => {
      progress += Math.random() * 12;
      frameNumber += Math.floor(Math.random() * 50) + 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(extractionInterval);
        completeTask(extractionTaskId);
      } else {
        updateTaskProgress(
          extractionTaskId, 
          Math.min(progress, 100),
          `Extracting ${filterName} at frame ${frameNumber}`
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

  // Determine system status
  const getSystemStatus = () => {
    if (hasActiveTasks) {
      return { status: 'Processing', color: 'bg-yellow-400' };
    }
    if (currentTaskName.includes('ready')) {
      return { status: 'Ready', color: 'bg-green-400' };
    }
    return { status: 'Ready', color: 'bg-green-400' };
  };

  const systemStatus = getSystemStatus();

  return (
    <>
      {/* Background Tasks Panel */}
      {isTaskPanelOpen && (
        <div className="absolute bottom-6 left-0 right-0 bg-zinc-900 border-t border-zinc-700 max-h-64 overflow-hidden z-50">
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
            <div className={`w-2 h-2 rounded-full ${systemStatus.color}`}></div>
            <span>{systemStatus.status}</span>
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
          
          {/* Simple Task Display for non-background tasks */}
          {!currentTask && currentTaskName && currentTaskName.trim() !== '' && (
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="truncate max-w-xs text-blue-200">
                {currentTaskName}
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