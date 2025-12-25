
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { DoorOpen, Trophy, Users, User } from "lucide-react";

export function Navbar() {
    const { user, loading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) return <nav className="navbar"></nav>;

    return (
        <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" className="navbar-brand">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    <span>FootballManager</span>
                </Link>

                <nav className="navbar-links">
                    <Link href="/teams" className="flex items-center gap-2 group">
                        <Users size={18} className="nav-icon" />
                        <span>ทีมทั้งหมด</span>
                    </Link>
                    <Link href="/info/football" className="flex items-center gap-2 group">
                        <Trophy size={18} className="nav-icon" />
                        <span>ข้อมูลกีฬา</span>
                    </Link>
                </nav>

                <div className="navbar-actions">
                    {!loading && user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: '1rem' }}>
                            <Magnetic>
                                <Link href="/profile" className="btn btn-ghost" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                    <User size={18} className="nav-icon" />
                                    {user.username}
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <button
                                    onClick={() => {
                                        if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                                            localStorage.removeItem("token");
                                            window.location.href = "/";
                                        }
                                    }}
                                    className="btn btn-outline btn-sm flex items-center gap-2"
                                    style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                >
                                    <DoorOpen size={18} className="nav-icon" />
                                    ออกจากระบบ
                                </button>
                            </Magnetic>
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Magnetic>
                                <Link href="/login" className="btn btn-ghost btn-sm">เข้าสู่ระบบ</Link>
                            </Magnetic>
                            <Magnetic>
                                <Link href="/register" className="btn btn-primary btn-sm">สมัครสมาชิก</Link>
                            </Magnetic>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
