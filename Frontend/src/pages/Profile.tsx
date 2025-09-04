import { User } from "lucide-react";

// Profile Component
const Profile = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Developer</h3>
                    <p className="text-gray-400">demo@ibexvision.ai</p>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" defaultValue="Developer" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" defaultValue="demo@ibexvision.ai" />
                </div>
            </div>
        </div>
    </div>
);

export default Profile