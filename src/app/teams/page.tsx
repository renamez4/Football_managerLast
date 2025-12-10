
"use client";

import { useState } from "react";
import { useTeams } from "@/lib/teams";
import Link from "next/link";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import { TiltCard } from "@/components/ui/TiltCard";
import { useAuth } from "@/lib/auth";

export default function TeamsPage() {
    const { teams, loading } = useTeams();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <BackgroundCanvas />

            <section className="hero fade-in" style={{ padding: "4rem 1.5rem", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>ค้นหาทีมของคุณ</h1>
                    <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "500px" }}>
                        เข้าร่วมทีมที่ใช่ แข่งขันในแมตช์ที่ชอบ และพัฒนาฝีเท้าไปด้วยกัน
                    </p>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อทีม..."
                            className="form-input"
                            style={{ paddingLeft: "2.5rem", width: "300px" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    {user && (
                        <Link href="/teams/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            สร้างทีมใหม่
                        </Link>
                    )}
                </div>
            </section>

            <div className="grid grid-cols-3 gap-6 fade-in delay-200 mt-8" id="teamsContainer" style={{ marginTop: "2rem" }}>
                {loading ? (
                    <div className="col-span-full text-center py-20 text-muted">กำลังโหลดข้อมูล...</div>
                ) : filteredTeams.length === 0 ? (
                    <div className="col-span-full text-center py-16" style={{ background: "var(--surface-glass)", borderRadius: "var(--radius)", border: "2px dashed var(--border)" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏟️</div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>ไม่พบทีมที่ค้นหา</h3>
                        <p style={{ marginBottom: "1.5rem", color: "var(--muted)" }}>ลองค้นหาด้วยคำค้นอื่น หรือสร้างทีมใหม่</p>
                        {user && <Link href="/teams/create" className="btn btn-primary">สร้างทีมแรก</Link>}
                    </div>
                ) : (
                    filteredTeams.map((team) => {


                        return (
                            <TiltCard key={team.id} className="card">
                                {team.logo ? (
                                    <div style={{ height: "180px", overflow: "hidden", borderBottom: "1px solid var(--border)", position: "relative" }}>
                                        <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
                                        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                                            <span className={`badge ${team.status === 'Open' ? 'badge-success' : 'badge-danger'}`}
                                                style={team.status !== 'Open' ? {
                                                    background: "rgba(220, 38, 38, 0.15)",
                                                    borderColor: "var(--danger)"
                                                } : undefined}>
                                                {team.status === 'Open' ? 'เปิดรับสมัคร' : 'ทีมเต็ม'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ height: "180px", background: "linear-gradient(135deg, var(--primary-light), var(--background))", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                        <div style={{ fontSize: "3rem", opacity: 0.5 }}>⚽</div>
                                        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                                            <span className={`badge ${team.status === 'Open' ? 'badge-success' : 'badge-danger'}`}
                                                style={team.status !== 'Open' ? {
                                                    background: "rgba(220, 38, 38, 0.15)",
                                                    borderColor: "var(--danger)"
                                                } : undefined}>
                                                {team.status === 'Open' ? 'เปิดรับสมัคร' : 'ทีมเต็ม'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="card-header" style={{ paddingBottom: "0.5rem" }}>
                                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>{team.name}</h3>
                                    <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{team.details}</p>
                                </div>
                                <div className="card-content" style={{ paddingTop: "0.5rem" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9375rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--foreground)" }}>
                                            <div style={{ width: "32px", height: "32px", background: "var(--primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            </div>
                                            <span>{team.time}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--foreground)" }}>
                                            <div style={{ width: "32px", height: "32px", background: "var(--primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                            </div>
                                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                                <span style={{ fontWeight: 500 }}>ตัวจริง: <strong style={{ color: "var(--primary)" }}>{team.stats?.starters.filled || 0}/{team.stats?.starters.total || 11}</strong></span>
                                                <span style={{ fontWeight: 500 }}>ตัวสำรอง: <strong style={{ color: "var(--muted)" }}>{team.stats?.subs.filled || 0}/{team.stats?.subs.total || 5}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer" style={{ background: "transparent", borderTop: "none", paddingTop: 0 }}>
                                    <Link href={`/teams/${team.id}`} className="btn btn-outline w-full" style={{ justifyContent: "center" }}>
                                        ดูรายละเอียด
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "0.25rem" }}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                    </Link>
                                </div>
                            </TiltCard>
                        );
                    })
                )}
            </div>
        </>
    );
}
