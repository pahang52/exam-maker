export interface ExamData {
  studentName: string;
  fatherName: string;
  courseName: string;
  grade: string;
  date: string;
  examSession: string;
  educationOffice: string;
  schoolName: string;
}

export type QuestionType = 'true-false' | 'fill-blank' | 'short-answer' | 'multiple-choice' | 'matching' | 'descriptive';

export interface TrueFalseQuestion {
  type: 'true-false';
  id: string;
  question: string;
  answer: boolean | null;
  points: number;
}

export interface FillBlankQuestion {
  type: 'fill-blank';
  id: string;
  question: string;
  blanks: string[];
  points: number;
}

export interface ShortAnswerQuestion {
  type: 'short-answer';
  id: string;
  question: string;
  answer: string;
  points: number;
}

export interface MultipleChoiceQuestion {
  type: 'multiple-choice';
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface MatchingQuestion {
  type: 'matching';
  id: string;
  question: string;
  leftItems: string[];
  rightItems: string[];
  correctMatches: number[];
  points: number;
}

export interface DescriptiveQuestion {
  type: 'descriptive';
  id: string;
  question: string;
  answer: string;
  points: number;
  lines: number;
}

export type Question = 
  | TrueFalseQuestion 
  | FillBlankQuestion 
  | ShortAnswerQuestion 
  | MultipleChoiceQuestion 
  | MatchingQuestion 
  | DescriptiveQuestion;

export const questionTypeLabels: Record<QuestionType, string> = {
  'true-false': 'صحیح و غلط',
  'fill-blank': 'جای خالی',
  'short-answer': 'جواب کوتاه',
  'multiple-choice': 'تستی',
  'matching': 'جور کردنی',
  'descriptive': 'تشریحی',
};

export const questionTypeIcons: Record<QuestionType, string> = {
  'true-false': '✓✗',
  'fill-blank': '📝',
  'short-answer': '💬',
  'multiple-choice': '🔘',
  'matching': '🔗',
  'descriptive': '📋',
};

export const grades = [
  'پایه هفتم',
  'پایه هشتم',
  'پایه نهم',
  'پایه دهم',
  'پایه یازدهم',
  'پایه دوازدهم',
];

export const examSessions = [
  'نوبت اول',
  'نوبت دوم',
  'ماهانه اول',
  'ماهانه دوم',
  'ماهانه سوم',
  'ترم اول',
  'ترم دوم',
  'پایان سال',
];

// لیست بارم‌های قابل انتخاب از 0.25 تا 10
export const pointOptions: number[] = [];
for (let i = 0.25; i <= 10; i += 0.25) {
  pointOptions.push(Math.round(i * 100) / 100);
}
