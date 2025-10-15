import { Session } from "../models/Session";
import { getFirstQuestion, getNextQuestion, loadQuiz } from "./questionService";
import { Diagnostic, ISession, Question, Quiz, StepResponse } from "common";
import { transporter } from "../lib/mail";
import config from "../config/config";

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

export const submitSession = async (
  sessionId: string,
  firstName: string,
  lastName: string,
  streetAddress: string,
  postalCode: string,
  phoneNumber: string,
  email: string,
  paymentMethod: string,
): Promise<ISession | null> => {
  const session = await Session.findById(sessionId);
  if (!session) return null;

  const quiz: Quiz = loadQuiz();

  // Construire le tableau des réponses avec libellés
  const responseRows = session.responses
    .map((resp) => {
      const question: Question | undefined = quiz.questions.find(
        (q) => q.id === resp.questionId,
      );
      if (!question) return "";
      const answerLabel =
        question.options.find((o) => o.id === resp.answerId)?.label ||
        resp.answerId;
      return `<tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>${question.question}</b></td><td>${answerLabel}</td></tr>`;
    })
    .join("");

  // Identifier le diagnostic final si le dernier step était un diagnostic
  let diagnosticHtml = "";
  let diagnosticTitle = ""; // <-- Pour le subject
  if (session.responses.length > 0) {
    const lastResponse = session.responses[session.responses.length - 1];
    const step = getNextQuestion(
      lastResponse.questionId,
      lastResponse.answerId,
    );
    if (step && step.type === "diagnostic") {
      const diag: Diagnostic = step.data;
      diagnosticTitle = diag.title; // <-- On récupère le titre
      diagnosticHtml = `
        <h3 style="color: #007BFF;">Diagnostic final</h3>
        <p><b>${diag.title}</b></p>
        <p>${diag.description}</p>
        <p><b>Prix :</b> ${diag.price}</p>
        <p><b>Inclus :</b></p>
        <ul>
          ${diag.includes.map((i) => `<li>${i}</li>`).join("")}
        </ul>
      `;
    }
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007BFF;">Nouvelle demande de diagnostic</h2>
      <p>Bonjour,</p>
      <p>Un client vient de soumettre une commande via le formulaire. Voici les détails :</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>Prénom :</b></td><td>${firstName}</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>Nom :</b></td><td>${lastName}</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>Adresse :</b></td><td>${streetAddress}</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>Code postal :</b></td><td>${postalCode}</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>Téléphone :</b></td><td>${phoneNumber}</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>Email :</b></td><td>${email}</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>Mode de paiement :</b></td><td>${paymentMethod === "onsite" ? "Sur place" : "En ligne"}</td></tr>
      </table>

      <h3 style="margin-top: 20px; color: #007BFF;">Réponses du client</h3>
      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        ${responseRows}
      </table>

      ${diagnosticHtml}

      <p style="margin-top: 20px;">Merci de prendre contact avec le client dans les plus brefs délais.</p>
      <p style="color: #777;">— L'équipe de votre service de diagnostic</p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Service de diagnostic" <no-reply@email.com>',
    to: config.mailReceiver,
    subject: diagnosticTitle
      ? `Nouvelle commande - ${diagnosticTitle}`
      : `Nouvelle commande - ${session.id}`,
    html,
  });

  session.isSubmitted = true;
  await session.save();

  return session;
};
