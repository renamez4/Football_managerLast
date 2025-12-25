"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
// Removed BackgroundCanvas import
import { TiltCard } from "@/components/ui/TiltCard";
import Link from "next/link";
import { useTeams } from "@/lib/teams";

export default function ProfilePage() {
    const { user, logout, loading, refreshUser } = useAuth();
    const router = useRouter();
    const { teams } = useTeams();
    const [myTeams, setMyTeams] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'matches' | 'history'>('overview');

    useEffect(() => {
        refreshUser();
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // --- SMART LOGIC FILTERING ---
    useEffect(() => {
        if (user && teams.length > 0) {
            const userTeams = teams.filter(t => {
                const isMember = (t.members && t.members.some((m: any) => m.username === user.username)) ||
                    (t.positions && Object.values(t.positions).some((p: any) => p.player === user.username));

                if (!isMember) return false;

                // Logic Refinement (Smart Visibility):
                // 1. If team has no stats, always show.
                // 2. If team has stats, check if these stats are already fully recorded in user's history.
                //    - If User has NO history for this team -> Show (User joined an existing team with stats).
                //    - If User HAS history, but it matches current Team stats exactly -> Hide (Archived/Finished).
                //    - If User HAS history, but it differs -> Show (Update occurred or out of sync).

                const hasStats = t.matchStats && (t.matchStats.wins > 0 || t.matchStats.draws > 0 || t.matchStats.losses > 0);
                if (!hasStats) return true;

                const teamHistory = user.matchHistory
                    ? user.matchHistory.filter((m: any) => m.teamName === t.name)
                    : [];

                // If no history, but has stats -> Show (New joiner)
                if (teamHistory.length === 0) return true;

                // Find latest history entry
                const latestMatch = teamHistory.sort((a: any, b: any) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())[0];

                const teamStats = t.matchStats || { wins: 0, draws: 0, losses: 0 };
                const histStats = latestMatch.matchStats || { wins: 0, draws: 0, losses: 0 };

                const isFullyRecorded = teamStats.wins === histStats.wins &&
                    teamStats.draws === histStats.draws &&
                    teamStats.losses === histStats.losses;

                return !isFullyRecorded;
            });

            // Sort by ID Descending (Newest teams first)
            userTeams.sort((a: any, b: any) => b.id - a.id);

            setMyTeams(userTeams);
        }
    }, [user, teams]);

    if (loading) {
        return (
            <>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--foreground)' }}>
                    Loading...
                </div>
            </>
        );
    }

    if (!user) return null;

    // Helper for summary stats
    const totalMatches = user.matchHistory ? user.matchHistory.length : 0;
    const totalWins = user.matchHistory ? user.matchHistory.filter((m: any) => m.result === 'win').length : 0;
    const totalDraws = user.matchHistory ? user.matchHistory.filter((m: any) => m.result === 'draw').length : 0;
    const totalLosses = user.matchHistory ? user.matchHistory.filter((m: any) => m.result === 'loss').length : 0;

    return (
        <>


            <main style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }} className="fade-in">

                    {/* Header / Tabs */}
                    <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
                        <div style={{
                            display: "inline-flex",
                            background: "rgba(15, 23, 42, 0.6)",
                            backdropFilter: "blur(10px)",
                            padding: "0.5rem",
                            borderRadius: "99px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                            justifyContent: "center"
                        }}>
                            {[
                                { id: 'overview', label: 'ภาพรวม', icon: '👤' },
                                { id: 'teams', label: 'ทีมของฉัน', icon: '🛡️' },
                                { id: 'matches', label: 'ผลการแข่งขัน', icon: '⚔️' },
                                { id: 'history', label: 'ประวัติย้ายทีม', icon: '📜' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    style={{
                                        padding: "0.75rem 1.5rem",
                                        borderRadius: "99px",
                                        border: "none",
                                        background: activeTab === tab.id ? "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)" : "transparent",
                                        color: activeTab === tab.id ? "#fff" : "var(--muted)",
                                        fontWeight: activeTab === tab.id ? 700 : 500,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        fontSize: "0.95rem"
                                    }}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="card" style={{ minHeight: "500px", overflow: "hidden" }}>
                        <div className="card-content" style={{ padding: "2rem" }}>

                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="fade-in">
                                    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "3rem" }}>
                                        <div style={{ flexShrink: 0 }}>
                                            <div className="profile-avatar" style={{ width: "140px", height: "140px", border: "4px solid var(--background)", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
                                                {user.profileImage ? (
                                                    <img id="profileImage" src={user.profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                                ) : (
                                                    <span id="profileAvatar" style={{ fontSize: "4rem" }}>👤</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <h3 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--foreground)", letterSpacing: "-0.02em" }}>
                                                {user.username}
                                            </h3>
                                            <div style={{ color: "var(--muted)", marginBottom: "2rem", fontSize: "1rem" }}>
                                                <p style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                                    {user.email || 'ไม่ระบุอีเมล'}
                                                </p>
                                                <p style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                                                    {user.phone || 'ไม่ระบุเบอร์โทร'}
                                                </p>
                                            </div>

                                            <div className="flex gap-4">
                                                <Link href="/profile/edit" className="btn btn-outline" style={{ borderRadius: "20px", padding: "0.75rem 2rem", fontWeight: 600 }}>
                                                    ✏️ แก้ไขข้อมูลส่วนตัว
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats Summary */}
                                    <h4 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", borderLeft: "4px solid var(--primary)", paddingLeft: "1rem" }}>
                                        สถิติรวมของฉัน
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "1rem" }}>
                                        <div style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>แมตช์ทั้งหมด</div>
                                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}>{totalMatches}</div>
                                        </div>
                                        <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "1.5rem", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                                            <div style={{ color: "#10b981", fontSize: "0.9rem", marginBottom: "0.5rem" }}>ชนะ</div>
                                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10b981" }}>{totalWins}</div>
                                        </div>
                                        <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "1.5rem", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                                            <div style={{ color: "#f59e0b", fontSize: "0.9rem", marginBottom: "0.5rem" }}>เสมอ</div>
                                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>{totalDraws}</div>
                                        </div>
                                        <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: "1.5rem", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                                            <div style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: "0.5rem" }}>แพ้</div>
                                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#ef4444" }}>{totalLosses}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TEAMS TAB */}
                            {activeTab === 'teams' && (
                                <div className="fade-in">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                                        <h3 style={{ fontWeight: 700, fontSize: "1.5rem" }}>ทีมปัจจุบัน</h3>
                                        <Link href="/teams" className="btn btn-sm btn-outline" style={{ borderRadius: "20px" }}>+ ค้นหาทีมเพิ่ม</Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1.5rem" }}>
                                        {myTeams.length > 0 ? (
                                            myTeams.map(team => (
                                                <TiltCard key={team.id} className="card" style={{ padding: "0", background: "#0f172a", border: "1px solid #1e293b", display: "flex", flexDirection: "column", height: "100%", transition: "transform 0.2s", cursor: "pointer" }}>
                                                    <div style={{ flex: 1, padding: "1.5rem" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                                            {team.logo ? (
                                                                <div style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", border: "2px solid #334155" }}>
                                                                    <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                </div>
                                                            ) : (
                                                                <div style={{ width: "64px", height: "64px", background: "#1e293b", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                                                                    🛡️
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "#fff" }}>{team.name}</div>
                                                                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{team.status || 'Active'}</div>
                                                            </div>
                                                        </div>

                                                        <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.5rem", background: "rgba(255,255,255,0.03)", padding: "0.75rem", borderRadius: "8px" }}>
                                                            <span style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>ตำแหน่งของฉัน</span>
                                                            {(() => {
                                                                const userPositions = team.positions
                                                                    ? Object.values(team.positions).filter((p: any) => p.player === user.username).map((p: any) => p.name)
                                                                    : [];
                                                                return <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{userPositions.length > 0 ? userPositions.join(", ") : "สมาชิกทั่วไป"}</span>;
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", padding: "0 2rem" }}>
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.25rem" }}>WIN</div>
                                                            <div style={{ fontWeight: 700, color: "#10b981", fontSize: "1.1rem" }}>{team.matchStats?.wins || 0}</div>
                                                        </div>
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.25rem" }}>DRAW</div>
                                                            <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: "1.1rem" }}>{team.matchStats?.draws || 0}</div>
                                                        </div>
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.25rem" }}>LOSS</div>
                                                            <div style={{ fontWeight: 700, color: "#ef4444", fontSize: "1.1rem" }}>{team.matchStats?.losses || 0}</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ padding: "0 1.5rem 1.5rem" }}>
                                                        <Link href={`/teams/${team.id}`} className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center', borderRadius: "12px" }}>
                                                            เข้าสู่ทีม
                                                        </Link>
                                                    </div>
                                                </TiltCard>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)", gridColumn: "span 2", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "2px dashed #334155" }}>
                                                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}>⚽</div>
                                                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "#e2e8f0" }}>ยังไม่มีทีมสังกัด</h3>
                                                <p style={{ marginBottom: "1.5rem" }}>เข้าร่วมทีมเพื่อเริ่มการแข่งขันและสะสมสถิติ</p>
                                                <Link href="/teams" className="btn btn-primary">ค้นหาทีมที่เปิดรับ</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* MATCH HISTORY TAB */}
                            {activeTab === 'matches' && (
                                <div className="fade-in">
                                    <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.5rem" }}>ประวัติการแข่งขัน</h3>
                                    {user.matchHistory && user.matchHistory.length > 0 ? (
                                        <div className="grid grid-cols-1" style={{ gap: "1.5rem" }}>
                                            {(() => {
                                                const sortedMatches = [...user.matchHistory].sort((a: any, b: any) =>
                                                    new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
                                                );

                                                const groupedMatches = sortedMatches.reduce((groups: any[], match: any) => {
                                                    const existingGroup = groups.find(g => g.teamName === match.teamName);
                                                    if (existingGroup) {
                                                        existingGroup.matches.push(match);
                                                    } else {
                                                        groups.push({ teamName: match.teamName, matches: [match] });
                                                    }
                                                    return groups;
                                                }, []);

                                                return groupedMatches.map((group: any, groupIndex: number) => {
                                                    // Calculate latest team stats for this group from the most recent match
                                                    const latestMatch = group.matches.sort((a: any, b: any) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())[0];
                                                    const teamStats = latestMatch.matchStats || { wins: 0, draws: 0, losses: 0 };
                                                    const totalTeamMatches = teamStats.wins + teamStats.draws + teamStats.losses;

                                                    return (
                                                        <div key={groupIndex} style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", overflow: "hidden" }}>
                                                            <div style={{ padding: "1rem 1.5rem", background: "#0f172a", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                                    {(() => {
                                                                        const team = teams.find(t => t.name === group.teamName);
                                                                        return team?.logo ? (
                                                                            <img src={team.logo} alt={group.teamName} style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", border: "1px solid #334155" }} />
                                                                        ) : (
                                                                            <span style={{ fontSize: "1.25rem" }}>🛡️</span>
                                                                        );
                                                                    })()}
                                                                    <div>
                                                                        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>
                                                                            {group.teamName}
                                                                        </div>
                                                                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                                                            สถิติทีมจบที่: {teamStats.wins}W - {teamStats.draws}D - {teamStats.losses}L
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                                                                    <div style={{ fontSize: "0.85rem", color: "#e2e8f0", background: "rgba(255,255,255,0.08)", padding: "0.25rem 0.75rem", borderRadius: "99px", fontWeight: 600 }}>
                                                                        ลงเล่น {group.matches.length} นัด
                                                                    </div>
                                                                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                                                        (จากทั้งหมด {totalTeamMatches} นัด)
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ padding: "0.5rem" }}>
                                                                {group.matches.map((match: any, matchIndex: number) => (
                                                                    <div key={matchIndex} style={{
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        padding: "1rem",
                                                                        borderBottom: matchIndex !== group.matches.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                                                                        transition: "background 0.2s"
                                                                    }} className="hover:bg-slate-800/50">
                                                                        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                                                                            <div style={{
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                width: "42px",
                                                                                height: "42px",
                                                                                borderRadius: "10px",
                                                                                background: match.result === 'win' ? 'rgba(16, 185, 129, 0.2)' : match.result === 'loss' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                                                color: match.result === 'win' ? '#10b981' : match.result === 'loss' ? '#ef4444' : '#f59e0b',
                                                                                border: match.result === 'win' ? '1px solid #059669' : match.result === 'loss' ? '1px solid #dc2626' : '1px solid #d97706'
                                                                            }}>
                                                                                <span style={{ fontWeight: 900, fontSize: "1.1rem" }}>{match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <div style={{ fontWeight: 600, color: "#e2e8f0" }}>
                                                                                    {match.result === 'win' ? 'ชนะการแข่งขัน' : match.result === 'loss' ? 'แพ้การแข่งขัน' : 'เสมอ'}
                                                                                </div>
                                                                                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                                                                    {new Date(match.matchDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ textAlign: "right" }}>
                                                                            {match.matchStats && (
                                                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                                                    <span style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>สถิติทีม</span>
                                                                                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", gap: "1rem", justifyContent: "flex-end", background: "rgba(0,0,0,0.2)", padding: "0.5rem 1rem", borderRadius: "8px" }}>
                                                                                        <span style={{ color: "#10b981", fontWeight: 600 }}>W {match.matchStats.wins}</span>
                                                                                        <span style={{ color: "#f59e0b", fontWeight: 600 }}>D {match.matchStats.draws}</span>
                                                                                        <span style={{ color: "#ef4444", fontWeight: 600 }}>L {match.matchStats.losses}</span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "2px dashed #334155" }}>
                                            <p>ยังไม่มีประวัติการแข่งขัน</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TEAMS HISTORY TAB */}
                            {activeTab === 'history' && (
                                <div className="fade-in">
                                    <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.5rem" }}>ประวัติการย้ายทีม</h3>
                                    {user.history && user.history.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1.5rem" }}>
                                            {[...user.history].sort((a: any, b: any) => new Date(b.leftDate).getTime() - new Date(a.leftDate).getTime()).map((hist: any) => (
                                                <div key={hist.id} style={{ padding: "1.5rem", borderRadius: "16px", background: "#1e293b", border: "1px solid #334155", display: "flex", flexDirection: "column", height: "100%" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                                        {(() => {
                                                            const team = teams.find(t => t.name === hist.teamName);
                                                            return team?.logo ? (
                                                                <div style={{ width: "48px", height: "48px", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155" }}>
                                                                    <img src={team.logo} alt={hist.teamName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                </div>
                                                            ) : (
                                                                <div style={{ width: "48px", height: "48px", background: "#334155", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", opacity: 0.7 }}>
                                                                    📜
                                                                </div>
                                                            );
                                                        })()}
                                                        <div>
                                                            <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "#fff" }}>{hist.teamName}</div>
                                                            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                                                                ย้ายออกเมื่อ: {new Date(hist.leftDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.5rem", background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "8px" }}>
                                                        <span style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>เคยเล่นตำแหน่ง</span>
                                                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{hist.position}</span>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", padding: "0 0.5rem" }}>
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.25rem" }}>WIN</div>
                                                            <div style={{ fontWeight: 700, color: "#10b981", fontSize: "1.1rem" }}>{hist.matchStats?.wins || 0}</div>
                                                        </div>
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.25rem" }}>DRAW</div>
                                                            <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: "1.1rem" }}>{hist.matchStats?.draws || 0}</div>
                                                        </div>
                                                        <div style={{ textAlign: "center" }}>
                                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.25rem" }}>LOSS</div>
                                                            <div style={{ fontWeight: 700, color: "#ef4444", fontSize: "1.1rem" }}>{hist.matchStats?.losses || 0}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "2px dashed #334155" }}>
                                            <p>ยังไม่มีประวัติการย้ายทีม</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
