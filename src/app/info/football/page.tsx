
"use client";

import Link from "next/link";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import { TiltCard } from "@/components/ui/TiltCard";

export default function FootballInfoPage() {
    return (
        <>
            <BackgroundCanvas />


            <section className="hero fade-in" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
                {/* Image Carousel */}
                <div className="carousel-container mb-4">
                    <div className="carousel-track">
                        <img src="/images/football_stadium_1764877184947.png" alt="Stadium" />
                        <img src="/images/football_action_shot_1764877202427.png" alt="Action" />
                        <img src="/images/football_trophy_1764877219357.png" alt="Trophy" />
                        <img src="/images/football_tactics_1764877234257.png" alt="Tactics" />
                        {/* Duplicate for infinite scroll */}
                        <img src="/images/football_stadium_1764877184947.png" alt="Stadium" />
                        <img src="/images/football_action_shot_1764877202427.png" alt="Action" />
                        <img src="/images/football_trophy_1764877219357.png" alt="Trophy" />
                        <img src="/images/football_tactics_1764877234257.png" alt="Tactics" />
                    </div>
                </div>

                <h1 className="text-gradient-anim" style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.1 }}>
                    กีฬาฟุตบอล (Football)
                </h1>
                <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto" }}>
                    ข้อมูลและกติกาพื้นฐานของกีฬาฟุตบอล
                </p>
            </section>

            <div className="grid grid-cols-2 gap-8 fade-in delay-200">
                <TiltCard className="card" style={{ gridColumn: "span 2" }}>
                    <div className="card-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: "48px", height: "48px", background: "var(--primary-light)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8v4l3 3"></path>
                                    <circle cx="12" cy="12" r="10"></circle>
                                </svg>
                            </div>
                            <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>ประวัติความเป็นมา</h2>
                        </div>
                    </div>
                    <div className="card-content">
                        <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.1rem" }}>
                            ฟุตบอล (Football) หรือ ซอคเกอร์ (Soccer) เป็นกีฬาประเภททีมที่เล่นระหว่างสองทีม
                            โดยแต่ละทีมมีผู้เล่น 11 คน
                            โดยใช้ลูกบอลทรงกลม เป็นกีฬาที่ได้รับความนิยมมากที่สุดในโลก
                        </p>
                        <p className="text-muted" style={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
                            การเล่นฟุตบอลสมัยใหม่ถือกำเนิดขึ้นในประเทศอังกฤษในช่วงกลางศตวรรษที่ 19
                            แต่กีฬาที่คล้ายคลึงกันนี้มีมานานแล้วในหลายวัฒนธรรม
                            ปัจจุบันฟุตบอลอยู่ภายใต้การกำกับดูแลของฟีฟ่า (FIFA) ซึ่งจัดการแข่งขันฟุตบอลโลกทุกๆ 4 ปี
                        </p>
                    </div>
                </TiltCard>

                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0, position: "relative" }}>
                        <div style={{ height: "200px", background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)", borderRadius: "1rem 1rem 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src="/images/football_equipment_set_1764878235646.png" alt="Equipment" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        </div>
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "var(--secondary)", opacity: 0.1, borderRadius: "12px", position: "absolute" }}></div>
                                <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)", zIndex: 1 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.2 6 3 11l-.9-2.4c-.5-1.1.2-2.6 1.3-3.1C7.2 4 12.3 3.5 16 5c1.5.6 2.5 2.2 4.2 1z"></path>
                                        <path d="M20 6c1.5.6 2.5 2.2 4.3 1"></path>
                                    </svg>
                                </div>
                                <h3 className="card-title" style={{ fontSize: "1.25rem", fontWeight: 600 }}>อุปกรณ์การเล่น</h3>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
                            {["ลูกฟุตบอล (มาตรฐานเบอร์ 5)", "รองเท้าสตั๊ด", "สนับแข้ง", "ชุดแข่งขัน (เสื้อ, กางเกง, ถุงเท้า)", "ถุงมือ (สำหรับผู้รักษาประตู)"].map((item, index) => (
                                <li key={index} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", background: "var(--background)", borderRadius: "var(--radius-sm)" }}>
                                    <span style={{ width: "24px", height: "24px", background: "var(--success)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </TiltCard>

                <TiltCard className="card">
                    <div className="card-header" style={{ padding: 0, position: "relative" }}>
                        <div style={{ height: "200px", background: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)", borderRadius: "1rem 1rem 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src="/images/football_field_top_view_1764878254092.png" alt="Field" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                        </div>
                        <div style={{ padding: "1.5rem 2rem", background: "rgba(30, 41, 59, 0.5)", borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", background: "var(--accent)", opacity: 0.1, borderRadius: "12px", position: "absolute" }}></div>
                                <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", zIndex: 1 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <line x1="12" y1="2" x2="12" y2="22"></line>
                                        <circle cx="12" cy="12" r="4"></circle>
                                    </svg>
                                </div>
                                <h3 className="card-title" style={{ fontSize: "1.25rem", fontWeight: 600 }}>สนามแข่งขัน</h3>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
                            {[
                                { icon: "↔️", label: "ความยาว:", value: "90 - 120 เมตร" },
                                { icon: "↕️", label: "ความกว้าง:", value: "45 - 90 เมตร" },
                                { icon: "🌱", label: "พื้นผิว:", value: "หญ้าจริง หรือ หญ้าเทียม" },
                                { icon: "🥅", label: "ประตู:", value: "กว้าง 7.32 ม. x สูง 2.44 ม." },
                                { icon: "⚪", label: "จุดโทษ:", value: "ห่างจากประตู 11 เมตร" }
                            ].map((item, index) => (
                                <li key={index} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", background: "var(--background)", borderRadius: "var(--radius-sm)" }}>
                                    <span style={{ width: "24px", height: "24px", background: "var(--accent)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>{item.icon}</span>
                                    <span><strong>{item.label}</strong> {item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </TiltCard>
            </div>

            <div className="text-center fade-in delay-300" style={{ marginTop: "4rem", padding: "3rem", background: "var(--surface-glass)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>ศึกษาข้อมูลเพิ่มเติม</h3>
                <p className="text-muted" style={{ marginBottom: "2rem" }}>
                    เลือกหัวข้อที่คุณสนใจเพื่อเรียนรู้เพิ่มเติมเกี่ยวกับฟุตบอล
                </p>
                <div className="flex gap-4 justify-center" style={{ flexWrap: "wrap" }}>
                    <Link href="/info/football" className="btn btn-primary btn-lg">ประวัติความเป็นมา</Link>
                    <Link href="/info/rules" className="btn btn-outline btn-lg">กฎกติกา</Link>
                    <Link href="/info/how-to-play" className="btn btn-outline btn-lg">วิธีการเล่น</Link>
                </div>
            </div>

        </>
    );
}
