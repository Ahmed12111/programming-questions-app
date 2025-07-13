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
    questions: [],
    
    // تحميل الأسئلة من Firestore
    async loadQuestions() {
        try {
            const snapshot = await db.collection('questions').get();
            this.questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error loading questions from Firebase:", error);
            // يمكنك هنا عرض رسالة خطأ للمستخدم
            this.questions = []; // إفراغ الأسئلة في حالة حدوث خطأ
        }
    },

    // فلترة الأسئلة
    getFilteredQuestions() {
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

    // الحصول على بيانات مخطط التوزيع
    getChartData() {
        return {
            easy: this.questions.filter(q => q.difficulty === 'easy').length,
            medium: this.questions.filter(q => q.difficulty === 'medium').length,
            hard: this.questions.filter(q => q.difficulty === 'hard').length,
        }
    },

    // الحصول على إحصائيات الإتقان
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

    // تغيير حالة الإتقان في Firestore
    async toggleMastered(id) {
        const questionRef = db.collection('questions').doc(id);
        const question = this.questions.find(q => q.id === id);
        if (question) {
            const newMasteredState = !question.mastered;
            try {
                await questionRef.update({ mastered: newMasteredState });
                // تحديث الحالة محليًا لتجنب إعادة تحميل كل البيانات
                question.mastered = newMasteredState;
            } catch (error) {
                console.error("Error updating mastery state:", error);
            }
        }
    },

    // الحصول على عدد الأسئلة المتقنة
    getMasteredCount() {
        return this.questions.filter(q => q.mastered).length;
    }
};
