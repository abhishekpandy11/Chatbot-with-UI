"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BackgroundGradient from "@/components/BackgroundGradient";
import SpotlightCard from "@/components/SpotlightCard";
import AceternityInput from "@/components/AceternityInput";
import AceternityButton from "@/components/AceternityButton";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Signup() {
    const router = useRouter();
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!user.username.trim()) newErrors.username = "Username is required";
        if (!user.email.trim()) newErrors.email = "Email is required";
        if (!user.password.trim()) newErrors.password = "Password is required";
        if (user.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/signup`, user);
            router.push("/login");
        } catch (error) {
            setErrors({ general: error.response?.data?.detail || "Signup failed" });
        }
        setLoading(false);
    };

    return (
        <BackgroundGradient>
            <SpotlightCard
                title="Create Account"
                subtitle="Join us today"
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
                        placeholder="Choose a username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        error={errors.username}
                    />

                    <AceternityInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        error={errors.email}
                    />

                    <AceternityInput
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        error={errors.password}
                    />

                    <AceternityButton type="submit" disabled={loading} variant="success" className="w-full">
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                Creating account...
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </AceternityButton>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white/60">
                        Already have an account?{" "}
                        <a href="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                            Sign in
                        </a>
                    </p>
                </div>
            </SpotlightCard>
        </BackgroundGradient>
    );
}