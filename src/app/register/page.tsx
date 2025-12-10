
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
    });
    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await register(formData);
        if (success) {
            router.push("/login");
        }
    };

    return (
        <>
            <BackgroundCanvas />
            <div className="auth-container fade-in">
                <div className="card auth-card">
                    <div className="card-header text-center">
                        <h2 className="card-title text-primary">สมัครสมาชิก</h2>
                        <p className="card-description">สร้างบัญชีใหม่เพื่อเข้าร่วมทีม</p>
                    </div>
                    <div className="card-content">
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label className="form-label">ชื่อผู้ใช้งาน</label>
                                <input
                                    name="username"
                                    type="text"
                                    className="form-input"
                                    required
                                    placeholder="ตั้งชื่อผู้ใช้งาน"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">อีเมล</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="form-input"
                                    required
                                    placeholder="example@email.com"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">รหัสผ่าน</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="form-input"
                                    required
                                    minLength={6}
                                    placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                                    onChange={handleChange}
                                />
                                <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                                    ความยาวอย่างน้อย 6 ตัวอักษร
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">เบอร์โทรศัพท์</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    className="form-input"
                                    placeholder="08x-xxx-xxxx"
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                สมัครสมาชิก
                            </button>
                        </form>
                        <div className="text-center mt-4" style={{ fontSize: "0.9375rem" }}>
                            มีบัญชีอยู่แล้ว?{" "}
                            <Link href="/login" className="text-primary" style={{ fontWeight: 600, textDecoration: "none" }}>
                                เข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
