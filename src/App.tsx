import { useState } from 'react';
import { ExamInfo } from './components/ExamInfo';
import { QuestionEditor } from './components/QuestionEditor';
import { ExamPreview } from './components/ExamPreview';
import { Question, ExamData } from './types';
import { generatePDF, generateWord } from './utils/exportUtils';

function App() {
  const [examData, setExamData] = useState<ExamData>({
    studentName: '',
    fatherName: '',
    courseName: '',
    grade: '',
    date: '',
    examSession: '',
    educationOffice: '',
    schoolName: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'preview'>('info');
  const [exportLoading, setExportLoading] = useState<'pdf' | 'word' | null>(null);

  const handleExportPDF = async () => {
    setExportLoading('pdf');
    try {
      await generatePDF(examData, questions);
    } catch (e) {
      alert('خطا در تولید PDF. لطفاً دوباره تلاش کنید.');
    }
    setExportLoading(null);
  };

  const handleExportWord = async () => {
    setExportLoading('word');
    try {
      await generateWord(examData, questions);
    } catch (e) {
      alert('خطا در تولید فایل Word. لطفاً دوباره تلاش کنید.');
    }
    setExportLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">📝 طراحی آزمون</h1>
              <p className="text-blue-100 text-sm mt-0.5">سیستم جامع طراحی و چاپ آزمون - نیکزاد فرد</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {questions.length > 0 && (
                <>
                  <button
                    onClick={handleExportPDF}
                    disabled={exportLoading !== null}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 px-4 py-2 rounded-lg transition-all shadow-lg text-sm font-bold"
                  >
                    <span>📄</span>
                    <span>{exportLoading === 'pdf' ? 'در حال ساخت...' : 'خروجی PDF'}</span>
                  </button>
                  <button
                    onClick={handleExportWord}
                    disabled={exportLoading !== null}
                    className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 disabled:opacity-60 px-4 py-2 rounded-lg transition-all shadow-lg text-sm font-bold"
                  >
                    <span>📑</span>
                    <span>{exportLoading === 'word' ? 'در حال ساخت...' : 'خروجی Word'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { key: 'info', label: 'مشخصات آزمون', icon: '📋' },
              { key: 'questions', label: 'طراحی سوالات', icon: '❓' },
              { key: 'preview', label: 'پیش‌نمایش', icon: '👁️' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-5 py-4 font-medium transition-all text-sm ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.key === 'questions' && questions.length > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {questions.length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'info' && (
          <ExamInfo examData={examData} setExamData={setExamData} onNext={() => setActiveTab('questions')} />
        )}
        {activeTab === 'questions' && (
          <QuestionEditor questions={questions} setQuestions={setQuestions} />
        )}
        {activeTab === 'preview' && (
          <ExamPreview examData={examData} questions={questions} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">طراحی و توسعه توسط</p>
          <p className="text-xl font-bold text-blue-400 mt-1">نیکزاد فرد</p>
          <p className="text-gray-500 text-sm mt-2">© تمامی حقوق محفوظ است ۱۴۰۳</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
