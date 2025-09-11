import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Activity,
  Zap,
  GitBranch,
  Car,
  FileText,
  BarChart3,
  Brain,
  Shield,
  Gauge,
  Route,
  Eye,
  Workflow,
  ArrowRight,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';

interface DashboardProps {
  onNavigateToTab?: (tabName: string, component: React.JSX.Element, icon?: React.JSX.Element) => void;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  category: string;
  status: 'stable' | 'beta' | 'new';
  onClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToTab }) => {
  const navigationFeatures: FeatureCard[] = [
    {
      id: 'critical-event-sieve',
      title: 'Critical Event Sieve',
      description: 'Advanced event detection and analysis for autonomous vehicle safety scenarios',
      icon: Activity,
      color: 'text-red-400',
      bgGradient: 'from-red-900/20 to-red-800/10',
      category: 'Analysis',
      status: 'stable',
      onClick: () => {
        if (onNavigateToTab) {
          const CriticalEventSieveComponent = (
            <div className="p-6 text-white bg-zinc-950 h-full">
              <h2 className="text-xl font-semibold mb-4">Critical Event Sieve</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Event Detection</h3>
                  <p className="text-sm text-zinc-400">Real-time critical event monitoring</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Safety Analysis</h3>
                  <p className="text-sm text-zinc-400">Advanced safety scenario analysis</p>
                </div>
              </div>
            </div>
          );
          onNavigateToTab("Critical Event Sieve", CriticalEventSieveComponent, <Activity size={16} />);
        }
      }
    },
    {
      id: 'scene-generation',
      title: 'Scene Generation',
      description: 'Create realistic driving scenarios and environments for testing',
      icon: Zap,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-900/20 to-yellow-800/10',
      category: 'Generation',
      status: 'stable',
      onClick: () => {
        if (onNavigateToTab) {
          const SceneGenerationComponent = (
            <div className="p-6 text-white bg-zinc-950 h-full">
              <h2 className="text-xl font-semibold mb-4">Scene Generation</h2>
              <p className="text-zinc-400">Advanced scene generation tools for AV testing</p>
            </div>
          );
          onNavigateToTab("Scene Generation", SceneGenerationComponent, <Zap size={16} />);
        }
      }
    },
    {
      id: 'scenario-generation',
      title: 'Scenario Generation',
      description: 'Build comprehensive test scenarios with branching logic and conditions',
      icon: GitBranch,
      color: 'text-blue-400',
      bgGradient: 'from-blue-900/20 to-blue-800/10',
      category: 'Generation',
      status: 'beta',
      onClick: () => {
        if (onNavigateToTab) {
          const ScenarioGenerationComponent = (
            <div className="p-6 text-white bg-zinc-950 h-full">
              <h2 className="text-xl font-semibold mb-4">Scenario Generation</h2>
              <p className="text-zinc-400">Comprehensive scenario building tools</p>
            </div>
          );
          onNavigateToTab("Scenario Generation", ScenarioGenerationComponent, <GitBranch size={16} />);
        }
      }
    },
    {
      id: 'drive-lab',
      title: 'Drive Lab',
      description: 'Interactive driving simulation and testing environment',
      icon: Car,
      color: 'text-green-400',
      bgGradient: 'from-green-900/20 to-green-800/10',
      category: 'Simulation',
      status: 'stable',
      onClick: () => {
        if (onNavigateToTab) {
          const DriveLabComponent = (
            <div className="p-6 text-white bg-zinc-950 h-full">
              <h2 className="text-xl font-semibold mb-4">Drive Lab</h2>
              <p className="text-zinc-400">Interactive driving simulation environment</p>
            </div>
          );
          onNavigateToTab("Drive Lab", DriveLabComponent, <Car size={16} />);
        }
      }
    },
    {
      id: 'file-viewer',
      title: 'File Viewer',
      description: 'Advanced file management and visualization for test data',
      icon: FileText,
      color: 'text-purple-400',
      bgGradient: 'from-purple-900/20 to-purple-800/10',
      category: 'Tools',
      status: 'stable',
      onClick: () => {
        if (onNavigateToTab) {
          const FileViewerComponent = (
            <div className="p-6 text-white bg-zinc-950 h-full">
              <h2 className="text-xl font-semibold mb-4">File Viewer</h2>
              <p className="text-zinc-400">Advanced file management and visualization</p>
            </div>
          );
          onNavigateToTab("File Viewer", FileViewerComponent, <FileText size={16} />);
        }
      }
    }
  ];

  const additionalFeatures: FeatureCard[] = [
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Machine learning powered vehicle behavior analysis',
      icon: Brain,
      color: 'text-pink-400',
      bgGradient: 'from-pink-900/20 to-pink-800/10',
      category: 'AI/ML',
      status: 'beta'
    },
    {
      id: 'performance-metrics',
      title: 'Performance Metrics',
      description: 'Real-time performance monitoring and analytics dashboard',
      icon: BarChart3,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-900/20 to-cyan-800/10',
      category: 'Analytics',
      status: 'stable'
    },
    {
      id: 'route-planning',
      title: 'Route Planning',
      description: 'Advanced path planning and navigation algorithms',
      icon: Route,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-900/20 to-emerald-800/10',
      category: 'Navigation',
      status: 'new'
    },
    {
      id: 'sensor-fusion',
      title: 'Sensor Fusion',
      description: 'Multi-sensor data integration and processing pipeline',
      icon: Layers,
      color: 'text-orange-400',
      bgGradient: 'from-orange-900/20 to-orange-800/10',
      category: 'Processing',
      status: 'beta'
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision',
      description: 'Object detection, tracking, and scene understanding',
      icon: Eye,
      color: 'text-indigo-400',
      bgGradient: 'from-indigo-900/20 to-indigo-800/10',
      category: 'Vision',
      status: 'stable'
    },
    {
      id: 'safety-validation',
      title: 'Safety Validation',
      description: 'Comprehensive safety assessment and validation tools',
      icon: Shield,
      color: 'text-red-400',
      bgGradient: 'from-red-900/20 to-red-800/10',
      category: 'Safety',
      status: 'stable'
    },
    {
      id: 'data-pipeline',
      title: 'Data Pipeline',
      description: 'Automated data processing and management workflows',
      icon: Workflow,
      color: 'text-violet-400',
      bgGradient: 'from-violet-900/20 to-violet-800/10',
      category: 'Data',
      status: 'beta'
    },
    {
      id: 'real-time-monitoring',
      title: 'Real-time Monitoring',
      description: 'Live system monitoring and alert management',
      icon: Gauge,
      color: 'text-teal-400',
      bgGradient: 'from-teal-900/20 to-teal-800/10',
      category: 'Monitoring',
      status: 'stable'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'beta':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'new':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Sparkles size={12} />;
      case 'beta':
        return <Clock size={12} />;
      default:
        return null;
    }
  };

  const renderFeatureCard = (feature: FeatureCard, index: number) => (
    <Card
      key={feature.id}
      className={cn(
        "bg-gradient-to-br",
        feature.bgGradient,
        "border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02] cursor-pointer group",
        feature.onClick && "hover:shadow-lg"
      )}
      onClick={feature.onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={cn("p-2 rounded-lg bg-zinc-900/50", feature.color)}>
            <feature.icon size={20} />
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs px-2 py-0.5", getStatusColor(feature.status))}
            >
              <div className="flex items-center gap-1">
                {getStatusIcon(feature.status)}
                {feature.status}
              </div>
            </Badge>
          </div>
        </div>
        <div>
          <CardTitle className="text-base text-white group-hover:text-zinc-100 transition-colors">
            {feature.title}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700">
              {feature.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-zinc-400 text-sm leading-relaxed">
          {feature.description}
        </CardDescription>
        {feature.onClick && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-500">Click to explore</span>
            <ArrowRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-zinc-950 text-white h-full overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to ibeXcortex
            </h1>
            <p className="text-sm text-zinc-400">Autonomous Vehicle Testing & Simulation Platform</p>
          </div>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">
          Explore our comprehensive suite of tools designed for autonomous vehicle development, testing, and validation.
          Each feature is crafted to provide insights and capabilities essential for safe autonomous driving systems.
        </p>
      </div>

      {/* Main Navigation Features */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">Core Features</h2>
          <Badge className="bg-blue-900/30 text-blue-400 border-blue-700">
            Interactive
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationFeatures.map((feature, index) => renderFeatureCard(feature, index))}
        </div>
      </div>

      {/* Additional Features */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">Advanced Capabilities</h2>
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-zinc-700">
            Coming Soon
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {additionalFeatures.map((feature, index) => renderFeatureCard(feature, index))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
          <div className="text-2xl font-bold text-white mb-1">13</div>
          <div className="text-xs text-zinc-400">Total Features</div>
        </div>
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
          <div className="text-2xl font-bold text-green-400 mb-1">8</div>
          <div className="text-xs text-zinc-400">Stable Features</div>
        </div>
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
          <div className="text-2xl font-bold text-yellow-400 mb-1">4</div>
          <div className="text-xs text-zinc-400">Beta Features</div>
        </div>
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
          <div className="text-2xl font-bold text-blue-400 mb-1">1</div>
          <div className="text-xs text-zinc-400">New Features</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;