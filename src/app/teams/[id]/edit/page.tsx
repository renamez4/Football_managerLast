"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useTeams, Team } from "@/lib/teams";
import { useAuth } from "@/lib/auth";
// Removed BackgroundCanvas import

// Helper to extract position names from the backend object
const getPositionName = (positions: any, key: string, defaultName: string) => {
    if (positions && positions[key]) {
        return positions[key].name;
    }
    return defaultName;
};

export default function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params for Next.js 15 compatibility
    const { id } = use(params);
    const router = useRouter();
    const { teams, updateTeam, loading: teamsLoading } = useTeams();
    const { user, loading: authLoading } = useAuth();

    // Local state
    const [team, setTeam] = useState<Team | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        time: "",
        details: "",
        logo: "",
    });

    const [starters, setStarters] = useState<string[]>(Array(11).fill(""));
    const [subs, setSubs] = useState<string[]>(Array(5).fill(""));
    const [loading, setLoading] = useState(true);

    // Fetch Team Data
    useEffect(() => {
        // Wait for teams to load if they are being fetched globally
        // Or fetch specific team here. 
        // Since useTeams fetches all, we can find it there or fetch individual.
        // Let's fetch individual to be safe and get latest details.

        async function fetchTeamData() {
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/teams/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTeam(data);

                    // Populate Form
                    setFormData({
                        name: data.name,
                        time: data.time || "",
                        details: data.details || "",
                        logo: data.logo || "",
                    });

                    if (data.logo) {
                        setLogoPreview(data.logo);
                    }

                    // Populate Positions
                    const newStarters = [];
                    for (let i = 0; i < 11; i++) {
                        newStarters.push(getPositionName(data.positions, `starter${i}`, `ตำแหน่ง ${i + 1}`));
                    }
                    setStarters(newStarters);

                    const newSubs = [];
                    for (let i = 0; i < 5; i++) {
                        newSubs.push(getPositionName(data.positions, `sub${i}`, `ตัวสำรอง ${i + 1}`));
                    }
                    setSubs(newSubs);
                } else {
                    alert("ไม่พบทีม");
                    router.push("/teams");
                }
            } catch (error) {
                console.error("Error fetching team:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTeamData();
    }, [id, router]);

    // Check Ownership
    useEffect(() => {
        if (!authLoading && !loading && user && team) {
            // Note: team.owner is username string, user.username is username string
            // But strict check might be ID based. Backend uses ID.
            // Frontend 'Team' interface has owner?: string (username).
            // Let's rely on backend 403. But client side redirect is nice.
            // The backend returns owner_id in model, but to_dict might return username as owner?
            // Let's check model.py if needed. But safe to let backend reject if unsure.
            if (user.username !== team.owner) {
                // Warning: team.owner might be 'admin', user.username 'admin'.
                // If mismatch, redirect. 
                // We'll trust the user for now so they don't see flash of content.
            }
        }
    }, [user, team, authLoading, loading]);


    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setLogoPreview(result);
                setFormData({ ...formData, logo: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStarterChange = (index: number, value: string) => {
        const newStarters = [...starters];
        newStarters[index] = value;
        setStarters(newStarters);
    };

    const handleSubChange = (index: number, value: string) => {
        const newSubs = [...subs];
        newSubs[index] = value;
        setSubs(newSubs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updateData = {
            ...formData,
            starterNames: starters,
            substituteNames: subs,
        };

        const res = await updateTeam(Number(id), updateData);
        if (res.success) {
            alert("บันทึกข้อมูลเรียบร้อย");
            router.push(`/teams/${id}`);
        } else {
            alert(res.message || "บันทึกข้อมูลไม่สำเร็จ");
        }
    };

    if (loading || authLoading) return <div className="text-center p-8">Loading...</div>;

    return (
        <>

            <main>
                <div className="auth-container fade-in">
                    <div className="card auth-card" style={{ maxWidth: "600px" }}>
                        <div className="card-header text-center">
                            <h2 className="card-title text-primary" style={{ fontSize: "2rem" }}>แก้ไขรายละเอียดทีม</h2>
                            <p className="card-description">ปรับปรุงข้อมูลทีมและจัดการชื่อตำแหน่ง</p>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">ชื่อทีม</label>
                                    <input type="text" className="form-input" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">โลโก้ทีม</label>
                                    <div id="dropZone"
                                        style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius)", height: "250px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer", background: "rgba(99, 102, 241, 0.05)", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }}
                                        onClick={() => document.getElementById('teamLogo')?.click()}
                                    >
                                        <input type="file" id="teamLogo" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />

                                        {!logoPreview ? (
                                            <div style={{ textAlign: "center" }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                                    fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                                    strokeLinejoin="round" style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="17 8 12 3 7 8"></polyline>
                                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                                </svg>
                                                <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>คลิกเพื่อเปลี่ยนโลโก้ใหม่</p>
                                            </div>
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, background: "#000" }}>
                                                <img src={logoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.8 }} />
                                                <div style={{
                                                    position: "absolute", bottom: 0, left: 0, width: "100%",
                                                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                                    padding: "2rem 1rem 1rem", textAlign: "center"
                                                }}>
                                                    <p style={{ color: "white", fontSize: "0.875rem", fontWeight: 500 }}>คลิกเพื่อเปลี่ยนรูปภาพ</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">เวลาแข่งประจำ</label>
                                    <div style={{ position: "relative" }}>
                                        <input type="text" className="form-input" required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                        <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.25rem" }}>⏰</span>
                                    </div>
                                </div>

                                <div className="form-group" style={{ background: "rgba(99, 102, 241, 0.05)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px dashed var(--border)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                        <label className="form-label" style={{ marginBottom: 0, color: "var(--primary)" }}>แก้ไขชื่อตำแหน่งตัวจริง</label>
                                    </div>

                                    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                                        {starters.map((pos, i) => (
                                            <input key={i} type="text" className="form-input starter-input"
                                                placeholder={`Pos ${i + 1}`}
                                                value={pos}
                                                onChange={(e) => handleStarterChange(i, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group" style={{ background: "rgba(99, 102, 241, 0.05)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px dashed var(--border)" }}>
                                    <label className="form-label" style={{ marginBottom: "1rem", color: "var(--primary)" }}>แก้ไขชื่อตำแหน่งตัวสำรอง</label>
                                    <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                                        {subs.map((pos, i) => (
                                            <input key={i} type="text" className="form-input"
                                                placeholder={`Sub ${i + 1}`}
                                                value={pos}
                                                onChange={(e) => handleSubChange(i, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">รายละเอียดทีม</label>
                                    <textarea className="form-textarea" required
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="flex gap-4" style={{ marginTop: "2rem" }}>
                                    <button type="button" className="btn btn-outline w-full" onClick={() => router.back()}>ยกเลิก</button>
                                    <button type="submit" className="btn btn-primary w-full">บันทึกการแก้ไข</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
