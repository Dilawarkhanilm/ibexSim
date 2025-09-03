import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, HelpCircle } from "lucide-react";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import LoginBackground from "../assets/Images/loginBackground.png";

type LoginProps = {
    onLogin: () => void;
};

const APP_NAME = "CortexSim";
const VERSION = "v1.0.0.4.5";

/** Demo credentials */
const DEMO_EMAIL = "demo@ibexvision.ai";
const DEMO_PASSWORD = "Cortex@123";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate API call delay
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
        setShowForgotModal(true);
    };

    return (
        <>
            <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
                {/* Left side - Hero Image */}
                <div className="relative hidden lg:block">
                    <img
                        src={LoginBackground}
                        alt="CortexSim Technology"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-transparent" />
                </div>

                {/* Right side - Login Form */}
                <div className="flex items-center justify-center p-8 bg-gray-800">
                    <div className="w-full max-w-sm">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
                            <p className="text-sm text-gray-400">
                                Don't have an account?{" "}
                                <button className="text-primary-500 hover:text-primary-400 hover:underline transition-colors">
                                    Contact Us
                                </button>
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-12 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Forgot Password & Demo Credentials */}
                            <div className="flex items-center justify-between text-sm">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-400 hover:underline transition-colors disabled:opacity-50"
                                >
                                    <HelpCircle size={14} />
                                    Forgot password?
                                </button>

                                <div className="text-right text-gray-500">
                                    <div className="text-xs">Demo:</div>
                                    <div className="text-xs">
                                        <span className="text-gray-400">{DEMO_EMAIL}</span>
                                        <span className="mx-1">/</span>
                                        <span className="text-gray-400">{DEMO_PASSWORD}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-16 text-center space-y-1">
                            <div className="text-sm text-gray-400">{APP_NAME}</div>
                            <div className="text-xs text-gray-500">{VERSION}</div>
                            <div className="text-xs text-gray-600 mt-4">
                                © 2025 ibexVision. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
            />
        </>
    );
};

export default Login;