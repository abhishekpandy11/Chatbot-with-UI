"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import BackgroundGradient from "@/components/BackgroundGradient";
import SpotlightCard from "@/components/SpotlightCard";
import AceternityInput from "@/components/AceternityInput";
import AceternityButton from "@/components/AceternityButton";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!user.username.trim()) newErrors.username = "Username is required";
        if (!user.password.trim()) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/login`, user);
            Cookies.set("access_token", res.data.access_token);
            Cookies.set("refresh_token", res.data.refresh_token);
            router.push("/chat");
        } catch (error) {
            setErrors({ general: error.response?.data?.detail || "Login failed" });
        }
        setLoading(false);
    };

    return (
        <BackgroundGradient>
            <SpotlightCard
                title="Welcome Back"
                subtitle="Sign in to your account"
                className="max-w-md w-full"
            >
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                        <p className="text-red-400 text-sm">{errors.general}</p>
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-2">
                    <AceternityInput
                        label="Username"
                        placeholder="Enter your username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        error={errors.username}
                    />

                    <AceternityInput
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        error={errors.password}
                    />

                    <AceternityButton type="submit" disabled={loading} className="w-full">
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </AceternityButton>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white/60">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Sign up
                        </a>
                    </p>
                </div>
            </SpotlightCard>
        </BackgroundGradient>
    );
}