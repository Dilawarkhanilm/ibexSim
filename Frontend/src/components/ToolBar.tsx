import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    FileText,
    FolderOpen,
    Save,
    Undo,
    Redo,
    Play,
    Square,
    RotateCcw,
    Settings,
    HelpCircle,
    Search,
    Copy,
    Scissors,
    ClipboardPaste
} from 'lucide-react';

interface ToolBarProps {
    className?: string;
    onNewFile?: () => void;
    onOpenFolder?: () => void;
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onRun?: () => void;
    onStop?: () => void;
    onRestart?: () => void;
    onCut?: () => void;
    onCopy?: () => void;
    onPaste?: () => void;
    onSearch?: () => void;
    onSettings?: () => void;
    onHelp?: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
    className,
    onNewFile,
    onOpenFolder,
    onSave,
    onUndo,
    onRedo,
    onRun,
    onStop,
    onRestart,
    onCut,
    onCopy,
    onPaste,
    onSearch,
    onSettings,
    onHelp
}) => {
    const toolbarItems = [
        // File operations group
        {
            items: [
                {
                    icon: FileText,
                    tooltip: 'New File (Ctrl+N)',
                    onClick: onNewFile,
                    variant: 'default' as const
                },
                {
                    icon: FolderOpen,
                    tooltip: 'Open Folder (Ctrl+K Ctrl+O)',
                    onClick: onOpenFolder,
                    variant: 'default' as const
                },
                {
                    icon: Save,
                    tooltip: 'Save (Ctrl+S)',
                    onClick: onSave,
                    variant: 'default' as const
                }
            ]
        },
        // Edit operations group
        {
            items: [
                {
                    icon: Scissors,
                    tooltip: 'Cut (Ctrl+X)',
                    onClick: onCut,
                    variant: 'default' as const
                },
                {
                    icon: Copy,
                    tooltip: 'Copy (Ctrl+C)',
                    onClick: onCopy,
                    variant: 'default' as const
                },
                {
                    icon: ClipboardPaste,
                    tooltip: 'Paste (Ctrl+V)',
                    onClick: onPaste,
                    variant: 'default' as const
                }
            ]
        },
        // History operations group
        {
            items: [
                {
                    icon: Undo,
                    tooltip: 'Undo (Ctrl+Z)',
                    onClick: onUndo,
                    variant: 'default' as const
                },
                {
                    icon: Redo,
                    tooltip: 'Redo (Ctrl+Y)',
                    onClick: onRedo,
                    variant: 'default' as const
                }
            ]
        },
        // Run operations group
        {
            items: [
                {
                    icon: Play,
                    tooltip: 'Start Debugging (F5)',
                    onClick: onRun,
                    variant: 'success' as const
                },
                {
                    icon: Square,
                    tooltip: 'Stop (Shift+F5)',
                    onClick: onStop,
                    variant: 'destructive' as const
                },
                {
                    icon: RotateCcw,
                    tooltip: 'Restart (Ctrl+Shift+F5)',
                    onClick: onRestart,
                    variant: 'default' as const
                }
            ]
        },
        // Tools group
        {
            items: [
                {
                    icon: Search,
                    tooltip: 'Search (Ctrl+F)',
                    onClick: onSearch,
                    variant: 'default' as const
                },
                {
                    icon: Settings,
                    tooltip: 'Settings (Ctrl+,)',
                    onClick: onSettings,
                    variant: 'default' as const
                },
                {
                    icon: HelpCircle,
                    tooltip: 'Help (F1)',
                    onClick: onHelp,
                    variant: 'default' as const
                }
            ]
        }
    ];

    const getButtonVariant = (variant: string): "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" => {
        switch (variant) {
            case 'success':
                return 'ghost';
            case 'destructive':
                return 'ghost';
            default:
                return 'ghost';
        }
    };

    const getButtonClassName = (variant: string) => {
        switch (variant) {
            case 'success':
                return 'text-green-400 hover:text-green-300 hover:bg-zinc-800';
            case 'destructive':
                return 'text-red-400 hover:text-red-300 hover:bg-zinc-800';
            default:
                return 'text-zinc-400 hover:text-white hover:bg-zinc-800';
        }
    };

    return (
        <TooltipProvider delayDuration={500}>
            <div className={cn(
                "h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-2 gap-1",
                className
            )}>
                {toolbarItems.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                        {groupIndex > 0 && (
                            <Separator orientation="vertical" className="h-5 bg-zinc-700 mx-1" />
                        )}
                        <div className="flex items-center gap-0.5">
                            {group.items.map((item, itemIndex) => {
                                const Icon = item.icon;

                                return (
                                    <Tooltip key={itemIndex}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={getButtonVariant(item.variant)}
                                                size="sm"
                                                className={cn(
                                                    "w-7 h-7 p-0",
                                                    getButtonClassName(item.variant)
                                                )}
                                                onClick={item.onClick}
                                            >
                                                <Icon size={14} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="bottom"
                                            className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs"
                                        >
                                            {item.tooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </TooltipProvider>
    );
};

export default ToolBar;