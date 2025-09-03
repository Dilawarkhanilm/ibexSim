// Frontend/src/contexts/TabManagerContext.tsx
import React, { createContext, useContext, useState, type JSX, type ReactNode } from 'react';

interface Tab {
    name: string;
    component: JSX.Element;
    icon?: JSX.Element;
}

interface TabManagerContextType {
    tabList: Tab[];
    activeTab: string | null;
    addTab: (tab: Tab) => void;
    removeTab: (tabName: string) => void;
    setActiveTab: (tabName: string) => void;
    clearAllTabs: () => void;
}

const TabManagerContext = createContext<TabManagerContextType | undefined>(undefined);

export const TabManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tabList, setTabList] = useState<Tab[]>([]);
    const [activeTab, setActiveTabState] = useState<string | null>(null);

    const addTab = (tab: Tab) => {
        setTabList(prev => {
            // Check if tab already exists
            const existingIndex = prev.findIndex(t => t.name === tab.name);
            if (existingIndex !== -1) {
                // Update existing tab
                const newTabs = [...prev];
                newTabs[existingIndex] = tab;
                return newTabs;
            }
            // Add new tab
            return [...prev, tab];
        });
        setActiveTabState(tab.name);
    };

    const removeTab = (tabName: string) => {
        setTabList(prev => {
            const filtered = prev.filter(tab => tab.name !== tabName);

            // If we're removing the active tab, switch to another tab
            if (activeTab === tabName && filtered.length > 0) {
                setActiveTabState(filtered[filtered.length - 1].name);
            } else if (filtered.length === 0) {
                setActiveTabState(null);
            }

            return filtered;
        });
    };

    const setActiveTab = (tabName: string) => {
        setActiveTabState(tabName);
    };

    const clearAllTabs = () => {
        setTabList([]);
        setActiveTabState(null);
    };

    return (
        <TabManagerContext.Provider value={{
            tabList,
            activeTab,
            addTab,
            removeTab,
            setActiveTab,
            clearAllTabs
        }}>
            {children}
        </TabManagerContext.Provider>
    );
};

export const useTabManager = () => {
    const context = useContext(TabManagerContext);
    if (!context) {
        throw new Error('useTabManager must be used within TabManagerProvider');
    }
    return context;
};