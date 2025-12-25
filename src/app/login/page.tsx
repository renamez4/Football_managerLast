
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
// Removed BackgroundCanvas import

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            const success = await login(username, password);
            if (success) {
                router.push("/");
            }
        }
    };

    return (
        <>

            <div className="auth-container fade-in">
                <div className="card auth-card">
                    <div className="card-header text-center">
                        <h2 className="card-title text-primary">เข้าสู่ระบบ</h2>
                        <p className="card-description">ยินดีต้อนรับสู่ FootballManager</p>
                    </div>
                    <div className="card-content">
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">ชื่อผู้ใช้งาน หรือ อีเมล</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    required
                                    placeholder="กรอกชื่อผู้ใช้งานหรืออีเมลของคุณ"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">รหัสผ่าน</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    required
                                    placeholder="กรอกรหัสผ่าน"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                เข้าสู่ระบบ
                            </button>
                        </form>
                        <div className="text-center mt-4" style={{ fontSize: "0.9375rem" }}>
                            ยังไม่มีบัญชี?{" "}
                            <Link href="/register" className="text-primary" style={{ fontWeight: 600, textDecoration: "none" }}>
                                สมัครสมาชิก
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
