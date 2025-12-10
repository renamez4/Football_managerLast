"use client";

import Link from "next/link";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import { TiltCard } from "@/components/ui/TiltCard";

export default function HowToPlayPage() {
    return (
        <>
            <BackgroundCanvas />

            <section className="hero fade-in" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
                <h1 className="text-gradient-anim" style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.1 }}>
                    วิธีการเล่นฟุตบอล
                </h1>
                <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto" }}>
                    หลักการเล่นเบื้องต้นและเทคนิคสำคัญ
                </p>
            </section>

            <div className="fade-in delay-200" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gap: "2rem" }}>

                {/* Goal Section */}
                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0 }}>
                        <img src="/images/football_trophy_1764877219357.png" alt="Goal" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "var(--primary-light)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                                    <span style={{ fontSize: "1.5rem" }}>🏆</span>
                                </div>
                                <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>เป้าหมายของเกม</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <p className="text-muted" style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                            ทำประตูโดยการเตะลูกบอลให้ผ่านเส้นประตูของฝ่ายตรงข้าม ทีมที่ทำประตูได้มากกว่าเมื่อจบการแข่งขันจะเป็นผู้ชนะ
                        </p>
                    </div>
                </TiltCard>

                {/* Positions Section */}
                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0 }}>
                        <img src="/images/football_field_top_view_1764878254092.png" alt="Positions" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "var(--accent-light)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                                    <span style={{ fontSize: "1.5rem" }}>👕</span>
                                </div>
                                <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>ตำแหน่งผู้เล่น</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { title: "ผู้รักษาประตู", desc: "ป้องกันประตู เป็นผู้เล่นคนเดียวที่สามารถใช้มือได้ (เฉพาะในเขตโทษ)", icon: "🧤", color: "var(--accent)" },
                                { title: "กองหลัง", desc: "ป้องกันไม่ให้คู่ต่อสู้ทำประตู คุมพื้นที่หน้าปากประตูตัวเอง", icon: "🛡️", color: "var(--primary)" },
                                { title: "กองกลาง", desc: "เชื่อมเกมระหว่างกองหลังและกองหน้า คุมจังหวะเกม", icon: "⚙️", color: "var(--secondary)" },
                                { title: "กองหน้า", desc: "ทำประตู สร้างโอกาสในการยิง กดดันแนวรับคู่แข่ง", icon: "🎯", color: "var(--danger)" }
                            ].map((pos, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", padding: "1.5rem", background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                                    <div style={{ minWidth: "56px", height: "56px", background: `${pos.color}15`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", color: pos.color, flexShrink: 0 }}>
                                        {pos.icon}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--foreground)" }}>{pos.title}</h3>
                                        <p className="text-muted" style={{ fontSize: "1rem", lineHeight: 1.6 }}>{pos.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TiltCard>

                {/* Techniques Section */}
                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0 }}>
                        <img src="/images/football_action_shot_1764877202427.png" alt="Techniques" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "var(--secondary-light)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)" }}>
                                    <span style={{ fontSize: "1.5rem" }}>🏃</span>
                                </div>
                                <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>เทคนิคพื้นฐาน</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { title: "การเลี้ยงบอล (Dribbling)", desc: "การเคลื่อนที่ไปพร้อมกับลูกบอลโดยใช้เท้าควบคุม หลบหลีกคู่ต่อสู้", icon: "🏃" },
                                { title: "การส่งบอล (Passing)", desc: "การเตะบอลให้เพื่อนร่วมทีมอย่างแม่นยำ ทั้งระยะสั้นและระยะยาว", icon: "👟" },
                                { title: "การยิงประตู (Shooting)", desc: "การเตะบอลด้วยความแรงและทิศทางเพื่อทำคะแนน", icon: "🥅" },
                                { title: "การโหม่ง (Heading)", desc: "การใช้ศีรษะเล่นบอลเมื่อบอลลอยมาในอากาศ ทั้งเพื่อสกัดและทำประตู", icon: "🆙" }
                            ].map((tech, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                                    <div style={{ minWidth: "40px", height: "40px", background: "var(--primary-light)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0, fontSize: "1.25rem" }}>
                                        {tech.icon}
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 600, marginBottom: "0.25rem", color: "var(--foreground)" }}>{tech.title}</h3>
                                        <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6 }}>{tech.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <Link href="/info/rules" className="btn btn-outline btn-lg">กฎกติกา</Link>
                        <Link href="/info/how-to-play" className="btn btn-primary btn-lg">วิธีการเล่น</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
