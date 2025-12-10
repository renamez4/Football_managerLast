
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000/api/auth";

export interface User {
    id: number;
    username: string;
    email: string;
    phone?: string;
    profileImage?: string;
    history?: {
        id: number;
        teamName: string;
        position: string;
        leftDate: string;
        matchStats: { wins: number; losses: number; draws: number };
    }[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    register: (data: any) => Promise<boolean>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<boolean>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refreshUser();
    }, []);

    const refreshUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                if (res.status === 401 || res.status === 403 || res.status === 422) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
        } catch (error) {
            console.error("Auth check error:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                setUser(data.user);
                return true;
            } else {
                alert(data.message || "เข้าสู่ระบบไม่สำเร็จ");
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            return false;
        }
    };

    const register = async (data: any): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                return true;
            } else {
                alert(result.message || "สมัครสมาชิกไม่สำเร็จ");
                return false;
            }
        } catch (error) {
            console.error("Register error:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    const updateProfile = async (data: Partial<User>): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return false;

            const res = await fetch(`${API_URL}/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                setUser(prev => prev ? { ...prev, ...result.user } : result.user);
                return true;
            } else {
                alert(result.message || "อัปเดตข้อมูลไม่สำเร็จ");
                return false;
            }
        } catch (error) {
            console.error("Update profile error:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
