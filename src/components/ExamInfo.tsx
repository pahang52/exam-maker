import { ExamData } from '../types';

interface ExamInfoProps {
  examData: ExamData;
  setExamData: React.Dispatch<React.SetStateAction<ExamData>>;
  onNext: () => void;
}

export function ExamInfo({ examData, setExamData, onNext }: ExamInfoProps) {
  const handleChange = (field: keyof ExamData, value: string) => {
    setExamData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-l from-blue-500 to-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📋</span>
            مشخصات آزمون
          </h2>
          <p className="text-blue-100 mt-1">اطلاعات مورد نیاز را وارد کنید</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">نام و نام خانوادگی</label>
              <input
                type="text"
                value={examData.studentName}
                onChange={e => handleChange('studentName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="نام و نام خانوادگی دانش‌آموز"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">نام پدر</label>
              <input
                type="text"
                value={examData.fatherName}
                onChange={e => handleChange('fatherName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="نام پدر دانش‌آموز"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">نام درس</label>
              <input
                type="text"
                value={examData.courseName}
                onChange={e => handleChange('courseName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="نام درس"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">پایه تحصیلی</label>
              <select
                value={examData.grade}
                onChange={e => handleChange('grade', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
              >
                <option value="">انتخاب پایه...</option>
                <option value="پایه هفتم">پایه هفتم</option>
                <option value="پایه هشتم">پایه هشتم</option>
                <option value="پایه نهم">پایه نهم</option>
                <option value="پایه دهم">پایه دهم</option>
                <option value="پایه یازدهم">پایه یازدهم</option>
                <option value="پایه دوازدهم">پایه دوازدهم</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">تاریخ برگزاری</label>
              <input
                type="text"
                value={examData.date}
                onChange={e => handleChange('date', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="مثال: ۱۴۰۳/۰۹/۱۵"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">نوبت امتحانی</label>
              <select
                value={examData.examSession}
                onChange={e => handleChange('examSession', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
              >
                <option value="">انتخاب نوبت...</option>
                <option value="نوبت اول">نوبت اول</option>
                <option value="نوبت دوم">نوبت دوم</option>
                <option value="ماهانه اول">ماهانه اول</option>
                <option value="ماهانه دوم">ماهانه دوم</option>
                <option value="ماهانه سوم">ماهانه سوم</option>
                <option value="ترم اول">ترم اول</option>
                <option value="ترم دوم">ترم دوم</option>
                <option value="پایان سال">پایان سال</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">اداره آموزش و پرورش</label>
              <input
                type="text"
                value={examData.educationOffice}
                onChange={e => handleChange('educationOffice', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="نام اداره آموزش و پرورش"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">نام دبیرستان</label>
              <input
                type="text"
                value={examData.schoolName}
                onChange={e => handleChange('schoolName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="نام دبیرستان"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-l from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
            >
              <span>مرحله بعد</span>
              <span>←</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
