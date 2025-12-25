"use client";

import Link from "next/link";
// Removed BackgroundCanvas import
import { TiltCard } from "@/components/ui/TiltCard";

export default function RulesPage() {
    return (
        <>


            <section className="hero fade-in" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
                <h1 className="text-gradient-anim" style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.1 }}>
                    กฎกติกาฟุตบอล
                </h1>
                <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto" }}>
                    ข้อควรปฏิบัติและกฎระเบียบที่สำคัญในการแข่งขัน
                </p>
            </section>

            <div className="grid grid-cols-1 gap-8 fade-in delay-200" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0 }}>
                        <img src="/images/football_referee_time_1764878880875.png" alt="Referee Time" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "var(--primary-light)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                                    <span style={{ fontSize: "1.5rem" }}>⏱️</span>
                                </div>
                                <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>เวลาการแข่งขัน</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
                            {["แบ่งเป็น 2 ครึ่ง ครึ่งละ 45 นาที", "พักครึ่งเวลาไม่เกิน 15 นาที", "มีการทดเวลาบาดเจ็บตามดุลยพินิจของผู้ตัดสิน"].map((item, index) => (
                                <li key={index} style={{ display: "flex", alignItems: "start", gap: "1rem", color: "var(--muted)" }}>
                                    <span style={{ color: "var(--primary)", marginTop: "0.25rem" }}>•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </TiltCard>

                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0 }}>
                        <img src="/images/football_action_shot_1764877202427.png" alt="Fouls" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "rgba(220, 38, 38, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--danger)" }}>
                                    <span style={{ fontSize: "1.5rem" }}>🟥</span>
                                </div>
                                <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>การทำผิดกติกา (Fouls)</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-content" style={{ display: "grid", gap: "1.5rem" }}>
                        <div>
                            <h3 style={{ fontWeight: 600, color: "#facc15", marginBottom: "0.5rem" }}>ใบเหลือง (ตักเตือน)</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>สำหรับการกระทำผิดที่ไม่รุนแรงมาก เช่น ถ่วงเวลา, ตัดเกม, เถียงผู้ตัดสิน</p>
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 600, color: "var(--danger)", marginBottom: "0.5rem" }}>ใบแดง (ไล่ออก)</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>สำหรับการกระทำผิดรุนแรง เช่น ทำร้ายร่างกาย, ถ่มน้ำลาย, เจตนาใช้มือปัดบอลหน้าประตู</p>
                        </div>
                    </div>
                </TiltCard>

                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0 }}>
                        <img src="/images/football_tactics_1764877234257.png" alt="Offside" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--success)" }}>
                                    <span style={{ fontSize: "1.5rem" }}>🚩</span>
                                </div>
                                <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>ลูกล้ำหน้า (Offside)</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                            ผู้เล่นจะอยู่ในตำแหน่งล้ำหน้าถ้าอยู่ใกล้เส้นประตูของฝ่ายตรงข้ามมากกว่าลูกบอลและผู้เล่นคนที่สองจากท้ายสุดของฝ่ายตรงข้าม
                            ในขณะที่เพื่อนร่วมทีมส่งบอลมาให้
                        </p>
                    </div>
                </TiltCard>

                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0 }}>
                        <img src="/images/football_stadium_1764877184947.png" alt="Penalty" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "rgba(249, 115, 22, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                                    <span style={{ fontSize: "1.5rem" }}>⚽</span>
                                </div>
                                <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>ลูกโทษ (Penalty)</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                            เมื่อฝ่ายรับทำฟาวล์ในเขตโทษของตนเอง ฝ่ายรุกจะได้เตะลูกโทษที่จุดโทษ โดยดวลตัวต่อตัวกับผู้รักษาประตู
                        </p>
                    </div>
                </TiltCard>
            </div>

            <div className="fade-in delay-300" style={{ maxWidth: "1200px", margin: "4rem auto 0", padding: "0 1.5rem" }}>
                <div className="text-center" style={{ padding: "3rem", background: "var(--surface-glass)", width: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>ศึกษาข้อมูลเพิ่มเติม</h3>
                    <p className="text-muted" style={{ marginBottom: "2rem" }}>
                        เลือกหัวข้อที่คุณสนใจเพื่อเรียนรู้เพิ่มเติมเกี่ยวกับฟุตบอล
                    </p>
                    <div className="flex gap-4 justify-center" style={{ flexWrap: "wrap" }}>
                        <Link href="/info/football" className="btn btn-outline btn-lg">ประวัติความเป็นมา</Link>
                        <Link href="/info/rules" className="btn btn-primary btn-lg">กฎกติกา</Link>
                        <Link href="/info/how-to-play" className="btn btn-outline btn-lg">วิธีการเล่น</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
