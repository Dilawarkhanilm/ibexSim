// Scenario Generation Component
const ScenarioGeneration = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Scenario Generation</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Automated Scenario Builder</h3>
            <p className="text-gray-400 mb-4">Generate complex testing scenarios automatically.</p>
            <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Scenario Type</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="bg-blue-600 px-4 py-2 rounded text-sm">Highway</button>
                        <button className="bg-gray-600 px-4 py-2 rounded text-sm">Urban</button>
                        <button className="bg-gray-600 px-4 py-2 rounded text-sm">Parking</button>
                        <button className="bg-gray-600 px-4 py-2 rounded text-sm">Emergency</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ScenarioGeneration