import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { User, LogOut, Mail, Edit3 } from 'lucide-react';

interface ProfileProps {
    className?: string;
    onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ className, onLogout }) => {
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <div className={cn(
            "p-4 bg-zinc-950 text-white h-full overflow-auto",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-200">User Profile</h2>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700"
                >
                    <LogOut className="w-3 h-3 mr-1" />
                    Logout
                </Button>
            </div>

            <div className="space-y-4">
                {/* Profile Overview Card */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Avatar and Basic Info */}
                        <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-zinc-700 text-zinc-300">
                                    <User size={20} />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-zinc-200">Developer</h3>
                                <p className="text-xs text-zinc-400 flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    demo@ibexvision.ai
                                </p>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs border-zinc-700 hover:bg-zinc-800">
                                <Edit3 className="w-3 h-3" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-400">Full Name</Label>
                            <Input
                                defaultValue="Developer"
                                className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-300"
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-400">Email Address</Label>
                            <Input
                                defaultValue="demo@ibexvision.ai"
                                className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-300"
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-400">Role</Label>
                            <Input
                                defaultValue="Software Developer"
                                className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-300"
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-400">Department</Label>
                            <Input
                                defaultValue="Autonomous Vehicle Testing"
                                className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-300"
                                readOnly
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System Information */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">System Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-zinc-400">Last Login:</span>
                                <div className="text-zinc-300">Today, 09:30 AM</div>
                            </div>
                            <div>
                                <span className="text-zinc-400">Session Time:</span>
                                <div className="text-zinc-300">2h 45m</div>
                            </div>
                            <div>
                                <span className="text-zinc-400">Platform Version:</span>
                                <div className="text-zinc-300">v1.0.4.5</div>
                            </div>
                            <div>
                                <span className="text-zinc-400">License Type:</span>
                                <div className="text-zinc-300">Enterprise</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-200">Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Dark Theme</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Auto-save Projects</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Email Notifications</span>
                            <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Performance Metrics</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="bg-zinc-800" />

                
            </div>
        </div>
    );
};

export default Profile;