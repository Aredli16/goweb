import path from "node:path";
import * as fs from "node:fs";

interface Question {
  id: number;
  question: string;
  options: { id: string; label: string }[];
  next?: Record<string, number | string>;
}

interface Diagnostic {
  id: string;
  title: string;
  description: string;
  price: string;
  includes: string[];
}

interface Quiz {
  questions: Question[];
  diagnostics: Diagnostic[];
}

interface StepResponseQuestion {
  type: "question";
  data: Question;
}

interface StepResponseDiagnostic {
  type: "diagnostic";
  data: Diagnostic;
}

type StepResponse = StepResponseQuestion | StepResponseDiagnostic;

function loadQuiz(): Quiz {
  const filePath = path.join(__dirname, "../data/questions.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function getFirstQuestion() {
  const quiz = loadQuiz();
  return quiz.questions[0];
}

export function getNextQuestion(
  currentQuestionId: number,
  answerId: string,
): StepResponse | null {
  const quiz = loadQuiz();
  const current = quiz.questions.find((q) => q.id === currentQuestionId);

  if (!current) return null;

  const nextId = current.next?.[answerId];
  if (!nextId) return null;

  // On check si la prochaine step est un diagnostic
  if (typeof nextId === "string" && nextId.startsWith("D")) {
    const diagnostic = quiz.diagnostics.find((d) => d.id === nextId);
    if (!diagnostic) return null;

    return {
      type: "diagnostic",
      data: diagnostic,
    };
  }

  const nextQuestion = quiz.questions.find((q) => q.id === nextId);
  if (!nextQuestion) return null;

  return {
    type: "question",
    data: nextQuestion,
  };
}
