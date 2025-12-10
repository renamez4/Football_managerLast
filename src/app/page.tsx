
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import { TiltCard } from "@/components/ui/TiltCard";
import { Magnetic } from "@/components/ui/Magnetic";

export default function Home() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      <BackgroundCanvas />

      <section className="hero fade-in">
        <h1>
          จัดการทีมฟุตบอลของคุณ
          <br />
          ได้ง่ายๆ ที่นี่
        </h1>
        <p>
          SportManager ช่วยให้คุณสร้างทีม ค้นหาผู้เล่น และจัดการตารางการแข่งขันได้อย่างมืออาชีพ
          พร้อมข้อมูลกีฬาฟุตบอลครบวงจร
        </p>
        <div className="flex gap-4 justify-center">
          <Magnetic>
            <Link href="/teams" className="btn btn-primary btn-lg">
              ค้นหาทีม
            </Link>
          </Magnetic>
          {loading ? (
            <span className="btn btn-outline btn-lg">...</span>
          ) : user ? (
            <Magnetic>
              <Link href="/teams/create" className="btn btn-outline btn-lg">
                สร้างทีม
              </Link>
            </Magnetic>
          ) : (
            <Magnetic>
              <Link href="/register" className="btn btn-outline btn-lg">
                สมัครสมาชิก
              </Link>
            </Magnetic>
          )}
        </div>
      </section>

      <section className="grid grid-cols-3 fade-in delay-200 mt-12 scroll-reveal">
        <TiltCard className="card feature-card">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">สร้างและเข้าร่วมทีม</h3>
          <p className="text-muted">
            สร้างทีมของคุณเองหรือค้นหาทีมที่เปิดรับสมัครเพื่อเข้าร่วมแข่งขัน
          </p>
        </TiltCard>

        <TiltCard className="card feature-card">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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
          </div>
          <h3 className="text-xl font-semibold mb-2">ข้อมูลกีฬาฟุตบอล</h3>
          <p className="text-muted">
            เรียนรู้กติกา วิธีการเล่น และเกร็ดความรู้ต่างๆ เกี่ยวกับฟุตบอล
          </p>
        </TiltCard>

        <TiltCard className="card feature-card">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">จัดการโปรไฟล์</h3>
          <p className="text-muted">
            บันทึกประวัติการเล่น แก้ไขข้อมูลส่วนตัว และดูสถานะทีมของคุณ
          </p>
        </TiltCard>
      </section>
    </>
  );
}
