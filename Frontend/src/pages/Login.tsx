import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, HelpCircle, Loader2, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import BackgroundImage from "../assets/Images/loginBackground.png";

// Props
type LoginProps = {
    onLogin: () => void;
};

const APP_NAME = "CortexSim";
const VERSION = "v1.0.0.4.5";

/** Demo credentials */
const DEMO_EMAIL = "demo@ibexvision.ai";
const DEMO_PASSWORD = "Cortex@123";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState(DEMO_EMAIL);
    const [password, setPassword] = useState(DEMO_PASSWORD);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [showResetSuccess, setShowResetSuccess] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const isValidLogin =
                email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() &&
                password === DEMO_PASSWORD;

            if (isValidLogin) {
                onLogin();
            } else {
                setError("Invalid email or password. Please check your credentials and try again.");
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleForgotPassword = () => {
        if (resetEmail.trim()) {
            setShowResetSuccess(true);
            setTimeout(() => {
                setShowResetSuccess(false);
                setShowResetDialog(false);
                setResetEmail("");
            }, 3000);
        }
    };

    const handleContactUs = () => {
        // You can implement a custom modal here too if needed
        alert("Contact flow coming soon");
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left side - Hero Section */}
            <div className="hidden lg:flex lg:flex-1 relative">
                <img
                    src={BackgroundImage}
                    alt="Login Background"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950">
                <div className="w-full max-w-md">
                    <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl">
                        <CardHeader className="space-y-1 pb-8">
                            <CardTitle className="text-3xl font-bold text-white text-center">
                                Sign In
                            </CardTitle>
                            <CardDescription className="text-zinc-400 text-center">
                                Enter your credentials to access {APP_NAME}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-300 font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="demo@ibexvision.ai"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            autoComplete="email"
                                            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-zinc-300 font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            autoComplete="current-password"
                                            className="pl-10 pr-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="p-0 h-auto text-blue-400 hover:text-blue-300 text-sm"
                                        onClick={() => setShowResetDialog(true)}
                                    >
                                        <HelpCircle className="w-4 h-4 mr-1" />
                                        Forgot password?
                                    </Button>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                                        <p className="text-sm text-red-300">{error}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex flex-col items-center space-y-2 pt-6 border-t border-zinc-800">
                            <div className="text-center space-y-1">
                                <p className="text-sm text-zinc-400">
                                    Need access?{" "}
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-blue-400 hover:text-blue-300"
                                        onClick={handleContactUs}
                                    >
                                        Contact Us
                                    </Button>
                                </p>
                            </div>

                            {/* App Info */}
                            <div className="text-center space-y-1 pt-4">
                                <div className="text-sm font-medium text-zinc-300">{APP_NAME}</div>
                                <div className="text-xs text-zinc-500">{VERSION}</div>
                                <div className="text-xs text-zinc-600 pt-1">
                                    © 2025 ibexVision. All rights reserved.
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Custom Reset Password Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowResetDialog(false)}
                    />

                    {/* Dialog Content */}
                    <div className="relative z-10 w-full max-w-md mx-4">
                        <Card className="border-zinc-800 bg-zinc-900 shadow-2xl">
                            <CardHeader className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowResetDialog(false)}
                                    className="absolute right-2 top-2 h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <CardTitle className="text-xl font-semibold text-white">
                                    Reset Password
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Enter your email address and we'll send you reset instructions.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {showResetSuccess ? (
                                    <Alert className="border-green-500/30 bg-green-500/10">
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        <AlertDescription className="text-green-300">
                                            Reset link sent successfully! Please check your email.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="resetEmail" className="text-zinc-300">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    id="resetEmail"
                                                    type="email"
                                                    placeholder="demo@ibexvision.ai"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            onClick={handleForgotPassword}
                                            disabled={!resetEmail.trim()}
                                        >
                                            Send Reset Link
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;