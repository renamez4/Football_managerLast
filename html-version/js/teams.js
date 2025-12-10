// Team management utilities
const TEAMS_KEY = 'sport_manager_teams';
// USERS_DB_KEY is managed in auth.js, but we read from it here.
const USERS_DB_READ_KEY = 'sport_manager_users_db';

// Football positions
const POSITIONS = {
    starters: [
        { id: 'gk', name: 'ผู้รักษาประตู (GK)', category: 'ตัวจริง' },
        { id: 'lb', name: 'กองหลังซ้าย (LB)', category: 'ตัวจริง' },
        { id: 'cb1', name: 'กองหลังกลาง 1 (CB)', category: 'ตัวจริง' },
        { id: 'cb2', name: 'กองหลังกลาง 2 (CB)', category: 'ตัวจริง' },
        { id: 'rb', name: 'กองหลังขวา (RB)', category: 'ตัวจริง' },
        { id: 'cdm', name: 'กองกลางรับ (CDM)', category: 'ตัวจริง' },
        { id: 'cm1', name: 'กองกลาง 1 (CM)', category: 'ตัวจริง' },
        { id: 'cm2', name: 'กองกลาง 2 (CM)', category: 'ตัวจริง' },
        { id: 'rw', name: 'ปีกขวา (RW)', category: 'ตัวจริง' },
        { id: 'st', name: 'กองหน้า (ST)', category: 'ตัวจริง' },
        { id: 'lw', name: 'ปีกซ้าย (LW)', category: 'ตัวจริง' }
    ],
    substitutes: [
        { id: 'sub1', name: 'ตัวสำรอง 1', category: 'ตัวสำรอง' },
        { id: 'sub2', name: 'ตัวสำรอง 2', category: 'ตัวสำรอง' },
        { id: 'sub3', name: 'ตัวสำรอง 3', category: 'ตัวสำรอง' },
        { id: 'sub4', name: 'ตัวสำรอง 4', category: 'ตัวสำรอง' },
        { id: 'sub5', name: 'ตัวสำรอง 5', category: 'ตัวสำรอง' }
    ]
};

// Initialize with seed data
function initializeTeams() {
    try {
        const stored = localStorage.getItem(TEAMS_KEY);
        if (!stored) {
            const initialTeams = [];
            localStorage.setItem(TEAMS_KEY, JSON.stringify(initialTeams));
            return initialTeams;
        }
        return JSON.parse(stored);
    } catch (e) {
        console.error('Error initializing teams:', e);
        return [];
    }
}

// Get all teams
function getAllTeams() {
    return initializeTeams();
}

// Get team by ID
function getTeamById(id) {
    const teams = getAllTeams();
    return teams.find(team => team.id === id);
}

// Create empty positions object
// Create empty positions object with custom starter and substitute names
function createEmptyPositions(starterNames = [], substituteNames = []) {
    const positions = {};

    // Generate starters
    // If no starterNames provided (legacy), use defaults. 
    // But since this is a new feature, we expect starterNames if called from new form.
    // If not, we can fallback or just use what we have.
    if (starterNames && starterNames.length > 0) {
        starterNames.forEach((name, index) => {
            const id = 'starter_' + (index + 1);
            positions[id] = { player: null, name: name, category: 'ตัวจริง' };
        });
    } else {
        // Fallback or legacy support
        POSITIONS.starters.forEach(pos => {
            positions[pos.id] = { player: null, name: pos.name, category: pos.category };
        });
    }

    // Generate substitutes
    const subCount = 5; // Fixed 5 subs
    for (let i = 0; i < subCount; i++) {
        const id = 'sub_' + (i + 1);
        const name = (substituteNames && substituteNames[i]) ? substituteNames[i] : `ตัวสำรอง ${i + 1}`;
        positions[id] = { player: null, name: name, category: 'ตัวสำรอง' };
    }

    return positions;
}

