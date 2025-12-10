
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./auth"; // เพื่อดึง Token

const API_URL = "http://127.0.0.1:5000/api/teams";

export interface Member {
    username: string;
    email: string;
    phone: string;
}

export interface Team {
    id: number;
    name: string;
    logo?: string;
    time: string;
    details: string;
    players: number; // Max players
    currentPlayers: number;
    owner?: string;
    status: "Open" | "Full";
    members: Member[]; // Usernames -> Member objects
    positions?: Record<string, { name: string, player: string | null }>;
    stats?: {
        starters: { filled: number, total: number };
        subs: { filled: number, total: number };
    };
    matchStats?: {
        wins: number;
        losses: number;
        draws: number;
    };
}

export function useTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const data = await res.json();
                setTeams(data);
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
        } finally {
            setLoading(false);
        }
    };

    const createTeam = async (teamData: any) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนสร้างทีม");
            return null;
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(teamData)
            });

            const data = await res.json();
            if (res.ok) {
                setTeams([...teams, data]);
                return data;
            } else {
                alert(data.message || "สร้างทีมไม่สำเร็จ");
                return null;
            }
        } catch (error) {
            console.error("Create team error:", error);
            return null;
        }
    };

    const joinTeamPosition = async (teamId: number, positionId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("กรุณาเข้าสู่ระบบ");
            return { success: false, message: "กรุณาเข้าสู่ระบบ" };
        }

        try {
            const res = await fetch(`${API_URL}/${teamId}/join-position`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ positionId })
            });

            const data = await res.json();
            if (res.ok) {
                // Update state
                setTeams(teams.map(t => t.id === teamId ? data.team : t));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Connection error" };
        }
    };

    const leaveTeamPosition = async (teamId: number, positionId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return { success: false };

        try {
            const res = await fetch(`${API_URL}/${teamId}/leave-position`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ positionId })
            });
            const data = await res.json();
            if (res.ok) {
                setTeams(teams.map(t => t.id === teamId ? data.team : t));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Error" };
        }
    };

    const kickMember = async (teamId: number, username: string) => {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, message: "Unauthorized" };

        try {
            const res = await fetch(`${API_URL}/${teamId}/kick`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (res.ok) {
                setTeams(teams.map(t => t.id === teamId ? data.team : t));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Error" };
        }
    };

    const updateMatchRecords = async (teamId: number, result: 'win' | 'loss' | 'draw') => {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, message: "Unauthorized" };

        try {
            const res = await fetch(`${API_URL}/${teamId}/match-records`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ result })
            });
            const data = await res.json();
            if (res.ok) {
                setTeams(teams.map(t => t.id === teamId ? data.team : t));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Error" };
        }
    };

    const updateTeam = async (teamId: number, data: any) => {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, message: "Unauthorized" };

        try {
            const res = await fetch(`${API_URL}/${teamId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const resData = await res.json();
            if (res.ok) {
                setTeams(teams.map(t => t.id === teamId ? resData.team : t));
                return { success: true, message: resData.message };
            } else {
                return { success: false, message: resData.message };
            }
        } catch (error) {
            return { success: false, message: "Connection error" };
        }
    };

    const deleteTeam = async (teamId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, message: "Unauthorized" };

        try {
            const res = await fetch(`${API_URL}/${teamId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setTeams(teams.filter(t => t.id !== teamId));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Connection error" };
        }
    };

    return { teams, createTeam, joinTeam: () => { }, joinTeamPosition, leaveTeamPosition, kickMember, updateMatchRecords, updateTeam, deleteTeam, loading };
}
