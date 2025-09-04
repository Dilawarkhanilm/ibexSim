// Dashboard Component - Full screen without tabs
const Dashboard = () => (
    <div className="p-6 bg-gray-900 text-white h-full overflow-auto">
        <div className="text-center py-8">
            <h1 className="text-3xl font-light text-white mb-2">
                ibexXcortex Dashboard
            </h1>
            <p className="text-gray-400 text-sm mb-8">
                Autonomous Vehicle Testing & Simulation Platform v1.0.4.5
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Start Section */}
            <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-white font-medium text-lg mb-4">Start</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>New Project</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+N</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Open Project</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+O</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Open Folder</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+K</span>
                    </div>
                    <div className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Clone Repository</span>
                    </div>
                </div>
            </div>

            {/* Testing Section */}
            <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-white font-medium text-lg mb-4">Testing</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>New Simulation</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+S</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Quick Test</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+T</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Scenario Builder</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+B</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Batch Processing</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Shift+Ctrl+P</span>
                    </div>
                </div>
            </div>

            {/* Tools Section */}
            <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-white font-medium text-lg mb-4">Tools</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Settings</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+,</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>Keyboard Shortcuts</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ctrl+K</span>
                    </div>
                    <div className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <span>User Snippets</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Projects */}
        <div className="mt-12">
            <h2 className="text-white text-xl font-medium mb-6">Recents</h2>
            <div className="space-y-3">
                {[
                    'Highway_Scenario_Test',
                    'Urban_Navigation_Sim',
                ].map((project, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800/30 p-3 rounded-lg cursor-pointer transition-colors"
                    >
                        <div className="w-4 h-4 bg-yellow-500 rounded-sm flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                                {project}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                C:\\Users\\Developer\\Desktop\\Scenarios.test
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Dashboard;