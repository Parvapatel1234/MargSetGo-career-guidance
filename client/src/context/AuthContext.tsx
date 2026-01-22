"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'junior' | 'senior';
    token: string;
    profile?: {
        college?: string;
        department?: string;
        currentPosition?: string;
        guidanceDomains?: string[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token); // Store token separately if needed
        setUser(userData);

        // Redirect based on role
        if (userData.role === 'senior') {
            router.push('/dashboard/senior');
        } else {
            router.push('/dashboard/junior');
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
