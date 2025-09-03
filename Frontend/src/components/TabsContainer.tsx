// Frontend/src/components/TabsContainer.tsx
import React, { type JSX } from "react";
import { X } from "lucide-react";

interface TabsContainerProps {
    tabs: { name: string; component: JSX.Element; icon?: JSX.Element }[];
    activeTab: string | null;
    setActiveTab: (tabName: string) => void;
    onCloseTab: (tabName: string) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
    tabs,
    activeTab,
    setActiveTab,
    onCloseTab,
}) => {
    return (
        <div className="w-full bg-gray-800 border-b border-gray-700">
            <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        className={`relative flex items-center min-w-0 max-w-xs border-r border-gray-700 ${activeTab === tab.name
                                ? "bg-gray-700 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
                            }`}
                    >
                        <button
                            onClick={() => setActiveTab(tab.name)}
                            className="flex items-center px-3 py-2 text-sm focus:outline-none w-full min-w-0"
                        >
                            {tab.icon && (
                                <span className="mr-2 flex-shrink-0">
                                    {tab.icon}
                                </span>
                            )}
                            <span className="truncate flex-1">{tab.name}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(tab.name);
                            }}
                            className={`px-2 py-2 hover:bg-gray-600 focus:outline-none ${activeTab === tab.name ? "text-gray-300" : "text-gray-500"
                                } hover:text-white`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabsContainer;