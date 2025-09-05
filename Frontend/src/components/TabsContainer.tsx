import React, { type JSX } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TabsContainerProps {
    className?: string;
    tabs: { name: string; component: JSX.Element; icon?: JSX.Element }[];
    activeTab: string | null;
    setActiveTab: (tabName: string) => void;
    onCloseTab: (tabName: string) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
    className,
    tabs,
    activeTab,
    setActiveTab,
    onCloseTab,
}) => {
    return (
        <div className={cn(
            "w-full bg-zinc-900 border-b border-zinc-800",
            className
        )}>
            <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        className={cn(
                            "relative flex items-center min-w-0 max-w-xs border-r border-zinc-800 group",
                            activeTab === tab.name
                                ? "bg-zinc-800 text-white"
                                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                        )}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab(tab.name)}
                            className={cn(
                                "flex items-center px-3 py-1.5 text-xs h-8 flex-1 min-w-0 justify-start rounded-none border-0 pr-1",
                                activeTab === tab.name
                                    ? "text-white hover:text-white hover:bg-zinc-800"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                            )}
                        >
                            {tab.icon && (
                                <span className="mr-2 flex-shrink-0">
                                    {React.isValidElement(tab.icon)
                                        ? React.cloneElement(tab.icon as React.ReactElement<any>, { className: "w-3 h-3" })
                                        : tab.icon
                                    }
                                </span>
                            )}
                            <span className="truncate text-left">{tab.name}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(tab.name);
                            }}
                            className={cn(
                                "p-0 h-6 w-6 mr-1 rounded hover:bg-zinc-700 border-0 flex-shrink-0",
                                activeTab === tab.name
                                    ? "text-zinc-300 hover:text-white"
                                    : "text-zinc-500 hover:text-white",
                                "opacity-0 group-hover:opacity-100 transition-opacity"
                            )}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Custom scrollbar styles */}
            <style  >{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default TabsContainer;