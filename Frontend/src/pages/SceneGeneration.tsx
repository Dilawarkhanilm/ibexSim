// Scene Generation Component
const SceneGeneration = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Scene Generation</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generate Virtual Scenes</h3>
            <p className="text-gray-400 mb-4">Create realistic driving scenarios for testing.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Weather Conditions</h4>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2">
                        <option>Clear</option>
                        <option>Rain</option>
                        <option>Snow</option>
                        <option>Fog</option>
                    </select>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Time of Day</h4>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2">
                        <option>Day</option>
                        <option>Night</option>
                        <option>Dawn</option>
                        <option>Dusk</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
);
export default SceneGeneration;