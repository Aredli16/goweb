import { ISession, Session } from "../models/Session";
import { getFirstQuestion, getNextQuestion } from "./questionService";
import { StepResponse } from "common";

/**
 * Crée une nouvelle session et retourne la première question du questionnaire
 */
export const createSession = async (): Promise<{
  session: ISession;
  step: StepResponse;
}> => {
  const session = await Session.create({});
  const first = getFirstQuestion();
  return { session, step: { type: "question", data: first } };
};

/**
 * Ajouter une réponse et obtenir la question suivante
 */
export const addResponseAndGetNextQuestion = async (
  sessionId: string,
  questionId: number,
  answerId: string,
): Promise<StepResponse | null> => {
  const session = await Session.findById(sessionId);
  if (!session) return null;

  // Stocker la réponse dans la session pour le suivi
  session.responses.push({ questionId, answerId });
  await session.save();

  // Calculer la prochaine question
  return getNextQuestion(questionId, answerId);
};

export const goPrevious = async (
  sessionId: string,
): Promise<StepResponse | null> => {
  const session = await Session.findById(sessionId);
  if (!session) return null;

  // Supprimer la dernière réponse
  session.responses.pop();
  await session.save();

  // Si plus de réponses → première question
  if (session.responses.length === 0) {
    return { type: "question", data: getFirstQuestion() };
  }

  // Sinon, on reprend à partir de la dernière réponse restante
  const lastResponse = session.responses[session.responses.length - 1];
  return getNextQuestion(lastResponse.questionId, lastResponse.answerId);
};
