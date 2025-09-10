// src/components/modals/CreateNewProjectModal.tsx
import * as React from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CreateProjectPayload = {
    name: string;
    /** optional - backend can decide location if omitted */
    directory?: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (p: CreateProjectPayload) => void;
    /** used silently; not shown in UI */
    defaultDirectory?: string;
    className?: string;
};

export default function CreateNewProjectModal({
    open,
    onOpenChange,
    onCreate,
    defaultDirectory,
    className,
}: Props) {
    const [name, setName] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setName("");
            setSubmitting(false);
        }
    }, [open]);

    const canCreate = name.trim().length > 0 && !submitting;

    const handleCreate = async () => {
        if (!canCreate) return;
        setSubmitting(true);
        try {
            onCreate({ name: name.trim(), directory: defaultDirectory });
            onOpenChange(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
            <DialogContent
                className={cn(
                    "sm:max-w-md bg-card border-border text-card-foreground",
                    className
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-base text-foreground">
                        Create New Project
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground">
                        Create a new workspace and initial content.
                    </p>
                </DialogHeader>

                <div className="grid gap-3 pt-2">
                    <div className="grid gap-2">
                        <Label htmlFor="workspaceName" className="text-xs text-foreground">
                            Workspace Name
                        </Label>
                        <Input
                            id="workspaceName"
                            placeholder="Enter here..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-input border-border text-sm text-foreground placeholder:text-muted-foreground placeholder:text-xs"
                            autoFocus
                            disabled={submitting}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreate();
                            }}
                        />
                        <p className="text-[11px] text-muted-foreground">
                            Location will be selected automatically. You can change it later in Settings → Workspaces.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        onClick={handleCreate}
                        disabled={!canCreate}
                    >
                        {submitting ? "Creating…" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}