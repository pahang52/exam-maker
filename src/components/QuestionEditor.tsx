import { useState } from 'react';
import { Question, QuestionType, questionTypeLabels, questionTypeIcons } from '../types';

interface QuestionEditorProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

export function QuestionEditor({ questions, setQuestions }: QuestionEditorProps) {
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);

  const questionTypes: QuestionType[] = [
    'true-false',
    'fill-blank',
    'short-answer',
    'multiple-choice',
    'matching',
    'descriptive',
  ];

  const addQuestion = (question: Question) => {
    setQuestions(prev => [...prev, question]);
    setSelectedType(null);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;
    
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel for adding questions */}
        <div className="lg:col-span-2">
          {!selectedType ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-l from-green-500 to-emerald-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">➕</span>
                  افزودن سوال جدید
                </h2>
                <p className="text-green-100 mt-1">نوع سوال را انتخاب کنید</p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {questionTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-xl transition-all hover:shadow-lg group"
                    >
                      <span className="text-4xl group-hover:scale-110 transition-transform">
                        {questionTypeIcons[type]}
                      </span>
                      <span className="font-bold text-gray-700 group-hover:text-blue-600">
                        {questionTypeLabels[type]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <QuestionForm
              type={selectedType}
              onAdd={addQuestion}
              onCancel={() => setSelectedType(null)}
            />
          )}
        </div>

        {/* Questions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
            <div className="bg-gradient-to-l from-purple-500 to-violet-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📚</span>
                لیست سوالات
              </h3>
              <p className="text-purple-100 text-sm mt-1">
                تعداد سوالات: {questions.length}
              </p>
            </div>

            <div className="p-4 max-h-[500px] overflow-y-auto">
              {questions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  هنوز سوالی اضافه نشده است
                </p>
              ) : (
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {question.question || 'سوال بدون متن'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {questionTypeLabels[question.type]} | نمره: {question.points}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === questions.length - 1}
                          className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Question Form Component
interface QuestionFormProps {
  type: QuestionType;
  onAdd: (question: Question) => void;
  onCancel: () => void;
}

function QuestionForm({ type, onAdd, onCancel }: QuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [points, setPoints] = useState(1);

  // For true/false
  const [answer, setAnswer] = useState<boolean | null>(null);

  // For fill blank
  const [blanks, setBlanks] = useState<string[]>(['']);

  // For short answer
  const [shortAnswer, setShortAnswer] = useState('');

  // For multiple choice
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);

  // For matching
  const [leftItems, setLeftItems] = useState<string[]>(['', '']);
  const [rightItems, setRightItems] = useState<string[]>(['', '']);

  // For descriptive
  const [descriptiveAnswer, setDescriptiveAnswer] = useState('');
  const [lines, setLines] = useState(5);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = () => {
    if (!question.trim()) return;

    let newQuestion: Question;

    switch (type) {
      case 'true-false':
        newQuestion = {
          type: 'true-false',
          id: generateId(),
          question,
          answer,
          points,
        };
        break;
      case 'fill-blank':
        newQuestion = {
          type: 'fill-blank',
          id: generateId(),
          question,
          blanks: blanks.filter(b => b.trim()),
          points,
        };
        break;
      case 'short-answer':
        newQuestion = {
          type: 'short-answer',
          id: generateId(),
          question,
          answer: shortAnswer,
          points,
        };
        break;
      case 'multiple-choice':
        newQuestion = {
          type: 'multiple-choice',
          id: generateId(),
          question,
          options: options.filter(o => o.trim()),
          correctAnswer: correctOption,
          points,
        };
        break;
      case 'matching':
        newQuestion = {
          type: 'matching',
          id: generateId(),
          question,
          leftItems: leftItems.filter(l => l.trim()),
          rightItems: rightItems.filter(r => r.trim()),
          correctMatches: leftItems.map((_, i) => i),
          points,
        };
        break;
      case 'descriptive':
        newQuestion = {
          type: 'descriptive',
          id: generateId(),
          question,
          answer: descriptiveAnswer,
          points,
          lines,
        };
        break;
    }

    onAdd(newQuestion);
  };

  const renderForm = () => {
    switch (type) {
      case 'true-false':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAnswer(true)}
                className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                  answer === true
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                }`}
              >
                ✓ صحیح
              </button>
              <button
                type="button"
                onClick={() => setAnswer(false)}
                className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                  answer === false
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                }`}
              >
                ✗ غلط
              </button>
            </div>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              از علامت ______ برای نشان دادن جای خالی استفاده کنید
            </p>
            <div>
              <label className="block text-gray-700 font-medium mb-2">پاسخ‌ها:</label>
              {blanks.map((blank, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={blank}
                    onChange={e => {
                      const newBlanks = [...blanks];
                      newBlanks[index] = e.target.value;
                      setBlanks(newBlanks);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder={`پاسخ ${index + 1}`}
                  />
                  {blanks.length > 1 && (
                    <button
                      onClick={() => setBlanks(blanks.filter((_, i) => i !== index))}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setBlanks([...blanks, ''])}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + افزودن پاسخ دیگر
              </button>
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">پاسخ کوتاه:</label>
              <input
                type="text"
                value={shortAnswer}
                onChange={e => setShortAnswer(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                placeholder="پاسخ کوتاه سوال"
              />
            </div>
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(index)}
                    className={`w-10 h-10 rounded-full font-bold transition-all ${
                      correctOption === index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {['الف', 'ب', 'ج', 'د', 'ه', 'و'][index]}
                  </button>
                  <input
                    type="text"
                    value={option}
                    onChange={e => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder={`گزینه ${['الف', 'ب', 'ج', 'د', 'ه', 'و'][index]}`}
                  />
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button
                onClick={() => setOptions([...options, ''])}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + افزودن گزینه دیگر
              </button>
            )}
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">ستون الف:</label>
                {leftItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const newItems = [...leftItems];
                        newItems[index] = e.target.value;
                        setLeftItems(newItems);
                      }}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">ستون ب:</label>
                {rightItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-sm font-bold">
                      {['الف', 'ب', 'ج', 'د', 'ه'][index]}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const newItems = [...rightItems];
                        newItems[index] = e.target.value;
                        setRightItems(newItems);
                      }}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            {leftItems.length < 5 && (
              <button
                onClick={() => {
                  setLeftItems([...leftItems, '']);
                  setRightItems([...rightItems, '']);
                }}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + افزودن ردیف دیگر
              </button>
            )}
          </div>
        );

      case 'descriptive':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">پاسخ تشریحی (راهنما):</label>
              <textarea
                value={descriptiveAnswer}
                onChange={e => setDescriptiveAnswer(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none min-h-[100px]"
                placeholder="پاسخ کامل سوال (برای راهنمای تصحیح)"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                تعداد خطوط پاسخ: {lines}
              </label>
              <input
                type="range"
                min="3"
                max="20"
                value={lines}
                onChange={e => setLines(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-l from-blue-500 to-indigo-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">{questionTypeIcons[type]}</span>
          سوال {questionTypeLabels[type]}
        </h2>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">متن سوال:</label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none min-h-[100px]"
            placeholder="متن سوال را وارد کنید..."
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">نمره:</label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={points}
            onChange={e => setPoints(Number(e.target.value))}
            className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>

        {renderForm()}

        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            disabled={!question.trim()}
            className="flex-1 py-3 bg-gradient-to-l from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            افزودن سوال
          </button>
        </div>
      </div>
    </div>
  );
}
