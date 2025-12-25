"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
// Removed BackgroundCanvas import

export default function EditProfilePage() {
    const { user, updateProfile, loading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        profileImage: "",
        password: ""
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || "",
                phone: user.phone || "",
                profileImage: user.profileImage || ""
            }));
        }
    }, [user, loading, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await updateProfile(formData);
        setSubmitting(false);
        if (success) {
            alert("บันทึกข้อมูลเรียบร้อยแล้ว");
            router.push("/profile");
        }
    };

    if (loading || !user) return null;

    return (
        <>

            <main>
                <div style={{ maxWidth: "600px", margin: "0 auto" }} className="fade-in">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title text-primary">แก้ไขข้อมูลส่วนตัว</h2>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">อีเมล</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">เบอร์โทรศัพท์</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">รูปโปรไฟล์</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="fileInput"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-sm"
                                            onClick={() => document.getElementById('fileInput')?.click()}
                                        >
                                            เลือกไฟล์
                                        </button>
                                        <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                                            {formData.profileImage ? "เลือกรูปภาพแล้ว" : "ไม่ได้เลือกไฟล์ใด"}
                                        </span>
                                    </div>

                                    {formData.profileImage && (
                                        <div style={{ marginTop: "1rem" }}>
                                            <img
                                                key={formData.profileImage}
                                                src={formData.profileImage}
                                                alt="Preview"
                                                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--border)", display: "block" }}
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">รหัสผ่านใหม่ (ว่างไว้ถ้าไม่ต้องการเปลี่ยน)</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="กรอกเพื่อเปลี่ยนรหัสผ่าน"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4" style={{ paddingTop: "1rem" }}>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => router.back()}
                                        disabled={submitting}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)", border: "none" }}
                                        disabled={submitting}
                                    >
                                        {submitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