// Create new team
function createTeam(teamData) {
    const teams = getAllTeams();
    // getCurrentUser is from auth.js
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    // Ensure user data is saved if saveUserToDatabase is available (from auth.js)
    if (currentUser && typeof saveUserToDatabase === 'function') {
        saveUserToDatabase(currentUser);
    }

    const newTeam = {
        id: Date.now().toString(),
        name: teamData.name,
        logo: teamData.logo || '',
        time: teamData.time,
        details: teamData.details,
        owner: currentUser ? currentUser.username : 'Unknown',
        createdBy: currentUser ? currentUser.username : 'Unknown',
        owner: currentUser ? currentUser.username : 'Unknown',
        createdBy: currentUser ? currentUser.username : 'Unknown',
        positions: createEmptyPositions(teamData.starterNames, teamData.substituteNames),
        totalSlots: 16,
        totalSlots: 16,
        filledSlots: 0,
        status: 'Open',
        matchRecords: {
            wins: 0,
            losses: 0,
            draws: 0
        }
    };
    teams.push(newTeam);
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return newTeam;
}

// Check if user is team owner
function isTeamOwner(teamId, username) {
    const team = getTeamById(teamId);
    return team && team.owner === username;
}

// Join team with position
function joinTeamPosition(teamId, username, positionId) {
    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
        return { success: false, message: 'ไม่พบทีม' };
    }

    const team = teams[teamIndex];

    // Check if position exists
    if (!team.positions[positionId]) {
        return { success: false, message: 'ไม่พบตำแหน่งนี้' };
    }

    // Check if position is already taken
    if (team.positions[positionId].player) {
        return { success: false, message: 'ตำแหน่งนี้มีผู้เล่นแล้ว' };
    }

    // Check if user already has a position in this team
    const userPositions = Object.values(team.positions).filter(pos => pos.player === username);
    if (userPositions.length >= 1) {
        return { success: false, message: 'คุณสามารถลงได้เพียง 1 ตำแหน่งเท่านั้น' };
    }

    // Save user to database if function exists
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (currentUser && typeof saveUserToDatabase === 'function') {
        saveUserToDatabase(currentUser);
    }

    // Assign player to position
    team.positions[positionId].player = username;
    team.filledSlots++;
    team.filledSlots++;
    team.status = team.filledSlots >= team.totalSlots ? 'Full' : 'Open';

    // Record join date (optional enhancement for history)
    if (!team.positions[positionId].joinDate) {
        team.positions[positionId].joinDate = Date.now();
    }

    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return { success: true, message: 'เข้าร่วมทีมสำเร็จ!' };
}

// Kick member from team (owner only)
function kickMember(teamId, username, memberToKick) {
    if (!isTeamOwner(teamId, username)) {
        return { success: false, message: 'คุณไม่ใช่เจ้าของทีม' };
    }

    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
        return { success: false, message: 'ไม่พบทีม' };
    }

    const team = teams[teamIndex];

    // Find and remove member from position
    let kicked = false;
    for (const [posId, pos] of Object.entries(team.positions)) {
        if (pos.player === memberToKick) {
            // Record history before kicking
            recordTeamHistory(memberToKick, team, pos, 'Kicked');

            team.positions[posId].player = null;
            team.filledSlots--;
            team.status = 'Open';
            kicked = true;

            // Check for Auto-Promotion
            if (pos.category === 'ตัวจริง') {
                tryAutoPromote(team, posId);
            }
            break;
        }
    }

    if (!kicked) {
        return { success: false, message: 'ไม่พบสมาชิกในทีม' };
    }

    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return { success: true, message: 'เตะสมาชิกออกจากทีมแล้ว' };
}

// Update match records (owner only)
function updateMatchRecords(teamId, username, result) {
    if (!isTeamOwner(teamId, username)) {
        return { success: false, message: 'คุณไม่ใช่เจ้าของทีม' };
    }

    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
        return { success: false, message: 'ไม่พบทีม' };
    }

    const team = teams[teamIndex];

    if (result === 'win') {
        team.matchRecords.wins++;
    } else if (result === 'loss') {
        team.matchRecords.losses++;
    } else if (result === 'draw') {
        team.matchRecords.draws++;
    } else {
        return { success: false, message: 'ผลการแข่งขันไม่ถูกต้อง' };
    }

    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return { success: true, message: 'บันทึกผลการแข่งขันแล้ว' };
}

