import { useEffect, useState } from "react";
import type { Diagnostic, ISession, Question, StepResponse } from "common";

export function useQuestions() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const res = await fetch("http://localhost:3000/api/sessions", {
        method: "post",
      });
      const data = await res.json();
      setSessionId(data.sessionId);

      const step: StepResponse = data.step;
      if (step.type === "question") setCurrentQuestion(step.data);
      else setDiagnostic(step.data);
      setLoading(false);
    };

    initSession().catch(console.error);
  }, []);

  const goNext = async (answerId: string) => {
    if (!sessionId && !currentQuestion) return;

    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api/sessions/${sessionId}/next`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: currentQuestion?.id, answerId }),
      },
    );
    const next: StepResponse = await res.json();

    if (next.type === "question") {
      setCurrentQuestion(next.data);
      setDiagnostic(null);
    } else {
      setDiagnostic(next.data);
      setCurrentQuestion(null);
    }
    setLoading(false);
  };

  const goPrev = async () => {
    if (!sessionId) return;

    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api/sessions/${sessionId}/previous`,
      {
        method: "post",
      },
    );
    const prev: StepResponse = await res.json();

    if (prev.type === "question") {
      setCurrentQuestion(prev.data);
      setDiagnostic(null);
    } else {
      setDiagnostic(prev.data);
      setCurrentQuestion(null);
    }
    setLoading(false);
  };

  const submitSession = async (
    firstName: string,
    lastName: string,
    streetAddress: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    paymentMethod: string,
  ): Promise<ISession | void> => {
    if (!sessionId) return;
    const res = await fetch(
      `http://localhost:3000/api/sessions/${sessionId}/submit`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          streetAddress,
          postalCode,
          phoneNumber,
          email,
          paymentMethod,
        }),
      },
    );

    return await res.json();
  };

  return {
    currentQuestion,
    diagnostic,
    loading,
    error,
    goNext,
    goPrev,
    submitSession,
  };
}
