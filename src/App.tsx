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

  const handleExportPDF = async () => {
    await generatePDF(examData, questions);
  };

  const handleExportWord = async () => {
    await generateWord(examData, questions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">📝 طراحی آزمون</h1>
              <p className="text-blue-100 mt-1">سیستم جامع طراحی و چاپ آزمون</p>
            </div>
            <div className="flex gap-3">
              {questions.length > 0 && (
                <>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>📄</span>
                    <span>خروجی PDF</span>
                  </button>
                  <button
                    onClick={handleExportWord}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>📑</span>
                    <span>خروجی Word</span>
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
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📋</span>
                <span>مشخصات آزمون</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'questions'
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>❓</span>
                <span>طراحی سوالات</span>
                {questions.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {questions.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>👁️</span>
                <span>پیش‌نمایش</span>
              </span>
            </button>
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
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">طراحی و توسعه توسط</p>
          <p className="text-xl font-bold text-blue-400 mt-1">نیکزاد فرد</p>
          <p className="text-gray-500 text-sm mt-2">© تمامی حقوق محفوظ است</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
