document.addEventListener('DOMContentLoaded', () => {
    const mathData = window.MATH7_DATA || {
        volume1: window.LESSONS_DATA || [],
        volume2: [],
        khtn7: []
    };

    // DOM Elements - Screens
    const welcomeScreen = document.getElementById('welcome-screen');
    const readerView = document.getElementById('reader-view');

    // DOM Elements - Sidebar
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const themeToggleBtn = document.getElementById('sidebar-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const fontIncreaseBtn = document.getElementById('font-increase');
    const lessonListEl = document.getElementById('lesson-list');
    const contentBodyEl = document.getElementById('content-body');

    let currentVolume = 'volume1';
    let activeLessons = [];
    let currentFontSize = 22; // Base font size default

    // --- SCREEN TRANSITIONS ---
    function showWelcomeScreen() {
        welcomeScreen.style.display = 'flex';
        readerView.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showReaderScreen(volKey) {
        welcomeScreen.style.display = 'none';
        readerView.style.display = 'block';
        setVolume(volKey);
    }

    // Connect Welcome Screen 3 Cards
    document.querySelectorAll('.minimal-hub-card').forEach(card => {
        card.addEventListener('click', () => {
            const vol = card.getAttribute('data-volume');
            showReaderScreen(vol);
        });
    });

    // --- VOLUME SWITCHING ---
    function setVolume(volKey) {
        currentVolume = volKey;
        activeLessons = mathData[volKey] || [];
        renderSidebar(activeLessons);

        if (activeLessons.length > 0) {
            loadLesson(activeLessons[0]);
        }
    }

    // --- SIDEBAR RENDERING ---
    function renderSidebar(lessons = activeLessons) {
        lessonListEl.innerHTML = '';
        if (lessons.length === 0) {
            lessonListEl.innerHTML = '<li class="no-results">Chưa có bài học.</li>';
            return;
        }

        lessons.forEach((lesson, index) => {
            const li = document.createElement('li');
            li.className = `lesson-item ${index === 0 ? 'active' : ''}`;
            li.setAttribute('data-id', lesson.id);

            const cleanTitle = lesson.title
                .replace(/^CHƯƠNG\s+[IVX\d]+[^:]*:\s*/i, '')
                .replace(/^[🎮📖📚🌟🧪\s]+/, '')
                .trim();

            let icon = '📘';
            if (currentVolume === 'volume2') icon = '📕';
            if (currentVolume === 'khtn7') icon = '🧪';

            li.innerHTML = `
                <span class="lesson-icon">${icon}</span>
                <span class="lesson-name">${cleanTitle}</span>
            `;

            li.addEventListener('click', () => {
                document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                loadLesson(lesson);
                // On mobile, auto close sidebar after selecting
                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('open');
                }
            });

            lessonListEl.appendChild(li);
        });
    }

    // --- LOAD ACTIVE LESSON ---
    function loadLesson(lesson) {
        contentBodyEl.innerHTML = lesson.html;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- CONTINUOUS FONT SIZE CONTROLS (TĂNG/GIẢM MÃI HOÀI) ---
    function setFontSize(size) {
        currentFontSize = Math.max(10, size); // Minimum 10px, no upper limit!
        const zoomFactor = currentFontSize / 22;
        document.body.style.setProperty('--base-font-size', `${currentFontSize}px`);
        document.body.style.setProperty('--zoom-factor', zoomFactor);
        localStorage.setItem('math7_font_size', currentFontSize);
    }

    if (fontIncreaseBtn) {
        fontIncreaseBtn.addEventListener('click', () => {
            setFontSize(currentFontSize + 2); // Tăng lên 2px mỗi lần bấm không giới hạn
        });
    }

    if (fontDecreaseBtn) {
        fontDecreaseBtn.addEventListener('click', () => {
            setFontSize(currentFontSize - 2); // Giảm đi 2px mỗi lần bấm
        });
    }

    // --- DARK / LIGHT THEME TOGGLE IN SIDEBAR ---
    function updateThemeUI(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Sáng';
            if (themeToggleBtn) themeToggleBtn.classList.add('active');
        } else {
            document.body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Tối';
            if (themeToggleBtn) themeToggleBtn.classList.remove('active');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark-theme');
            updateThemeUI(isDark);
            localStorage.setItem('math7_theme', isDark ? 'dark' : 'light');
        });
    }

    // --- SIDEBAR TOGGLE ---
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            sidebar.classList.toggle('open');
        });
    }

    // --- INITIALIZATION ---
    // 1. Theme
    const savedTheme = localStorage.getItem('math7_theme');
    if (savedTheme === 'dark') {
        updateThemeUI(true);
    } else {
        updateThemeUI(false);
    }

    // 2. Font Size
    const savedFontSize = localStorage.getItem('math7_font_size');
    if (savedFontSize) {
        setFontSize(parseInt(savedFontSize));
    } else {
        setFontSize(22);
    }

    // 3. Show Welcome Selection Hub initially (reload returns here)
    showWelcomeScreen();
});
