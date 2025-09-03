// Frontend/src/components/TabContent.tsx
import React, { type JSX } from 'react';

interface TabContentProps {
    tabs: { name: string; component: JSX.Element }[];
    activeTab: string | null;
}

const TabContent: React.FC<TabContentProps> = ({ tabs, activeTab }) => {
    return (
        <div className="flex-1 overflow-hidden">
            {tabs.map((tab) => (
                <div
                    key={tab.name}
                    style={{
                        display: activeTab === tab.name ? 'block' : 'none',
                        height: '100%'
                    }}
                >
                    {tab.component}
                </div>
            ))}
        </div>
    );
};

export default TabContent;