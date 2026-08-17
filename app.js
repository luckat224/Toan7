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

    // Connect Back to Hub button
    const btnBackHub = document.getElementById('btn-back-hub');
    if (btnBackHub) {
        btnBackHub.addEventListener('click', showWelcomeScreen);
    }

    // --- VOLUME SWITCHING ---
    function setVolume(volKey) {
        currentVolume = volKey;
        activeLessons = mathData[volKey] || [];
        renderSidebar(activeLessons);

        if (activeLessons.length > 0) {
            loadLesson(activeLessons[0]);
        }
    }

    // --- DYNAMIC LESSON ICON RESOLVER (TÙY THEO MÔN HỌC & CHỦ ĐỀ) ---
    function getLessonIcon(lesson, volumeKey) {
        // Priority 1: Extract leading emoji from title if specific
        const emojiRegex = /^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}]\uFE0F?)/u;
        const match = lesson.title.trim().match(emojiRegex);
        if (match && match[1] && match[1] !== '🎮' && match[1] !== '📖' && match[1] !== '📚') {
            return match[1];
        }

        const id = lesson.id.toLowerCase();

        // KHTN 7 subject-specific mapping (Hóa học, Vật lí, Sinh học)
        if (volumeKey === 'khtn7') {
            if (id.includes('bai_00')) return '🌟';
            if (id.includes('bai_01')) return '🔬';
            // Chemistry (Hóa học: Bài 2 -> 7)
            if (id.includes('bai_02')) return '⚛️'; // Nguyên tử
            if (id.includes('bai_03')) return '🏷️'; // Nguyên tố
            if (id.includes('bai_04')) return '📊'; // Bảng tuần hoàn
            if (id.includes('bai_05')) return '🧊'; // Phân tử, Đơn chất, Hợp chất
            if (id.includes('bai_06')) return '🔗'; // Liên kết hóa học
            if (id.includes('bai_07')) return '⚖️'; // Hóa trị & CTHH
            if (/bai_0[2-7]/.test(id)) return '🧪';

            // Physics (Vật lí: Bài 8 -> 20)
            if (id.includes('bai_08')) return '🏎️'; // Tốc độ
            if (id.includes('bai_09')) return '⏱️'; // Đo tốc độ
            if (id.includes('bai_10')) return '📈'; // Đồ thị s-t
            if (id.includes('bai_11')) return '🚦'; // An toàn giao thông
            if (id.includes('bai_12')) return '🔊'; // Sóng âm
            if (id.includes('bai_13')) return '🎵'; // Độ to độ cao
            if (id.includes('bai_14')) return '🛡️'; // Phản xạ âm, chống ồn
            if (id.includes('bai_15')) return '💡'; // Năng lượng ánh sáng
            if (id.includes('bai_16')) return '🪞'; // Phản xạ ánh sáng
            if (id.includes('bai_17')) return '🕯️'; // Ảnh qua gương phẳng
            if (id.includes('bai_18')) return '🧲'; // Nam châm
            if (id.includes('bai_19')) return '🌐'; // Từ trường
            if (id.includes('bai_20')) return '🔋'; // Nam châm điện
            if (/bai_(0[8-9]|1[0-9]|20)/.test(id)) return '⚡';

            // Biology (Sinh học: Bài 21 -> 42)
            if (id.includes('bai_21')) return '🔄'; // Trao đổi chất
            if (id.includes('bai_22')) return '🍃'; // Quang hợp
            if (id.includes('bai_23')) return '☀️'; // Yếu tố quang hợp
            if (id.includes('bai_24')) return '🌿'; // Thực hành quang hợp
            if (id.includes('bai_25')) return '🫁'; // Hô hấp tế bào
            if (id.includes('bai_26')) return '🌡️'; // Yếu tố hô hấp
            if (id.includes('bai_27')) return '🫁'; // Thực hành hô hấp
            if (id.includes('bai_28')) return '💨'; // Trao đổi khí
            if (id.includes('bai_29')) return '💧'; // Nước & Dinh dưỡng
            if (id.includes('bai_30')) return '🌳'; // Trao đổi nước cây
            if (id.includes('bai_31')) return '🐾'; // Dinh dưỡng động vật
            if (id.includes('bai_32')) return '🔬'; // Thực hành thoát hơi nước
            if (id.includes('bai_33')) return '🌻'; // Cảm ứng sinh vật
            if (id.includes('bai_34')) return '🌾'; // Cảm ứng thực tiễn
            if (id.includes('bai_35')) return '🔍'; // Thực hành cảm ứng
            if (id.includes('bai_36')) return '🌱'; // Sinh trưởng
            if (id.includes('bai_37')) return '🐔'; // Ứng dụng sinh trưởng
            if (id.includes('bai_38')) return '🦋'; // Thực hành sinh trưởng
            if (id.includes('bai_39')) return '✂️'; // Sinh sản vô tính
            if (id.includes('bai_40')) return '🌸'; // Sinh sản hữu tính
            if (id.includes('bai_41')) return '🐮'; // Điều khiển sinh sản
            if (id.includes('bai_42')) return '🧬'; // Thể thống nhất
            return '🌱';
        }

        // Toán Tập 1
        if (volumeKey === 'volume1') {
            if (id.includes('bai_00')) return '🌟';
            if (/bai_0[1-2]/.test(id)) return '🍕'; // Số hữu tỉ
            if (/bai_0[3-4]/.test(id)) return '🧮'; // Lũy thừa, phép tính
            if (/bai_0[5-7]/.test(id)) return '🔢'; // Số thập phân, vô tỉ, số thực
            if (/bai_0[8-9]|bai_1[0-1]/.test(id)) return '📐'; // Góc, song song, định lí
            if (/bai_1[2-6]/.test(id)) return '🔺'; // Tam giác
            if (/bai_1[7-9]/.test(id)) return '📊'; // Thống kê, biểu đồ
            if (id.includes('luyen_tap')) return '🎯';
            if (id.includes('on_tap')) return '🎓';
            return '📘';
        }

        // Toán Tập 2
        if (volumeKey === 'volume2') {
            if (id.includes('bai_00')) return '🌟';
            if (/bai_2[0-3]/.test(id)) return '⚖️'; // Tỉ lệ thức
            if (/bai_2[4-8]/.test(id)) return '🧮'; // Đại số, đa thức
            if (/bai_29|bai_30/.test(id)) return '🎲'; // Xác suất, biến cố
            if (/bai_3[1-5]/.test(id)) return '📐'; // Quan hệ tam giác
            if (/bai_3[6-7]/.test(id)) return '📦'; // Hình khối
            if (id.includes('luyen_tap')) return '🎯';
            if (id.includes('cuoi_chuong')) return '🏆';
            if (id.includes('on_tap')) return '🎓';
            return '📕';
        }

        return '📘';
    }

    // --- SUBJECT & TOPIC RESOLVER (HÓA / LÝ / SINH / SỐ HỌC / ĐẠI SỐ...) ---
    function getLessonSubject(lesson, volumeKey) {
        const id = lesson.id.toLowerCase();

        if (volumeKey === 'khtn7') {
            if (id.includes('bai_00') || id.includes('bai_01')) {
                return { tag: 'khtn', label: 'KHTN', full: 'Khoa học Tự nhiên 7' };
            }
            if (/bai_0[2-7]/.test(id)) {
                return { tag: 'hoa', label: 'Hóa', full: 'Phân môn Hóa học' };
            }
            if (/bai_(0[8-9]|1[0-9]|20)/.test(id)) {
                return { tag: 'ly', label: 'Lý', full: 'Phân môn Vật lí' };
            }
            if (/bai_(2[1-9]|3[0-9]|4[0-2])/.test(id)) {
                return { tag: 'sinh', label: 'Sinh', full: 'Phân môn Sinh học' };
            }
            return { tag: 'khtn', label: 'KHTN', full: 'Khoa học Tự nhiên 7' };
        }

        if (volumeKey === 'volume1') {
            if (id.includes('bai_00')) return { tag: 'tonghop', label: 'Tổng hợp', full: 'Toán 7 Tập 1' };
            if (/bai_0[1-7]|chuong_i\b/.test(id)) return { tag: 'sohoc', label: 'Số học', full: 'Số học & Số thực' };
            if (/bai_0[8-9]|bai_1[0-6]|chuong_iii_iv\b/.test(id)) return { tag: 'hinhhoc', label: 'Hình học', full: 'Hình học phẳng' };
            if (/bai_1[7-9]|chuong_v\b/.test(id)) return { tag: 'thongke', label: 'Thống kê', full: 'Thống kê & Dữ liệu' };
            if (id.includes('on_tap')) return { tag: 'ontap', label: 'Ôn tập', full: 'Đại hội Ôn tập' };
            return { tag: 'toan', label: 'Toán', full: 'Toán 7 Tập 1' };
        }

        if (volumeKey === 'volume2') {
            if (id.includes('bai_00')) return { tag: 'tonghop', label: 'Tổng hợp', full: 'Toán 7 Tập 2' };
            if (/bai_2[0-3]|chuong_vi\b/.test(id)) return { tag: 'daiso', label: 'Tỉ lệ thức', full: 'Tỉ lệ thức & Đại lượng tỉ lệ' };
            if (/bai_2[4-8]|chuong_vii\b/.test(id)) return { tag: 'daiso', label: 'Đại số', full: 'Biểu thức & Đa thức' };
            if (/bai_29|bai_30|chuong_viii\b/.test(id)) return { tag: 'xacsuat', label: 'Xác suất', full: 'Biến cố & Xác suất' };
            if (/bai_3[1-5]|chuong_ix\b/.test(id)) return { tag: 'hinhhoc', label: 'Hình học', full: 'Quan hệ trong tam giác' };
            if (/bai_3[6-7]|chuong_x\b/.test(id)) return { tag: 'hinhkhoi', label: 'Hình khối', full: 'Hình khối trong thực tiễn' };
            if (id.includes('luyen_tap')) return { tag: 'luyentap', label: 'Luyện tập', full: 'Luyện tập chung' };
            if (id.includes('on_tap')) return { tag: 'ontap', label: 'Ôn tập', full: 'Đại hội Ôn tập' };
            return { tag: 'toan', label: 'Toán', full: 'Toán 7 Tập 2' };
        }

        return { tag: 'default', label: '', full: '' };
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

            const icon = getLessonIcon(lesson, currentVolume);
            const sub = getLessonSubject(lesson, currentVolume);
            const badgeHtml = sub.label ? `<span class="subject-tag tag-${sub.tag}">${sub.label}</span>` : '';

            const cleanTitle = lesson.title
                .replace(/^CHƯƠNG\s+[IVX\d]+[^:]*:\s*/i, '')
                .replace(/^[\s\uFE0F\u200D\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}]+\s*/u, '')
                .trim();

            li.innerHTML = `
                <span class="lesson-icon">${icon}</span>
                ${badgeHtml}
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
        const sub = getLessonSubject(lesson, currentVolume);
        let subjectBanner = '';
        if (currentVolume === 'khtn7') {
            let bannerText = '🔬 KHOA HỌC TỰ NHIÊN 7';
            if (sub.tag === 'hoa') bannerText = '⚛️ PHÂN MÔN HÓA HỌC';
            else if (sub.tag === 'ly') bannerText = '⚡ PHÂN MÔN VẬT LÍ';
            else if (sub.tag === 'sinh') bannerText = '🌿 PHÂN MÔN SINH HỌC';

            subjectBanner = `<div class="lesson-subject-header-badge tag-${sub.tag}">${bannerText}</div>`;
        }

        contentBodyEl.innerHTML = subjectBanner + lesson.html;
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
