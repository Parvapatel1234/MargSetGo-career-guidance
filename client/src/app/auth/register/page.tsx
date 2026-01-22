"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

function RegisterContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    const [role, setRole] = useState("junior"); // Default to junior or null
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        college: "",
        department: "",
        year: "",
        mobile: "",
        // Junior fields
        interests: "",
        goals: "",
        // Senior fields
        passingYear: "",
        currentPosition: "",
        linkedin: "",
        guidanceDomains: ""
    });

    useEffect(() => {
        const roleParam = searchParams.get("role");
        if (roleParam === "senior" || roleParam === "junior") {
            setRole(roleParam);
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setLoading(true);

        const payload = {
            ...formData,
            role,
            // Convert comma-separated strings to arrays
            interests: formData.interests ? formData.interests.split(',').map(s => s.trim()) : [],
            guidanceDomains: formData.guidanceDomains ? formData.guidanceDomains.split(',').map(s => s.trim()) : []
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow py-28 px-4 sm:px-6 lg:px-8">
            <div className="glass max-w-4xl mx-auto p-10 rounded-2xl relative z-10">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Create Your Account
                </h2>
                <p className="text-center text-gray-600 mb-8">Join the community as {role === 'senior' ? 'a Senior' : 'a Junior'}</p>

                <div className="flex justify-center mb-10 space-x-4">
                    <button
                        type="button"
                        onClick={() => setRole("junior")}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${role === 'junior'
                            ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        I'm a Junior
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("senior")}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${role === 'senior'
                            ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        I'm a Senior
                    </button>
                </div>

                {error && <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 text-center rounded-lg">{error}</div>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Common Fields */}
                        <input type="text" name="name" placeholder="Full Name" required className="input-field" onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email Address" required className="input-field" onChange={handleChange} />
                        <input type="text" name="mobile" placeholder="Mobile Number" required className="input-field" onChange={handleChange} />
                        <input type="text" name="college" placeholder="College Name" required className="input-field" onChange={handleChange} />
                        <input type="text" name="department" placeholder="Department" required className="input-field" onChange={handleChange} />
                        <input type="text" name="year" placeholder="Current Year (e.g., 3rd Year)" required className="input-field" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Password" required className="input-field" onChange={handleChange} />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" required className="input-field" onChange={handleChange} />

                        {/* Junior Specific */}
                        {role === 'junior' && (
                            <>
                                <input type="text" name="interests" placeholder="Career Interests (comma separated)" className="input-field md:col-span-2" onChange={handleChange} />
                                <textarea name="goals" placeholder="Current Confusion / Goals" className="input-field md:col-span-2 h-24 pt-3" onChange={handleChange}></textarea>
                            </>
                        )}

                        {/* Senior Specific */}
                        {role === 'senior' && (
                            <>
                                <input type="text" name="passingYear" placeholder="Passing Year" required className="input-field" onChange={handleChange} />
                                <input type="text" name="currentPosition" placeholder="Current Position (Company/Higher Studies)" required className="input-field" onChange={handleChange} />
                                <input type="text" name="linkedin" placeholder="LinkedIn Profile URL (Optional)" className="input-field" onChange={handleChange} />
                                <input type="text" name="guidanceDomains" placeholder="Areas of Guidance (comma separated)" required className="input-field" onChange={handleChange} />
                            </>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed shadow-md text-base py-3"
                        >
                            {loading ? "Registering..." : `Sign Up as ${role === 'senior' ? 'Senior' : 'Junior'}`}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
            <style jsx>{`
        .input-field {
          @apply appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-white/50 backdrop-blur-sm transition-all;
        }
      `}</style>
        </div>
    );
}

export default function Register() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <Suspense fallback={<div className="flex-grow flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
                <RegisterContent />
            </Suspense>
            <Footer />
        </div>
    );
}
