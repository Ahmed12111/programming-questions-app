import { model } from './model.js';
import { view } from './view.js';

// --- CONTROLLER ---
// العقل المدبر الذي يربط بين الـ Model والـ View
const controller = {
    async init() {
        // إظهار رسالة تحميل مبدئية
        view.grid.innerHTML = `<p class="text-center text-slate-500 dark:text-slate-400 col-span-full">جاري تحميل الأسئلة...</p>`;
        
        await model.loadQuestions(); 
        
        this.setupEventListeners();
        const isDark = localStorage.getItem('theme') === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        view.toggleTheme(isDark);
        this.updateAllViews();
    },

    // تحديث كل أجزاء الواجهة
    updateAllViews() {
        const questions = model.getFilteredQuestions();
        view.renderQuestions(questions);
        view.updateActiveFilter(model.currentFilter);
        view.renderDifficultyChart(model.getChartData());
        view.renderMasteryChart(model.getMasteryStats());
        view.updateMasteredCounter(model.getMasteredCount(), model.questions.length);
    },

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        view.filtersContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.handleFilterClick(e.target.dataset.filter);
            }
        });
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        view.grid.addEventListener('click', (e) => {
            const expandBtn = e.target.closest('.expand-btn');
            const copyBtn = e.target.closest('.copy-btn');
            const masteredBtn = e.target.closest('.mastered-star');
            const copyCodeBtn = e.target.closest('.copy-code-btn');

            if (expandBtn) this.handleExpandClick(expandBtn);
            else if (copyBtn) this.handleCopyClick(copyBtn);
            else if (masteredBtn) this.handleMasteredClick(masteredBtn);
            else if (copyCodeBtn) this.handleCopyCodeClick(copyCodeBtn);
        });
        view.theme.toggle.addEventListener('click', () => this.handleThemeToggle());
    },

    // التعامل مع ضغط أزرار الفلترة
    handleFilterClick(filterValue) {
        model.currentFilter = filterValue;
        this.updateAllViews();
    },

    // التعامل مع إدخال البحث
    handleSearchInput(term) {
        model.searchTerm = term;
        view.renderQuestions(model.getFilteredQuestions());
    },

    // التعامل مع فتح/إغلاق الإجابة
    handleExpandClick(expandButton) {
        const card = expandButton.closest('.question-card');
        if(card) view.toggleAnswer(card);
    },

    // التعامل مع نسخ السؤال
    handleCopyClick(copyButton) {
        const card = copyButton.closest('.question-card');
        const questionText = card.querySelector('.question-text').innerText;
        this.copyToClipboard(questionText, 'تم نسخ السؤال بنجاح!');
    },

    // التعامل مع نسخ الكود
    handleCopyCodeClick(copyCodeButton) {
        const pre = copyCodeButton.closest('pre');
        const code = pre.querySelector('code').innerText;
        this.copyToClipboard(code, 'تم نسخ الكود بنجاح!');
    },

    // التعامل مع تمييز سؤال كمتقن
    async handleMasteredClick(masteredButton) {
        const card = masteredButton.closest('.question-card');
        const questionId = card.dataset.questionId;
        
        await model.toggleMastered(questionId); 

        masteredButton.classList.toggle('mastered');
        card.classList.toggle('border-yellow-400');
        view.updateMasteredCounter(model.getMasteredCount(), model.questions.length);
        view.renderMasteryChart(model.getMasteryStats());
    },

    // التعامل مع تبديل الوضع
    handleThemeToggle() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        view.toggleTheme(isDark);
        this.updateAllViews(); // Re-render charts for new colors
    },

    // وظيفة النسخ إلى الحافظة
    copyToClipboard(text, message) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            view.showToast(message);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            view.showToast('فشل النسخ!');
        }
        document.body.removeChild(textArea);
    }
};

// بدء تشغيل التطبيق عند تحميل الصفحة
controller.init();
