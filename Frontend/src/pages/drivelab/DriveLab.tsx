// Drive Lab Component
const DriveLab = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Drive Lab</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Autonomous Vehicle Testing Lab</h3>
            <p className="text-gray-400 mb-4">Advanced testing environment for autonomous vehicles.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Vehicle Configuration</h4>
                    <div className="space-y-2">
                        <input className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2" placeholder="Vehicle Model" />
                        <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2">
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Truck</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Sensor Setup</h4>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span>LiDAR</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span>Camera</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Radar</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default DriveLab