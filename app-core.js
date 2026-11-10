// ==========================================
// Özel Eğitim Akademi - Core JavaScript (app-core.js)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initTheme();
    updateXPUI();
    updateStreakUI();
    renderActivityCalendar();
}

// ------------------------------------------
// 1. TEMA YÖNETİMİ (Dark / Light Theme)
// ------------------------------------------
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');

    if (savedTheme === 'light') {
        body.classList.remove('bg-slate-950', 'text-slate-100');
        body.classList.add('bg-slate-100', 'text-slate-900');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    } else {
        body.classList.remove('bg-slate-100', 'text-slate-900');
        body.classList.add('bg-slate-950', 'text-slate-100');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    }
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const isDark = body.classList.contains('bg-slate-950');

    if (isDark) {
        body.classList.remove('bg-slate-950', 'text-slate-100');
        body.classList.add('bg-slate-100', 'text-slate-900');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('bg-slate-100', 'text-slate-900');
        body.classList.add('bg-slate-950', 'text-slate-100');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// ------------------------------------------
// 2. XP & SERİ (STREAK) YÖNETİMİ
// ------------------------------------------
function getXP() {
    return parseInt(localStorage.getItem('ozel_egitim_xp') || '0', 10);
}

function addXP(amount) {
    const current = getXP();
    const updated = current + amount;
    localStorage.setItem('ozel_egitim_xp', updated.toString());
    updateXPUI();
    logActivityMinutes(5); // Her XP kazanımında günlüğe aktiflik ekler
}

function updateXPUI() {
    const xp = getXP();
    const headerXP = document.getElementById('headerXP');
    const totalXPStat = document.getElementById('totalXPStat');

    if (headerXP) headerXP.textContent = `${xp} XP`;
    if (totalXPStat) totalXPStat.textContent = `${xp} XP`;
}

function updateStreakUI() {
    const streak = localStorage.getItem('ozel_egitim_streak') || '1';
    const headerStreak = document.getElementById('headerStreak');
    if (headerStreak) headerStreak.textContent = `${streak} Gün`;
}

// ------------------------------------------
// 3. ÇALIŞMA AKTİVİTE TAKVİMİ (DÜZELTİLMİŞ SIRA 1..31)
// ------------------------------------------
function renderActivityCalendar() {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const todayDate = today.getDate();

    // İçinde bulunulan ayın toplam gün sayısı (28, 30 veya 31)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Çalışma verileri
    const activityData = JSON.parse(localStorage.getItem('ozel_egitim_activity') || '{}');

    let html = '';

    // Ayın 1'inden son gününe kadar nizamı sıralama
    for (let day = 1; day <= daysInMonth; day++) {
        const monthStr = String(currentMonth + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

        const minutes = activityData[dateKey] || 0;

        let bgStyle = 'bg-slate-900/90 border-slate-800 text-slate-500';
        let statusTitle = 'Çalışılmadı';

        if (day === todayDate) {
            bgStyle = 'bg-indigo-950 border-2 border-indigo-500 text-indigo-200 font-extrabold shadow-lg shadow-indigo-500/30';
            statusTitle = `Bugün (${minutes} dk)`;
        } else if (minutes >= 45) {
            bgStyle = 'bg-emerald-600 border-emerald-500 text-white font-bold';
            statusTitle = `${minutes} dk çalışıldı`;
        } else if (minutes >= 15) {
            bgStyle = 'bg-indigo-600 border-indigo-500 text-white font-semibold';
            statusTitle = `${minutes} dk çalışıldı`;
        } else if (minutes > 0) {
            bgStyle = 'bg-purple-600/80 border-purple-500 text-white';
            statusTitle = `${minutes} dk çalışıldı`;
        }

        html += `
            <div class="w-10 h-10 rounded-xl border flex items-center justify-center text-xs transition-all duration-200 cursor-pointer ${bgStyle}" 
                 title="${day} ${getTurkishMonthName(currentMonth)}: ${statusTitle}">
                ${day}
            </div>
        `;
    }

    container.innerHTML = html;
}

function logActivityMinutes(minutesToAdd) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const activityData = JSON.parse(localStorage.getItem('ozel_egitim_activity') || '{}');
    activityData[dateKey] = (activityData[dateKey] || 0) + minutesToAdd;
    
    localStorage.setItem('ozel_egitim_activity', JSON.stringify(activityData));
    renderActivityCalendar();
}

function getTurkishMonthName(monthIndex) {
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    return months[monthIndex];
}