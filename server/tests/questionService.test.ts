import {
  getFirstQuestion,
  getNextQuestion,
} from "../src/services/questionService";

describe("Question Service", () => {
  test("getFirstQuestion() should return the first question", () => {
    const question = getFirstQuestion();
    expect(question).toBeDefined();
    expect(question).toHaveProperty("id", 1);
    expect(question).toHaveProperty("question");
  });

  test("getNextQuestion() should return the next question when valid input", () => {
    const next = getNextQuestion(1, "plumbing");
    expect(next).toBeDefined();
    expect(next?.id).toBe(2);
  });

  test("getNextQuestion() should return null when invalid id", () => {
    const next = getNextQuestion(999, "plumbing");
    expect(next).toBeNull();
  });

  test("getNextQuestion() should return null when invalid answerId", () => {
    const next = getNextQuestion(1, "invalid_option");
    expect(next).toBeNull();
  });
});
