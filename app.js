document.addEventListener('DOMContentLoaded', () => {
    const lessons = window.LESSONS_DATA || [];
    const lessonListEl = document.getElementById('lesson-list');
    const contentBodyEl = document.getElementById('content-body');
    const searchInput = document.getElementById('search-input');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const fontPlusBtn = document.getElementById('font-plus');
    const fontMinusBtn = document.getElementById('font-minus');
    const presbyopiaBtn = document.getElementById('presbyopia-mode');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    let currentFontSize = 22;

    // Render Sidebar Lessons List
    function renderSidebar(filteredLessons = lessons) {
        lessonListEl.innerHTML = '';
        if (filteredLessons.length === 0) {
            lessonListEl.innerHTML = '<li style="padding: 12px; color: #94a3b8;">Không tìm thấy bài học phù hợp.</li>';
            return;
        }

        filteredLessons.forEach((lesson, index) => {
            const li = document.createElement('li');
            li.className = `lesson-item ${index === 0 ? 'active' : ''}`;
            li.setAttribute('data-id', lesson.id);
            const cleanTitle = lesson.title
                .replace(/^CHƯƠNG\s+[IVX\d]+[^:]*:\s*/i, '')
                .replace(/^[🎮📖📚\s]+/, '')
                .trim();
            li.innerHTML = `<span class="lesson-icon">📘</span> <span class="lesson-name">${cleanTitle}</span>`;
            
            li.addEventListener('click', () => {
                document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                loadLesson(lesson);
            });

            lessonListEl.appendChild(li);
        });
    }

    // Load Active Lesson
    function loadLesson(lesson) {
        contentBodyEl.innerHTML = lesson.html;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Search Filter Functionality (if present)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderSidebar(lessons);
                return;
            }
            const filtered = lessons.filter(l => 
                l.title.toLowerCase().includes(query) || 
                l.html.toLowerCase().includes(query)
            );
            renderSidebar(filtered);
        });
    }

    // Font & Image / SVG Size Adjusters (Presbyopia friendly)
    function setFontSize(size) {
        currentFontSize = size;
        const zoomFactor = currentFontSize / 22;
        document.body.style.setProperty('--base-font-size', `${currentFontSize}px`);
        document.body.style.setProperty('--zoom-factor', zoomFactor);
        localStorage.setItem('math7_font_size', currentFontSize);
    }

    fontPlusBtn.addEventListener('click', () => setFontSize(currentFontSize + 2));
    fontMinusBtn.addEventListener('click', () => setFontSize(Math.max(16, currentFontSize - 2)));
    presbyopiaBtn.addEventListener('click', () => setFontSize(26)); // Super Big for Presbyopia (Scales both Text & SVGs/Images)

    // Theme Toggle (if present)
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggleBtn.innerHTML = isDark ? '☀️' : '🌙';
            localStorage.setItem('math7_theme', isDark ? 'dark' : 'light');
        });
    }

    // Sidebar Toggle
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Navbar Toolbar Collapse Toggle
    const collapseBtn = document.getElementById('navbar-collapse-btn');
    const navbar = document.querySelector('.navbar');

    if (collapseBtn && navbar) {
        collapseBtn.addEventListener('click', () => {
            navbar.classList.toggle('toolbar-collapsed');
            const isCollapsed = navbar.classList.contains('toolbar-collapsed');
            collapseBtn.innerHTML = isCollapsed ? '▼' : '▲';
            collapseBtn.title = isCollapsed ? 'Hiện đầy đủ thanh công cụ' : 'Thu nhỏ thanh công cụ';
            localStorage.setItem('math7_toolbar_collapsed', isCollapsed ? 'true' : 'false');
        });

        const savedCollapsed = localStorage.getItem('math7_toolbar_collapsed');
        if (savedCollapsed === 'true') {
            navbar.classList.add('toolbar-collapsed');
            collapseBtn.innerHTML = '▼';
            collapseBtn.title = 'Hiện đầy đủ thanh công cụ';
        }
    }

    // Initial Load
    const savedFontSize = localStorage.getItem('math7_font_size');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));

    const savedTheme = localStorage.getItem('math7_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️';
    }

    renderSidebar(lessons);
    if (lessons.length > 0) {
        loadLesson(lessons[0]);
    }
});
