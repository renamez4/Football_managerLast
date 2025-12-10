// Navigation and component utilities

// Render navbar
function renderNavbar() {
    const user = getCurrentUser();
    const navbar = document.getElementById('navbar');

    navbar.innerHTML = `
        <div class="container">
            <a href="index.html" class="navbar-brand">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
                <span>FootballManager</span>
            </a>
            <nav class="navbar-links">
                <a href="teams.html">ทีมทั้งหมด</a>
                <a href="football.html">ข้อมูลกีฬา</a>
            </nav>
            <div class="navbar-actions">
                ${user ? `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <a href="profile.html" class="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            ${user.username}
                        </a>
                        <button onclick="handleLogout()" class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;">
                            ออกจากระบบ
                        </button>
                    </div>
                ` : `
                    <a href="login.html" class="btn btn-ghost btn-sm">เข้าสู่ระบบ</a>
                    <a href="register.html" class="btn btn-primary btn-sm">สมัครสมาชิก</a>
                `}
            </div>
        </div>
    `;
}

// Handle logout
function handleLogout() {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
        logout();
        window.location.href = 'index.html';
    }
}

// Render footer
function renderFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
        footer.innerHTML = `
            <p>© 2025 FootballManager.</p>
        `;
    }
}

// Initialize page
function initPage() {
    renderNavbar();
    renderFooter();
}

// Show alert message
function showAlert(message, type = 'success') {
    alert(message);
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('th-TH');
}
