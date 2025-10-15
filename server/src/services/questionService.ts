import path from "node:path";
import * as fs from "node:fs";

interface Question {
  id: number;
  question: string;
  options: { id: string; label: string }[];
  next?: Record<string, number>;
}

function loadQuestions(): Question[] {
  const filePath = path.join(__dirname, "../data/questions.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function getFirstQuestion() {
  const questions = loadQuestions();
  return questions[0];
}

export function getNextQuestion(currentQuestionId: number, answerId: string) {
  const questions = loadQuestions();
  const current = questions.find((q) => q.id === currentQuestionId);

  if (!current) return null;

  const nextId = current.next?.[answerId];
  if (!nextId) return null;

  const nextQuestion = questions.find((q) => q.id === nextId);
  return nextQuestion || null;
}
