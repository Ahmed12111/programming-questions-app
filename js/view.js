// --- VIEW ---
// مسؤول عن كل ما يتعلق بالواجهة الرسومية وتحديثها
export const view = {
    grid: document.getElementById('questions-grid'),
    filtersContainer: document.getElementById('filters'),
    paginationControls: document.getElementById('pagination-controls'),
    difficultyChartCanvas: document.getElementById('difficultyChart'),
    masteryChartCanvas: document.getElementById('masteryChart'),
    masteredCounter: document.getElementById('mastered-counter'),
    toast: document.getElementById('toast-notification'),
    theme: {
        toggle: document.getElementById('theme-toggle'),
        sunIcon: document.getElementById('theme-icon-sun'),
        moonIcon: document.getElementById('theme-icon-moon'),
    },
    difficultyStyles: {
        easy: { badge: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-700', name: 'سهل' },
        medium: { badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700', name: 'متوسط' },
        hard: { badge: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700', name: 'صعب' }
    },
    
    renderQuestions(questions) {
        this.grid.innerHTML = '';
        if (questions.length === 0) {
            this.grid.innerHTML = `<p class="text-center text-slate-500 dark:text-slate-400 col-span-full">لا توجد أسئلة تطابق بحثك.</p>`;
            return;
        }
        questions.forEach((q) => {
            const card = document.createElement('div');
            card.className = `question-card glass-card p-6 shadow-lg flex flex-col ${q.mastered ? 'border-yellow-400' : ''}`;
            card.dataset.questionId = q.id;
            const style = this.difficultyStyles[q.difficulty];
            card.innerHTML = `
                <div class="flex-grow">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="question-text text-lg font-semibold flex-1 leading-snug">${q.question}</h3>
                        <span class="text-xs font-bold px-3 py-1 rounded-full border ${style.badge} flex-shrink-0 mr-3">${style.name}</span>
                    </div>
                </div>
                <div class="answer border-t border-slate-900/10 dark:border-slate-50/10">
                    ${q.answer}
                </div>
                <div class="flex justify-between items-center mt-4 pt-2">
                   <div class="flex items-center gap-2">
                        <button class="copy-btn card-action-btn" title="نسخ السؤال" aria-label="نسخ السؤال">
                            <span class="copy-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="text-slate-500 dark:text-slate-400" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg></span>
                        </button>
                        <button class="mastered-star card-action-btn ${q.mastered ? 'mastered' : ''}" title="تمييز كمتقن" aria-label="تمييز كمتقن">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-500 dark:text-slate-400 transition-colors" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
                        </button>
                   </div>
                   <div class="expand-btn card-action-btn" title="إظهار/إخفاء الإجابة" aria-label="إظهار/إخفاء الإجابة">
                        <div class="expand-icon"><div class="expand-icon-shape"></div></div>
                   </div>
                </div>
            `;
            card.querySelectorAll('pre').forEach(pre => {
                const copyCodeBtn = document.createElement('button');
                copyCodeBtn.className = 'copy-code-btn';
                copyCodeBtn.title = 'نسخ الكود';
                copyCodeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="text-slate-500 dark:text-slate-400" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>`;
                pre.appendChild(copyCodeBtn);
            });
            this.grid.appendChild(card);
        });
    },

    renderPagination(currentPage, totalPages) {
        this.paginationControls.innerHTML = '';
        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn';
        prevButton.textContent = 'السابق';
        prevButton.dataset.page = currentPage - 1;
        prevButton.disabled = currentPage === 1;
        this.paginationControls.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-btn';
            pageButton.textContent = i;
            pageButton.dataset.page = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            this.paginationControls.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn';
        nextButton.textContent = 'التالي';
        nextButton.dataset.page = currentPage + 1;
        nextButton.disabled = currentPage === totalPages;
        this.paginationControls.appendChild(nextButton);
    },

    toggleAnswer(cardElement) {
        cardElement.classList.toggle('card-open');
        const answer = cardElement.querySelector('.answer');
        if (answer) answer.classList.toggle('visible');
    },
    updateMasteredCounter(count, total) {
        this.masteredCounter.textContent = `${count} / ${total}`;
    },
    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2500);
    },
    updateActiveFilter(filterValue) {
        this.filtersContainer.querySelectorAll('.btn-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filterValue);
        });
    },
    renderDifficultyChart(chartData) {
        const chartInstance = Chart.getChart(this.difficultyChartCanvas);
        if (chartInstance) chartInstance.destroy();
        new Chart(this.difficultyChartCanvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['سهل', 'متوسط', 'صعب'],
                datasets: [{
                    data: [chartData.easy, chartData.medium, chartData.hard],
                    backgroundColor: ['#5eead4', '#fcd34d', '#fda4af'],
                    borderColor: [document.documentElement.classList.contains('dark') ? '#0f172a' : '#f5f5f4'],
                    borderWidth: 8, hoverOffset: 15,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        titleFont: { family: "'Tajawal', sans-serif" }, bodyFont: { family: "'Tajawal', sans-serif" },
                        callbacks: { label: (c) => `${c.label}: ${c.parsed} أسئلة` },
                        backgroundColor: '#0f172a', titleColor: '#f1f5f9',
                        bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8, boxPadding: 4
                    }
                }
            }
        });
    },
    renderMasteryChart(stats) {
        const chartInstance = Chart.getChart(this.masteryChartCanvas);
        if (chartInstance) chartInstance.destroy();
        
        const labels = ['سهل', 'متوسط', 'صعب'];
        const masteryPercentage = labels.map(label => {
            const key = label === 'سهل' ? 'easy' : label === 'متوسط' ? 'medium' : 'hard';
            return stats[key].total > 0 ? (stats[key].mastered / stats[key].total) * 100 : 0;
        });
        const isDark = document.documentElement.classList.contains('dark');

        new Chart(this.masteryChartCanvas.getContext('2d'), {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'نسبة الإتقان',
                    data: masteryPercentage,
                    backgroundColor: 'rgba(5, 150, 105, 0.2)',
                    borderColor: 'var(--accent-color)',
                    borderWidth: 2,
                    pointBackgroundColor: 'var(--accent-color)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'var(--accent-color)'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: isDark ? '#334155' : '#e4e4e7' },
                        grid: { color: isDark ? '#334155' : '#e4e4e7' },
                        pointLabels: { color: isDark ? '#e2e8f0' : '#27272a', font: { family: "'Tajawal', sans-serif", size: 14 } },
                        ticks: {
                            backdropColor: 'transparent',
                            color: isDark ? '#94a3b8' : '#71717a',
                            stepSize: 25,
                            callback: value => value + '%'
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        titleFont: { family: "'Tajawal', sans-serif" }, bodyFont: { family: "'Tajawal', sans-serif" },
                        callbacks: { label: (c) => `${c.label}: ${c.raw.toFixed(1)}%` },
                        backgroundColor: '#0f172a', titleColor: '#f1f5f9',
                        bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8, boxPadding: 4
                    }
                }
            }
        });
    },
    toggleTheme(isDark) {
         this.theme.sunIcon.classList.toggle('hidden', isDark);
         this.theme.moonIcon.classList.toggle('hidden', !isDark);
    }
};
