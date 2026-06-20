import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { ExamData, Question, questionTypeLabels } from '../types';

function toPersianNumbers(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, d => persianDigits[parseInt(d)]);
}

export async function generatePDF(examData: ExamData, questions: Question[]): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  pdf.setFont('helvetica');
  
  let yPosition = 20;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.rect(margin, yPosition, contentWidth, 60);

  pdf.setFontSize(14);
  pdf.text(`Education Office: ${examData.educationOffice}`, pageWidth / 2, yPosition + 12, { align: 'center' });
  pdf.text(`High School: ${examData.schoolName}`, pageWidth / 2, yPosition + 22, { align: 'center' });
  
  pdf.setFontSize(18);
  pdf.text(`Exam: ${examData.courseName}`, pageWidth / 2, yPosition + 35, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Session: ${examData.examSession}`, pageWidth / 2, yPosition + 45, { align: 'center' });
  pdf.text(`Date: ${examData.date} | Grade: ${examData.grade}`, pageWidth / 2, yPosition + 55, { align: 'center' });

  yPosition += 70;

  pdf.setFontSize(10);
  pdf.text('Name: _________________ Father\'s Name: _________________', margin, yPosition);
  yPosition += 15;

  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const order = ['true-false', 'fill-blank', 'short-answer', 'multiple-choice', 'matching', 'descriptive'];
  let questionNumber = 1;
  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  pdf.text(`Total Points: ${totalPoints}`, margin, yPosition);
  yPosition += 10;

  for (const type of order) {
    const typeQuestions = grouped[type];
    if (!typeQuestions || typeQuestions.length === 0) continue;

    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');
    pdf.setFontSize(11);
    pdf.text(
      `${questionTypeLabels[type as keyof typeof questionTypeLabels]} (${typeQuestions.length} questions)`,
      margin + 2,
      yPosition + 6
    );
    yPosition += 12;

    for (const q of typeQuestions) {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(10);
      const questionText = `${questionNumber}. ${q.question}`;
      const lines = pdf.splitTextToSize(questionText, contentWidth - 10);
      pdf.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 5 + 3;

      if (q.type === 'true-false') {
        pdf.text('(   ) True    (   ) False', margin + 10, yPosition);
        yPosition += 5;
      } else if (q.type === 'multiple-choice') {
        q.options.forEach((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          pdf.text(`${letter}) ${opt}`, margin + 10, yPosition);
          yPosition += 5;
        });
      } else if (q.type === 'matching') {
        pdf.text('Column A:', margin + 10, yPosition);
        yPosition += 5;
        q.leftItems.forEach((item, i) => {
          pdf.text(`${i + 1}. ${item}`, margin + 15, yPosition);
          yPosition += 5;
        });
        pdf.text('Column B:', margin + 10, yPosition);
        yPosition += 5;
        q.rightItems.forEach((item, i) => {
          const letter = String.fromCharCode(65 + i);
          pdf.text(`${letter}. ${item}`, margin + 15, yPosition);
          yPosition += 5;
        });
      } else if (q.type === 'descriptive') {
        for (let i = 0; i < Math.min(q.lines, 5); i++) {
          pdf.line(margin + 5, yPosition, margin + contentWidth - 5, yPosition);
          yPosition += 6;
        }
      } else {
        pdf.line(margin + 5, yPosition, margin + contentWidth - 5, yPosition);
        yPosition += 6;
      }

      yPosition += 5;
      questionNumber++;
    }
    yPosition += 5;
  }

  pdf.setFontSize(8);
  pdf.text('Designed by: Nikzad Fard', pageWidth / 2, 285, { align: 'center' });
  pdf.save(`exam-${examData.courseName}-${examData.date}.pdf`);
}

export async function generateWord(examData: ExamData, questions: Question[]): Promise<void> {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `اداره آموزش و پرورش ${examData.educationOffice}`, bold: true, size: 28, rightToLeft: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `دبیرستان ${examData.schoolName}`, bold: true, size: 24, rightToLeft: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [new TextRun({ text: `آزمون ${examData.courseName}`, bold: true, size: 32, rightToLeft: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: examData.examSession, size: 24, rightToLeft: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [new TextRun({ text: `تاریخ: ${examData.date}  |  پایه: ${examData.grade}`, size: 22, rightToLeft: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: 'نام: _________________  نام پدر: _________________', size: 22, rightToLeft: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: `نمره کل: ${questions.reduce((s, q) => s + q.points, 0)} نمره`, bold: true, size: 22, rightToLeft: true })],
    })
  );

  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const order = ['true-false', 'fill-blank', 'short-answer', 'multiple-choice', 'matching', 'descriptive'];
  let questionNumber = 1;

  for (const type of order) {
    const typeQuestions = grouped[type];
    if (!typeQuestions || typeQuestions.length === 0) continue;

    children.push(
      new Paragraph({
        shading: { fill: 'E0E0E0' },
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `سوالات ${questionTypeLabels[type as keyof typeof questionTypeLabels]} (${typeQuestions.length} سوال)`,
            bold: true,
            size: 24,
            rightToLeft: true,
          }),
        ],
      })
    );

    for (const q of typeQuestions) {
      children.push(
        new Paragraph({
          spacing: { before: 150 },
          children: [
            new TextRun({
              text: `${questionNumber}. ${q.question}`,
              size: 22,
              rightToLeft: true,
            }),
          ],
        })
      );

      if (q.type === 'true-false') {
        children.push(
          new Paragraph({
            indent: { right: 500 },
            children: [new TextRun({ text: '(   ) صحیح         (   ) غلط', size: 22, rightToLeft: true })],
          })
        );
      } else if (q.type === 'multiple-choice') {
        q.options.forEach((opt, i) => {
          const letters = ['الف', 'ب', 'ج', 'د', 'ه', 'و'];
          children.push(
            new Paragraph({
              indent: { right: 500 },
              children: [new TextRun({ text: `${letters[i]}) ${opt}`, size: 22, rightToLeft: true })],
            })
          );
        });
      } else if (q.type === 'matching') {
        children.push(
          new Paragraph({
            indent: { right: 500 },
            children: [new TextRun({ text: 'ستون الف:', bold: true, size: 22, rightToLeft: true })],
          })
        );
        q.leftItems.forEach((item, i) => {
          children.push(
            new Paragraph({
              indent: { right: 700 },
              children: [new TextRun({ text: `${toPersianNumbers(i + 1)}. ${item}`, size: 22, rightToLeft: true })],
            })
          );
        });
        children.push(
          new Paragraph({
            indent: { right: 500 },
            children: [new TextRun({ text: 'ستون ب:', bold: true, size: 22, rightToLeft: true })],
          })
        );
        q.rightItems.forEach((item, i) => {
          const letters = ['الف', 'ب', 'ج', 'د', 'ه'];
          children.push(
            new Paragraph({
              indent: { right: 700 },
              children: [new TextRun({ text: `${letters[i]}. ${item}`, size: 22, rightToLeft: true })],
            })
          );
        });
      } else if (q.type === 'descriptive') {
        for (let i = 0; i < q.lines; i++) {
          children.push(
            new Paragraph({
              spacing: { before: 150 },
              border: {
                bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
              },
              children: [new TextRun({ text: '' })],
            })
          );
        }
      } else {
        for (let i = 0; i < 2; i++) {
          children.push(
            new Paragraph({
              spacing: { before: 150 },
              border: {
                bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
              },
              children: [new TextRun({ text: '' })],
            })
          );
        }
      }
      questionNumber++;
    }
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: 'طراحی شده توسط: نیکزاد فرد',
          size: 18,
          rightToLeft: true,
          italics: true,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `exam-${examData.courseName}-${examData.date}.docx`);
    }
