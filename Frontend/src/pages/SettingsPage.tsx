// Settings Component
const SettingsPage = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">General</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Theme</label>
                        <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2">
                            <option>Dark</option>
                            <option>Light</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2">
                            <option>English</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
);



export default SettingsPage