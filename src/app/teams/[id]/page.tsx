"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTeams, Team } from "@/lib/teams";
import { useAuth } from "@/lib/auth";
// Removed BackgroundCanvas import
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";
import {
    Clock,
    Users,
    Shield,
    CheckCircle,
    LogOut,
    Trophy,
    XCircle,
    MinusCircle,
    PenBox,
    Trash2,
    Mail,
    Phone,
    User as UserIcon,
    Footprints
} from "lucide-react";

export default function TeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { teams, joinTeamPosition, leaveTeamPosition, kickMember, updateMatchRecords, deleteTeam } = useTeams();
    const { user, refreshUser } = useAuth();
    const [team, setTeam] = useState<Team | null>(null);

    useEffect(() => {
        if (params.id) {
            const id = parseInt(params.id as string);
            const found = teams.find((t) => t.id === id);
            if (found) setTeam(found);
        }
    }, [params.id, teams]);

    if (!team) return <div className="text-center p-10 text-white">กำลังโหลดข้อมูลทีม...</div>;

    const isOwner = user && team.owner === user.username;
    const starters = Object.entries(team.positions || {}).filter(([key]) => !key.startsWith('sub'));
    const subs = Object.entries(team.positions || {}).filter(([key]) => key.startsWith('sub'));

    // Default stats if missing
    const stats = team.matchStats || { wins: 0, losses: 0, draws: 0 };

    const handleJoinPosition = async (posId: string, posName: string) => {
        if (!user) return router.push("/login");
        if (confirm(`คุณต้องการเข้าร่วมทีมในตำแหน่ง "${posName}" หรือไม่?`)) {
            const res = await joinTeamPosition(team.id, posId);
            if (!res.success) alert(res.message);
            else await refreshUser(); // Update user data
        }
    };

    const handleLeavePosition = async (posId: string, posName: string) => {
        if (confirm(`คุณต้องการออกจากตำแหน่ง "${posName}" ใช่หรือไม่?`)) {
            const res = await leaveTeamPosition(team.id, posId);
            if (!res.success) alert(res.message);
            else await refreshUser(); // Update user history
        }
    };

    const handleKickMember = async (username: string) => {
        if (confirm(`คุณต้องการเตะ "${username}" ออกจากทีมหรือไม่?`)) {
            const res = await kickMember(team.id, username);
            alert(res.message);
            await refreshUser(); // Update data if self-kick or just good practice
        }
    };

    const handleUpdateStats = async (result: 'win' | 'loss' | 'draw') => {
        const checkText = result === 'win' ? 'ชนะ' : result === 'loss' ? 'แพ้' : 'เสมอ';
        if (confirm(`บันทึกผลการแข่งขัน: ${checkText}?`)) {
            const res = await updateMatchRecords(team.id, result);
            if (!res.success) alert(res.message);
        }
    };

    // Find if user is in this team
    const userPosition = team.positions ? Object.entries(team.positions).find(([_, pos]) => pos.player === user?.username) : null;
    const userPositionId = userPosition ? userPosition[0] : null;
    const userPositionName = userPosition ? userPosition[1].name : null;

    const handleDeleteTeam = async () => {
        if (confirm(`คุณต้องการลบทีม "${team.name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
            const res = await deleteTeam(team.id);
            if (res.success) {
                alert("ลบทีมเรียบร้อยแล้ว");
                router.push("/teams");
            } else {
                alert(res.message);
            }
        }
    };

    const renderPositionCard = (key: string, pos: { name: string, player: string | null }) => {
        const isTaken = !!pos.player;
        const isMyPosition = user && pos.player === user.username;
        const userInTeam = !!userPosition; // Check if user already holds a position in this team
        const canSelect = user && !userInTeam && !isTaken;

        return (
            <TiltCard key={key}
                onClick={() => {
                    if (canSelect) handleJoinPosition(key, pos.name);
                    if (isMyPosition) handleLeavePosition(key, pos.name);
                }}
                className={`position-card ${isTaken ? 'taken' : 'available'} ${isMyPosition ? 'my-position' : ''}`}
            >
                <div style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--foreground)" }}>{pos.name}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {isTaken ? (
                        <>
                            <span style={{ width: "8px", height: "8px", background: "var(--danger)", borderRadius: "50%" }}></span>
                            {pos.player}
                        </>
                    ) : (
                        <>
                            <span style={{ width: "8px", height: "8px", background: "var(--success)", borderRadius: "50%" }}></span>
                            ว่าง
                        </>
                    )}
                </div>
            </TiltCard>
        );
    };

    return (
        <>

            <div style={{ maxWidth: "1200px", margin: "0 auto" }} className="fade-in">
                <button className="btn btn-ghost" onClick={() => router.back()} style={{ marginBottom: "1.5rem", paddingLeft: 0 }}>
                    ← ย้อนกลับ
                </button>

                <div className="grid grid-cols-3" style={{ gap: "2rem" }}>
                    {/* Main Team Info */}
                    <div className="col-span-2">
                        <TiltCard className="card">
                            {team.logo && (
                                <div style={{ position: "relative", height: "320px", overflow: "hidden", borderRadius: "1rem 1rem 0 0", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                                    <div style={{
                                        position: "absolute", top: "-10%", left: "-10%", right: "-10%", bottom: "-10%",
                                        backgroundImage: `url('${team.logo}')`, backgroundSize: "cover", backgroundPosition: "center",
                                        filter: "blur(30px) opacity(0.4)", transform: "scale(1.1)"
                                    }}></div>
                                    <div style={{ position: "relative", height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                                        <img src={team.logo} alt={team.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "var(--radius)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)", transition: "transform 0.3s ease" }} />
                                    </div>
                                </div>
                            )}
                            <div className="card-header">
                                <h2 className="card-title text-primary" style={{ fontSize: "2rem" }}>{team.name}</h2>
                                <p style={{ color: "var(--muted)", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Shield size={12} /> OWNER
                                    </span>
                                    <strong>{team.owner || 'Unknown'}</strong>
                                </p>
                            </div>
                            <div className="card-content">
                                <div className="grid grid-cols-2" style={{ marginBottom: "2rem", gap: "1.5rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--background)", borderRadius: "var(--radius)" }}>
                                        <Clock size={32} className="text-danger" />
                                        <div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Time</div>
                                            <div style={{ fontWeight: 600 }}>{team.time}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--background)", borderRadius: "var(--radius)" }}>
                                        <Users size={32} className="text-primary" />
                                        <div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Members</div>
                                            <div style={{ fontWeight: 600 }}>{team.currentPlayers} / {team.players}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: "var(--background)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                                    <h3 style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "1.1rem" }}>รายละเอียดทีม</h3>
                                    <p style={{ whiteSpace: "pre-wrap", color: "var(--muted)", lineHeight: 1.7 }}>{team.details}</p>
                                </div>

                                {/* You are in this team banner */}
                                {userPosition && (
                                    <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "1.5rem", borderRadius: "var(--radius)", marginTop: "1.5rem", border: "1px solid var(--success)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                            <div style={{ background: "var(--success)", color: "white", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <CheckCircle size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontWeight: 700, color: "var(--success)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>คุณอยู่ในทีมนี้แล้ว</h3>
                                                <p style={{ color: "var(--muted)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    ตำแหน่งของคุณ:
                                                    <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
                                                        {userPositionName}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <button className="btn btn-danger" onClick={() => handleLeavePosition(userPositionId!, userPositionName!)}>
                                            <LogOut size={16} style={{ marginRight: "0.5rem" }} /> ออกจากทีม
                                        </button>
                                    </div>
                                )}
                            </div>
                        </TiltCard>

                        {/* Positions - Starters */}
                        <TiltCard className="card" style={{ marginTop: "2rem" }}>
                            <div className="card-header">
                                <h3 className="card-title">ตำแหน่งตัวจริง (11 คน)</h3>
                            </div>
                            <div className="card-content">
                                <div className="position-grid">
                                    {starters.map(([key, pos]) => renderPositionCard(key, pos))}
                                </div>
                            </div>
                        </TiltCard>

                        {/* Positions - Subs */}
                        <TiltCard className="card" style={{ marginTop: "2rem" }}>
                            <div className="card-header">
                                <h3 className="card-title">ตำแหน่งตัวสำรอง (5 คน)</h3>
                            </div>
                            <div className="card-content">
                                <div className="position-grid">
                                    {subs.map(([key, pos]) => renderPositionCard(key, pos))}
                                </div>
                            </div>
                        </TiltCard>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Stats */}
                        <TiltCard className="card">
                            <div className="card-header">
                                <h3 className="card-title">สถิติการแข่งขัน</h3>
                            </div>
                            <div className="card-content">
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(34, 197, 94, 0.1)", borderRadius: "var(--radius)", borderLeft: "4px solid var(--success)" }}>
                                        <span style={{ fontWeight: 600, color: "var(--success)" }}>ชนะ</span>
                                        <strong style={{ fontSize: "1.25rem" }}>{stats.wins}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius)", borderLeft: "4px solid var(--danger)" }}>
                                        <span style={{ fontWeight: 600, color: "var(--danger)" }}>แพ้</span>
                                        <strong style={{ fontSize: "1.25rem" }}>{stats.losses}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(245, 158, 11, 0.1)", borderRadius: "var(--radius)", borderLeft: "4px solid var(--accent)" }}>
                                        <span style={{ fontWeight: 600, color: "var(--accent)" }}>เสมอ</span>
                                        <strong style={{ fontSize: "1.25rem" }}>{stats.draws}</strong>
                                    </div>
                                </div>

                                {isOwner && (
                                    <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                                        <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>บันทึกผลการแข่งขัน</p>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button className="btn btn-sm" style={{ flex: 1, background: "var(--success)", color: "white" }} onClick={() => handleUpdateStats('win')}>ชนะ</button>
                                            <button className="btn btn-sm" style={{ flex: 1, background: "var(--danger)", color: "white" }} onClick={() => handleUpdateStats('loss')}>แพ้</button>
                                            <button className="btn btn-sm" style={{ flex: 1, background: "var(--accent)", color: "white" }} onClick={() => handleUpdateStats('draw')}>เสมอ</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TiltCard>

                        {isOwner && (
                            <TiltCard className="card fade-in" style={{ marginTop: "2rem" }}>
                                <div className="card-header">
                                    <h3 className="card-title">🔧 จัดการทีม</h3>
                                </div>
                                <div className="card-content">
                                    <Link href={`/teams/${team.id}/edit`} className="btn btn-outline w-full mb-4">
                                        <PenBox size={16} style={{ marginRight: "0.5rem" }} /> แก้ไขข้อมูลทีม
                                    </Link>

                                    <div className="flex justify-between items-center mb-4 text-primary">
                                        <h4 style={{ fontWeight: 600, fontSize: "1rem" }}>ตัวจริง</h4>
                                        <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)", minWidth: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                                            {starters.filter(([_, p]) => p.player).length}
                                        </span>
                                    </div>

                                    {starters.filter(([_, p]) => p.player).length > 0 ? (
                                        starters.filter(([_, p]) => p.player).map(([key, pos]) => {
                                            const member = team.members.find(m => typeof m !== 'string' && m.username === pos.player);
                                            return (
                                                <div key={key} className="member-item" style={{ background: "var(--background)", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1rem", border: "1px solid var(--border)" }}>
                                                    <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--primary)" }}>
                                                        {pos.player}
                                                    </div>

                                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                                                        <div style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            <span style={{ width: "20px", display: "flex", justifyContent: "center" }}>⚽</span> {pos.name}
                                                        </div>
                                                        <div style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            <Mail size={16} /> {member?.email || "-"}
                                                        </div>
                                                        <div style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            <Phone size={16} /> {member?.phone || "-"}
                                                        </div>
                                                    </div>

                                                    <button className="btn btn-danger w-full" onClick={() => handleKickMember(pos.player!)}>
                                                        เตะออกจากทีม
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", textAlign: "center", color: "var(--muted)", marginBottom: "1rem" }}>
                                            ยังไม่มีตัวจริง
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mt-8 mb-4 text-muted">
                                        <h4 style={{ fontWeight: 600, fontSize: "1rem" }}>ตัวสำรอง</h4>
                                        <span className="badge" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", minWidth: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                                            {subs.filter(([_, p]) => p.player).length}
                                        </span>
                                    </div>

                                    {subs.filter(([_, p]) => p.player).length > 0 ? (
                                        subs.filter(([_, p]) => p.player).map(([key, pos]) => {
                                            const member = team.members.find(m => typeof m !== 'string' && m.username === pos.player);
                                            return (
                                                <div key={key} className="member-item" style={{ background: "var(--background)", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1rem", border: "1px solid var(--border)" }}>
                                                    <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--foreground)" }}>
                                                        {pos.player}
                                                    </div>

                                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                                                        <div style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            <span style={{ width: "20px", display: "flex", justifyContent: "center" }}>⚽</span> {pos.name}
                                                        </div>
                                                        <div style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            <Mail size={16} /> {member?.email || "-"}
                                                        </div>
                                                        <div style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            <Phone size={16} /> {member?.phone || "-"}
                                                        </div>
                                                    </div>

                                                    <button className="btn btn-danger w-full" onClick={() => handleKickMember(pos.player!)}>
                                                        เตะออกจากทีม
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", textAlign: "center", color: "var(--muted)" }}>
                                            ยังไม่มีตัวสำรอง
                                        </div>
                                    )}


                                    <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                                        <button className="btn btn-danger w-full" onClick={handleDeleteTeam}>
                                            <Trash2 size={16} style={{ marginRight: "0.5rem" }} /> ลบทีมนี้
                                        </button>
                                    </div>
                                </div>
                            </TiltCard>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
