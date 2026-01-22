"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <div className="flex-grow flex items-center justify-center py-28 px-4 sm:px-6 lg:px-8">
                <div className="glass max-w-md w-full space-y-8 p-10 rounded-2xl relative z-10">
                    <div>
                        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Sign in to continue your career journey
                        </p>
                    </div>
                    {error && <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-center text-sm rounded-lg">{error}</div>}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed shadow-md text-sm py-3"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <span className="text-gray-600">New to MargSetGo? </span>
                            <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
                                Create an account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
