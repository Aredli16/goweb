import { Router } from "express";
import {
  addResponseAndGetNextQuestion,
  createSession,
  goPrevious,
  submitSession,
} from "../services/sessionService";

const router = Router();

// Créer une session et obtenir la première question
router.post("/", async (req, res) => {
  const { session, step } = await createSession();
  res.json({ sessionId: session.id, step });
});

// Répondre à une question et obtenir la prochaine
router.post("/:sessionId/next", async (req, res) => {
  const { sessionId } = req.params;
  const { questionId, answerId } = req.body;

  if (questionId === undefined || !answerId) {
    return res.status(400).json({ error: "Missing questionId or answerId" });
  }

  const next = await addResponseAndGetNextQuestion(
    sessionId,
    questionId,
    answerId,
  );
  if (!next) return res.status(404).json({ error: "Next question not found" });

  res.json(next);
});

// Revenir en arrière
router.post("/:sessionId/previous", async (req, res) => {
  const { sessionId } = req.params;
  const previous = await goPrevious(sessionId);
  if (!previous)
    return res
      .status(404)
      .json({ error: "Session or previous question not found" });

  res.json(previous);
});

// Envoi de la session à l'artisan : l'artisan recevra un email avec les détails du problème ainsi que les informations de contact et de paiement du client
router.post("/:sessionId/submit", async (req, res) => {
  const { sessionId } = req.params;
  const {
    firstName,
    lastName,
    streetAddress,
    postalCode,
    phoneNumber,
    email,
    paymentMethod,
  } = req.body;

  const session = await submitSession(
    sessionId,
    firstName,
    lastName,
    streetAddress,
    postalCode,
    phoneNumber,
    email,
    paymentMethod,
  );

  if (!session) return res.status(404).json({ error: "Session not found" });

  res.json(session);
});

export default router;