// Get all team members with details
function getTeamMembers(teamId) {
    const team = getTeamById(teamId);
    if (!team) return [];

    const members = [];
    let usersDB = {};
    try {
        usersDB = JSON.parse(localStorage.getItem(USERS_DB_READ_KEY) || '{}');
    } catch (e) {
        console.error('Error reading users DB:', e);
    }

    for (const [posId, pos] of Object.entries(team.positions)) {
        if (pos.player) {
            const userData = usersDB[pos.player] || {};
            members.push({
                username: pos.player,
                position: pos.name,
                positionId: posId,
                email: userData.email || 'ไม่ระบุ',
                phone: userData.phone || 'ไม่ระบุ'
            });
        }
    }

    return members;
}

// Get teams user has joined
function getUserTeams(username) {
    const teams = getAllTeams();
    return teams.filter(team => {
        if (!team.positions) return false;
        return Object.values(team.positions).some(pos => pos.player === username);
    });
}

// Get user position in team
// Get user positions in team
function getUserPositionsInTeam(teamId, username) {
    const team = getTeamById(teamId);
    if (!team || !team.positions) return [];

    const positions = [];
    for (const [posId, pos] of Object.entries(team.positions)) {
        if (pos.player === username) {
            positions.push({ positionId: posId, ...pos });
        }
    }
    return positions;
}

// Get available positions in team
function getAvailablePositions(teamId) {
    const team = getTeamById(teamId);
    if (!team || !team.positions) return [];

    return Object.entries(team.positions)
        .filter(([_, pos]) => !pos.player)
        .map(([id, pos]) => ({ id, ...pos }));
}

// Leave specific position
function leaveTeamPosition(teamId, username, positionId) {
    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
        return { success: false, message: 'ไม่พบทีม' };
    }

    const team = teams[teamIndex];

    if (!team.positions[positionId] || team.positions[positionId].player !== username) {
        return { success: false, message: 'คุณไม่ได้อยู่ในตำแหน่งนี้' };
    }

    const leftPositionName = team.positions[positionId].name;
    const isStarter = team.positions[positionId].category === 'ตัวจริง';

    // Record history before leaving
    recordTeamHistory(username, team, team.positions[positionId], 'Left');

    team.positions[positionId].player = null;
    team.filledSlots--;
    team.status = 'Open';

    let message = 'ออกจากตำแหน่งเรียบร้อยแล้ว';

    if (isStarter) {
        const promoted = tryAutoPromote(team, positionId);
        // if (promoted) {
        //     message += ` (เลื่อนตำแหน่ง ${promoted} ขึ้นมาแทนที่อัตโนมัติ)`;
        // }
    }

    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return { success: true, message: message };
}

// Helper for Auto-Promotion
function tryAutoPromote(team, emptyStarterId) {
    const starterPos = team.positions[emptyStarterId];
    if (!starterPos) return null;

    const starterKey = extractPositionKey(starterPos.name);

    // Find a substitute with the matching position key
    const candidates = Object.entries(team.positions).filter(([id, pos]) => {
        if (pos.category !== 'ตัวสำรอง' || !pos.player) return false;

        const subKey = extractPositionKey(pos.name);
        return subKey === starterKey;
    });

    if (candidates.length > 0) {
        // Pick the first one (or could be based on join time if we tracked it)
        const [subId, subPos] = candidates[0];
        const playerToPromote = subPos.player;

        // Move player
        team.positions[emptyStarterId].player = playerToPromote;
        team.positions[subId].player = null; // Clear sub slot

        console.log(`Auto-promoted ${playerToPromote} from ${subPos.name} to ${starterPos.name} (Key: ${starterKey})`);
        return playerToPromote;
    }
    return null;
}

