// --- MODEL ---
// مسؤول عن كل ما يتعلق بالبيانات والتعامل مع Firestore

// !! هام جدًا: استبدل هذا الكائن بمعلومات مشروعك الحقيقية من Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVTr26WP9CllJ--o_DovsXik-vJTXIwZI",
    authDomain: "programming-questions-app.firebaseapp.com",
    projectId: "programming-questions-app",
    storageBucket: "programming-questions-app.firebasestorage.app",
    messagingSenderId: "811853082874",
    appId: "1:811853082874:web:439bd481db70e92f79d943",
    measurementId: "G-2MS42KRMLN"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // تهيئة Firestore

export const model = {
    currentFilter: 'all',
    searchTerm: '',
    currentPage: 1,
    itemsPerPage: 12,
    questions: [],
    
    // تحميل الأسئلة من Firestore
    async loadQuestions() {
        try {
            // استعادة حالة الإتقان من الذاكرة المحلية
            const masteredState = JSON.parse(localStorage.getItem('masteredQuestions')) || {};
            
            const snapshot = await db.collection('questions').get();
            this.questions = snapshot.docs.map(doc => {
                const questionData = doc.data();
                return { 
                    id: doc.id, 
                    ...questionData,
                    // دمج حالة الإتقان المحفوظة
                    mastered: masteredState[doc.id] || false 
                };
            });
        } catch (error) {
            console.error("Error loading questions from Firebase:", error);
            this.questions = [];
        }
    },

    // حفظ حالة الإتقان في الذاكرة المحلية
    saveMasteryState() {
        const masteredState = {};
        this.questions.forEach(q => {
            if (q.mastered) {
                masteredState[q.id] = true;
            }
        });
        localStorage.setItem('masteredQuestions', JSON.stringify(masteredState));
    },

    _getFilteredAndSearchedQuestions() {
        let questions = this.questions;
        if (this.currentFilter !== 'all') {
             questions = questions.filter(q => q.difficulty === this.currentFilter);
        }
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            questions = questions.filter(q => 
                q.question.toLowerCase().includes(term) || 
                q.answer.toLowerCase().includes(term)
            );
        }
        return questions;
    },

    getPaginatedQuestions() {
        const filteredQuestions = this._getFilteredAndSearchedQuestions();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return filteredQuestions.slice(startIndex, endIndex);
    },

    getTotalPages() {
        const totalQuestions = this._getFilteredAndSearchedQuestions().length;
        return Math.ceil(totalQuestions / this.itemsPerPage);
    },

    getChartData() {
        return {
            easy: this.questions.filter(q => q.difficulty === 'easy').length,
            medium: this.questions.filter(q => q.difficulty === 'medium').length,
            hard: this.questions.filter(q => q.difficulty === 'hard').length,
        }
    },

    getMasteryStats() {
        const stats = {
            easy: { mastered: 0, total: 0 },
            medium: { mastered: 0, total: 0 },
            hard: { mastered: 0, total: 0 },
        };
        this.questions.forEach(q => {
            if (stats[q.difficulty]) {
                stats[q.difficulty].total++;
                if (q.mastered) {
                    stats[q.difficulty].mastered++;
                }
            }
        });
        return stats;
    },

    toggleMastered(id) {
        const question = this.questions.find(q => q.id === id);
        if (question) {
            question.mastered = !question.mastered;
            this.saveMasteryState(); // حفظ الحالة الجديدة في الذاكرة المحلية
        }
    },

    getMasteredCount() {
        return this.questions.filter(q => q.mastered).length;
    }
};
