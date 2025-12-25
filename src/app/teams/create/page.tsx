"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeams } from "@/lib/teams";
// Removed BackgroundCanvas import

const FORMATIONS: { [key: string]: string[] } = {
    '4-3-3': ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CM', 'CM', 'LW', 'ST', 'RW'],
    '4-4-2': ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'],
    '4-2-3-1': ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CDM', 'RAM', 'CAM', 'LAM', 'ST'],
    '3-5-2': ['GK', 'CB', 'CB', 'CB', 'LWB', 'CDM', 'CM', 'CM', 'RWB', 'ST', 'ST']
};

export default function CreateTeamPage() {
    const router = useRouter();
    const { createTeam } = useTeams();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        time: "",
        details: "",
        logo: "",
    });

    const [starters, setStarters] = useState<string[]>(Array(11).fill(""));
    const [subs, setSubs] = useState<string[]>(["ตัวสำรอง 1", "ตัวสำรอง 2", "ตัวสำรอง 3", "ตัวสำรอง 4", "ตัวสำรอง 5"]);

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

    const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const preset = e.target.value;
        if (FORMATIONS[preset]) {
            const formationPositions = FORMATIONS[preset];
            setStarters([...formationPositions]);

            // Auto-Generate Subs based on Formation Positions
            // 1. Always include a sub goalkeeper
            // 2. Randomly pick 4 field positions from the starter list to have backups for
            const fieldPlayers = formationPositions.filter(p => p !== 'GK');
            const shuffledField = [...fieldPlayers].sort(() => 0.5 - Math.random());

            // Sub list: 1 GK + 4 Random Field Players from the plan
            setSubs(['GK', ...shuffledField.slice(0, 4)]);
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
        const teamData = {
            ...formData,
            starterNames: starters,
            substituteNames: subs,
        };
        const res = await createTeam(teamData);
        if (res) {
            router.push("/teams");
        }
    };

    return (
        <>

            <main>
                <div className="auth-container fade-in">
                    <div className="card auth-card" style={{ maxWidth: "600px" }}>
                        <div className="card-header text-center">
                            <h2 className="card-title text-primary" style={{ fontSize: "2rem" }}>สร้างทีมใหม่</h2>
                            <p className="card-description">สร้างทีมของคุณ เพื่อจัดการสมาชิกและการแข่งขัน</p>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">ชื่อทีม</label>
                                    <input type="text" className="form-input" required
                                        placeholder="เช่น liverpools, mancitys"
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
                                                <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>คลิกเพื่ออัปโหลดโลโก้ทีม</p>
                                                <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>รองรับไฟล์ JPG, PNG</p>
                                            </div>
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, background: "#000" }}>
                                                <img src={logoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.8 }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">เวลาแข่งประจำ</label>
                                    <input type="text" className="form-input" required
                                        placeholder="เช่น ทุกวันเสาร์ 18:00 - 20:00"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>

                                <div className="form-group" style={{ background: "rgba(99, 102, 241, 0.05)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px dashed var(--border)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                        <label className="form-label" style={{ marginBottom: 0, color: "var(--primary)" }}>กำหนดชื่อตำแหน่งตัวจริง (11 ตำแหน่ง)</label>
                                        <select className="form-input" style={{ width: "auto", padding: "0.25rem 0.5rem", fontSize: "0.875rem" }} onChange={handleFormationChange}>
                                            <option value="">เลือกแผนการเล่น (Auto-fill)</option>
                                            <option value="4-3-3">4-3-3</option>
                                            <option value="4-4-2">4-4-2</option>
                                            <option value="4-2-3-1">4-2-3-1</option>
                                            <option value="3-5-2">3-5-2</option>
                                            <option value="custom">กำหนดเอง</option>
                                        </select>
                                    </div>

                                    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                                        {starters.map((pos, i) => (
                                            <input key={i} type="text" className="form-input"
                                                placeholder={`ตำแหน่ง ${i + 1}`}
                                                value={pos}
                                                onChange={(e) => handleStarterChange(i, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group" style={{ background: "rgba(99, 102, 241, 0.05)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px dashed var(--border)" }}>
                                    <label className="form-label" style={{ marginBottom: "1rem", color: "var(--primary)" }}>กำหนดชื่อตำแหน่งตัวสำรอง (5 ตำแหน่ง)</label>
                                    <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                                        {subs.map((pos, i) => (
                                            <input key={i} type="text" className="form-input"
                                                placeholder={`ตัวสำรอง ${i + 1}`}
                                                value={pos}
                                                onChange={(e) => handleSubChange(i, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">รายละเอียดทีม</label>
                                    <textarea className="form-textarea" required
                                        placeholder="อธิบายเกี่ยวกับทีมของคุณ..."
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="flex gap-4" style={{ marginTop: "2rem" }}>
                                    <button type="button" className="btn btn-outline w-full" onClick={() => router.back()}>ยกเลิก</button>
                                    <button type="submit" className="btn btn-primary w-full">สร้างทีมเลย</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
