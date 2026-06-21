import { ExamData, Question, questionTypeLabels } from '../types';

interface ExamPreviewProps {
  examData: ExamData;
  questions: Question[];
}

export function ExamPreview({ examData, questions }: ExamPreviewProps) {
  const getTotalPoints = () => questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-l from-amber-500 to-orange-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">👁️</span>
            پیش‌نمایش آزمون
          </h2>
        </div>

        {questions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-xl">هنوز سوالی طراحی نشده است</p>
            <p className="text-gray-300 mt-2">به بخش طراحی سوالات بروید و سوالات را اضافه کنید</p>
          </div>
        ) : (
          <div className="p-8" id="exam-content">
            <div className="border-4 border-gray-800 p-6 mb-8">
              <div className="text-center border-b-2 border-gray-400 pb-4 mb-4">
                <h1 className="text-xl font-bold">اداره آموزش و پرورش {examData.educationOffice}</h1>
                <h2 className="text-lg font-bold mt-1">دبیرستان {examData.schoolName}</h2>
                <h3 className="text-2xl font-bold mt-3 text-blue-600">آزمون {examData.courseName}</h3>
                <p className="text-gray-600 mt-1">{examData.examSession}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="border-b-2 border-gray-400 pb-2">
                  <p className="text-gray-600 text-sm">پایه:</p>
                  <p className="font-bold">{examData.grade}</p>
                </div>
                <div className="border-b-2 border-gray-400 pb-2">
                  <p className="text-gray-600 text-sm">تاریخ:</p>
                  <p className="font-bold">{examData.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="border-b-2 border-gray-400 pb-2 col-span-2">
                  <p className="text-gray-600 text-sm">نام و نام خانوادگی: {examData.studentName || '.................................'}</p>
                </div>
                <div className="border-b-2 border-gray-400 pb-2">
                  <p className="text-gray-600 text-sm">نام پدر: {examData.fatherName || '.................'}</p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="font-bold text-lg">نمره کل: {getTotalPoints()} نمره</span>
              </div>
            </div>

            {renderQuestionsByType(questions)}

            <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
              <p className="text-gray-500 text-sm">طراحی شده توسط: نیکزاد فرد</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderQuestionsByType(questions: Question[]) {
  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const order = ['true-false', 'fill-blank', 'short-answer', 'multiple-choice', 'matching', 'descriptive'];
  let questionNumber = 1;

  return order.map(type => {
    const typeQuestions = grouped[type];
    if (!typeQuestions || typeQuestions.length === 0) return null;

    const typePoints = typeQuestions.reduce((s, q) => s + q.points, 0);

    return (
      <div key={type} className="mb-8">
        <div className="bg-blue-50 border-r-4 border-blue-500 px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
          <span className="text-xl">{getTypeIcon(type)}</span>
          <h3 className="font-bold text-gray-700">
            سوالات {questionTypeLabels[type as keyof typeof questionTypeLabels]}
          </h3>
          <span className="text-gray-500 text-sm mr-2">
            ({typeQuestions.length} سوال - {typePoints} نمره)
          </span>
        </div>

        <div className="space-y-6 pr-4">
          {typeQuestions.map((q, idx) => (
            <div key={q.id} className="flex gap-3">
              <span className="font-bold text-blue-600 min-w-[30px]">
                {questionNumber + idx}-
              </span>
              <div className="flex-1">
                {renderQuestion(q)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-b border-gray-200 my-4"></div>
        {(questionNumber += typeQuestions.length)}
      </div>
    );
  });
}

function getTypeIcon(type: string) {
  const icons: Record<string, string> = {
    'true-false': '✓✗',
    'fill-blank': '📝',
    'short-answer': '💬',
    'multiple-choice': '🔘',
    'matching': '🔗',
    'descriptive': '📋',
  };
  return icons[type] || '❓';
}

function renderQuestion(question: Question) {
  switch (question.type) {
    case 'true-false':
      return (
        <div>
          <p className="font-medium">{question.question}</p>
          <div className="flex gap-6 mt-2">
            <span className="text-gray-600">(   ) صحیح</span>
            <span className="text-gray-600">(   ) غلط</span>
          </div>
        </div>
      );

    case 'fill-blank':
      return (
        <div>
          <p className="font-medium whitespace-pre-wrap">{question.question}</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            {question.blanks.map((_, i) => (
              <div key={i} className="border-b-2 border-gray-400 w-24 mx-2"></div>
            ))}
          </div>
        </div>
      );

    case 'short-answer':
      return (
        <div>
          <p className="font-medium">{question.question}</p>
          <div className="mt-3 border-b-2 border-gray-400 w-full"></div>
          <div className="mt-2 border-b-2 border-gray-400 w-3/4"></div>
        </div>
      );

    case 'multiple-choice':
      return (
        <div>
          <p className="font-medium">{question.question}</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3">
            {question.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <span className="font-bold text-gray-600">
                  {['الف', 'ب', 'ج', 'د', 'ه', 'و'][i]})
                </span>
                <span>{opt}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'matching':
      return (
        <div>
          <p className="font-medium mb-4">{question.question}</p>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="font-bold text-sm text-gray-600 border-b pb-1">ستون الف</p>
              {question.leftItems.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="w-6 h-6 bg-gray-200 rounded text-center text-sm">{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="font-bold text-sm text-gray-600 border-b pb-1">ستون ب</p>
              {question.rightItems.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="w-6 h-6 bg-gray-200 rounded text-center text-sm">
                    {['الف', 'ب', 'ج', 'د', 'ه'][i]}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'descriptive':
      return (
        <div>
          <p className="font-medium">{question.question}</p>
          <div className="mt-4 space-y-3">
            {Array.from({ length: question.lines }).map((_, i) => (
              <div key={i} className="border-b border-gray-300 h-6"></div>
            ))}
          </div>
        </div>
      );
  }
}
