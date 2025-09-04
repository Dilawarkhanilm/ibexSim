import { FileText } from "lucide-react";

// File Viewer Component
const FileViewer = () => (
    <div className="p-6 bg-gray-900 text-white h-full">
        <h2 className="text-2xl font-bold mb-4">File Viewer</h2>
        <div className="bg-gray-800 rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Project Files</h3>
                <button className="bg-blue-600 px-4 py-2 rounded text-sm">Upload File</button>
            </div>
            <div className="bg-gray-700 rounded p-4 h-96">
                <div className="text-center text-gray-400 mt-32">
                    <FileText size={48} className="mx-auto mb-2" />
                    <p>No files selected</p>
                    <p className="text-sm">Select a file to view its contents</p>
                </div>
            </div>
        </div>
    </div>
);

export default FileViewer