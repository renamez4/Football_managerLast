"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import Link from "next/link";
import { useTeams } from "@/lib/teams";

export default function ProfilePage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const { teams } = useTeams();
    const [myTeams, setMyTeams] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && teams.length > 0) {
            // Check if user is in team.members or team.positions
            const userTeams = teams.filter(t =>
                (t.members && t.members.some((m: any) => m.username === user.username)) ||
                (t.positions && Object.values(t.positions).some((p: any) => p.player === user.username))
            );
            setMyTeams(userTeams);
        }
    }, [user, teams]);

    if (loading) {
        return (
            <>
                <BackgroundCanvas />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--foreground)' }}>
                    Loading...
                </div>
            </>
        );
    }

    if (!user) return null;

    return (
        <>
            <BackgroundCanvas />
            <BackgroundCanvas />
            <main>
                <div style={{ maxWidth: "800px", margin: "0 auto" }} className="fade-in">
                    <div className="card">
                        <div className="card-content" style={{ padding: "2rem" }}>
                            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                                <div style={{ flexShrink: 0 }}>
                                    <div className="profile-avatar" style={{ width: "120px", height: "120px", border: "4px solid var(--background)" }}>
                                        {user.profileImage ? (
                                            <img id="profileImage" src={user.profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                        ) : (
                                            <span id="profileAvatar" style={{ fontSize: "3rem" }}>👤</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <h3 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--foreground)" }}>
                                        {user.username}
                                    </h3>
                                    <div style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
                                        <p style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                            {user.email || 'ไม่ระบุ'}
                                        </p>
                                        <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                                            {user.phone || 'ไม่ระบุ'}
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link href="/profile/edit" className="btn btn-outline btn-sm" style={{ borderRadius: "20px", padding: "0.5rem 1.5rem" }}>แก้ไขโปรไฟล์</Link>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                                <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.5rem" }}>ทีมที่เข้าร่วม</h3>
                                <div className="grid grid-cols-2" style={{ gap: "1.5rem" }}>
                                    {myTeams.length > 0 ? (
                                        myTeams.map(team => (
                                            <div key={team.id} style={{ padding: "1.5rem", borderRadius: "16px", background: "#0f172a", border: "1px solid #1e293b", display: "flex", flexDirection: "column", height: "100%" }} >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, marginBottom: "0.25rem", fontSize: "1.25rem", color: "#fff" }}>{team.name}</div>
                                                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                                                        {(() => {
                                                            const userPositions = team.positions
                                                                ? Object.values(team.positions).filter((p: any) => p.player === user.username).map((p: any) => p.name)
                                                                : [];
                                                            return userPositions.length > 0 ? userPositions.join(", ") : "สมาชิกทีม";
                                                        })()}
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", padding: "0 1rem" }}>
                                                    <div style={{ textAlign: "center" }}>
                                                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.25rem" }}>ชนะ</div>
                                                        <div style={{ fontWeight: 700, color: "#10b981", fontSize: "1.1rem" }}>{team.matchStats?.wins || 0}</div>
                                                    </div>
                                                    <div style={{ textAlign: "center" }}>
                                                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.25rem" }}>เสมอ</div>
                                                        <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: "1.1rem" }}>{team.matchStats?.draws || 0}</div>
                                                    </div>
                                                    <div style={{ textAlign: "center" }}>
                                                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.25rem" }}>แพ้</div>
                                                        <div style={{ fontWeight: 700, color: "#ef4444", fontSize: "1.1rem" }}>{team.matchStats?.losses || 0}</div>
                                                    </div>
                                                </div>

                                                <Link href={`/teams/${team.id}`} className="btn btn-outline btn-sm w-full" style={{ justifyContent: 'center', borderRadius: "12px", borderColor: "#334155", color: "#e2e8f0" }}>ดูรายละเอียด</Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)", gridColumn: "span 2", background: "var(--background)", borderRadius: "var(--radius)", border: "2px dashed var(--border)" }}>
                                            <p style={{ marginBottom: "1rem" }}>ยังไม่ได้เข้าร่วมทีม</p>
                                            <Link href="/teams" className="btn btn-primary">ค้นหาทีม</Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {user.history && user.history.length > 0 && (
                                <div style={{ marginTop: "3rem" }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.25rem", color: "var(--muted)" }}>ประวัติการย้ายทีม (History)</h3>
                                    <div className="grid grid-cols-1" style={{ gap: "1rem" }}>
                                        {user.history.map((history, index) => (
                                            <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", background: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff", marginBottom: "0.25rem" }}>{history.teamName}</div>
                                                    <div style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                                                        เคยเล่นตำแหน่ง: <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{history.position}</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.25rem" }}>
                                                        {new Date(history.leftDate).toLocaleDateString('th-TH')}
                                                    </div>
                                                    <div style={{ fontSize: "0.8rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                                        <span style={{ color: "#10b981" }}>ชนะ {history.matchStats?.wins || 0}</span>
                                                        <span style={{ color: "#f59e0b" }}>เสมอ {history.matchStats?.draws || 0}</span>
                                                        <span style={{ color: "#ef4444" }}>แพ้ {history.matchStats?.losses || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