// Extract position key for matching
// 1. If contains (...), verify content inside.
// 2. Else use full string.
// Case-insensitive, trimmed.
function extractPositionKey(name) {
    if (!name) return '';

    // Check for parentheses
    const match = name.match(/\(([^)]+)\)/);
    if (match) {
        return match[1].trim().toLowerCase();
    }

    return name.trim().toLowerCase();
}

// Leave team (leave all positions)
function leaveTeam(teamId, username) {
    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
        return { success: false, message: 'ไม่พบทีม' };
    }

    const team = teams[teamIndex];
    let removed = false;

    // Remove user from any position they hold
    for (const [posId, pos] of Object.entries(team.positions)) {
        if (pos.player === username) {
            // Record history before leaving
            recordTeamHistory(username, team, pos, 'Left');

            team.positions[posId].player = null;
            team.filledSlots--;
            team.status = 'Open';
            removed = true;

            // Check for auto-promotion if it was a starter
            const positionObj = team.positions[posId];
            if (positionObj.category === 'ตัวจริง') {
                tryAutoPromote(team, posId);
            }

            // Continue loop to remove from all positions
        }
    }

    if (!removed) {
        return { success: false, message: 'คุณไม่ได้อยู่ในทีมนี้' };
    }

    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return { success: true, message: 'ออกจากทีมเรียบร้อยแล้ว' };
}

// Delete team (for owner)
function deleteTeam(teamId, username) {
    if (!isTeamOwner(teamId, username)) {
        return { success: false, message: 'คุณไม่ใช่เจ้าของทีม' };
    }

    let teams = getAllTeams();
    const initialLength = teams.length;
    teams = teams.filter(t => t.id !== teamId);

    if (teams.length === initialLength) {
        return { success: false, message: 'ไม่พบทีม' };
    }

    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return { success: true, message: 'ลบทีมเรียบร้อยแล้ว' };
}

// Record team history for a user
function recordTeamHistory(username, team, position, reason) {
    try {
        const usersDB = JSON.parse(localStorage.getItem(USERS_DB_READ_KEY) || '{}');
        const user = usersDB[username];

        if (!user) return; // User not found (shouldn't happen)

        if (!user.teamHistory) {
            user.teamHistory = [];
        }

        user.teamHistory.unshift({
            teamId: team.id,
            teamName: team.name,
            position: position.name,
            category: position.category,
            joinDate: position.joinDate || null, // Might be undefined for old records
            leftDate: Date.now(),
            matchStats: { ...team.matchRecords }, // Snapshot of stats
            reason: reason
        });

        // Limit history size if needed (e.g. keep last 20)
        if (user.teamHistory.length > 50) {
            user.teamHistory = user.teamHistory.slice(0, 50);
        }

        localStorage.setItem(USERS_DB_READ_KEY, JSON.stringify(usersDB));
    } catch (e) {
        console.error('Error recording team history:', e);
    }
}

// Update team details
function updateTeam(teamId, updates) {
    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
        return { success: false, message: 'ไม่พบทีม' };
    }

    const team = teams[teamIndex];

    // Update basic fields
    team.name = updates.name || team.name;
    team.time = updates.time || team.time;
    team.details = updates.details || team.details;
    if (updates.logo) team.logo = updates.logo;

    // Update Position Names (Starters)
    if (updates.starterNames && updates.starterNames.length > 0) {
        updates.starterNames.forEach((name, index) => {
            const id = 'starter_' + (index + 1);
            if (team.positions[id]) {
                team.positions[id].name = name;
            }
        });
    }

    // Update Position Names (Substitutes)
    if (updates.substituteNames && updates.substituteNames.length > 0) {
        updates.substituteNames.forEach((name, index) => {
            const id = 'sub_' + (index + 1);
            if (team.positions[id]) {
                team.positions[id].name = name;
            }
        });
    }

    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    return { success: true, message: 'บันทึกการแก้ไขเรียบร้อยแล้ว' };
}
