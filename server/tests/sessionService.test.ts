import { Session } from "../src/models/Session";
import Mock = jest.Mock;
import {
  getFirstQuestion,
  getNextQuestion,
  loadQuiz,
} from "../src/services/questionService";
import {
  addResponseAndGetNextQuestion,
  createSession,
  goPrevious,
  submitSession,
} from "../src/services/sessionService";
import { Quiz } from "common";
import { transporter } from "../src/lib/mail";

jest.mock("../src/models/Session");
jest.mock("../src/services/questionService");
jest.mock("../src/lib/mail", () => ({
  transporter: { sendMail: jest.fn() },
}));
jest.mock("../src/config/config", () => ({
  mailReceiver: "test@mail.com",
}));

describe("sessionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createSession", () => {
    test("should create a new session and return the first question", async () => {
      const fakeSession = { id: "abc123" };
      (Session.create as Mock).mockResolvedValue(fakeSession);
      (getFirstQuestion as Mock).mockReturnValue({
        id: 1,
        question: "Question 1",
      });

      const result = await createSession();

      expect(Session.create).toHaveBeenCalledWith({});
      expect(result.session).toEqual(fakeSession);
      expect(result.step).toEqual({
        type: "question",
        data: { id: 1, question: "Question 1" },
      });
    });
  });

  describe("addResponseAndGetNextQuestion", () => {
    test("should add response and return next question", async () => {
      const fakeSession = { id: "abc123", responses: [], save: jest.fn() };
      (Session.findById as Mock).mockResolvedValue(fakeSession);
      (getNextQuestion as Mock).mockReturnValue({
        type: "question",
        data: { id: 2, question: "Question 2" },
      });

      const next = await addResponseAndGetNextQuestion("abc123", 1, "option1");

      expect(fakeSession.responses).toEqual([
        { questionId: 1, answerId: "option1" },
      ]);
      expect(fakeSession.save).toHaveBeenCalled();
      expect(next).toEqual({
        type: "question",
        data: { id: 2, question: "Question 2" },
      });
    });

    test("should return null if session not found", async () => {
      (Session.findById as Mock).mockResolvedValue(null);
      const next = await addResponseAndGetNextQuestion("abc123", 1, "option1");
      expect(next).toBeNull();
    });
  });

  describe("goPrevious", () => {
    test("should return first question if no responses remaining", async () => {
      const fakeSession = {
        responses: [{ questionId: 1, answerId: "option1" }],
        save: jest.fn(),
      };
      (Session.findById as Mock).mockResolvedValue(fakeSession);
      (getFirstQuestion as Mock).mockReturnValue({
        id: 1,
        question: "Question 1",
      });

      const result = await goPrevious("abc123");

      expect(fakeSession.responses.length).toBe(0);
      expect(fakeSession.save).toHaveBeenCalled();
      expect(result).toEqual({
        type: "question",
        data: { id: 1, question: "Question 1" },
      });
    });

    test("should return previous question based on last response", async () => {
      const fakeSession = {
        responses: [
          { questionId: 1, answerId: "option1" },
          { questionId: 2, answerId: "option2" },
        ],
        save: jest.fn(),
      };
      (Session.findById as Mock).mockResolvedValue(fakeSession);
      (getNextQuestion as Mock).mockReturnValue({
        type: "question",
        data: { id: 1, question: "Question 1" },
      });

      const result = await goPrevious("abc123");

      expect(fakeSession.responses.length).toBe(1);
      expect(fakeSession.save).toHaveBeenCalled();
      expect(result).toEqual({
        type: "question",
        data: { id: 1, question: "Question 1" },
      });
    });

    test("should return null if session not found", () => {
      (Session.findById as Mock).mockResolvedValue(null);
      const result = goPrevious("abc123");
      expect(result).resolves.toBeNull();
    });

    describe("submitSession", () => {
      test("should send mail and isSubmitted to true", async () => {
        const fakeSession = {
          id: "abc123",
          responses: [
            { questionId: 1, answerId: "option1" },
            { questionId: 2, answerId: "option2" },
          ],
          save: jest.fn(),
          isSubmitted: false,
        };

        const fakeQuiz: Quiz = {
          questions: [
            {
              id: 1,
              question: "Q1",
              options: [{ id: "a1", label: "Option A" }],
            },
          ],
          diagnostics: [
            {
              id: "D1",
              title: "Diagnostic test",
              description: "desc",
              price: "100€",
              includes: ["Inclu A", "Inclu B"],
            },
          ],
        };

        (Session.findById as Mock).mockResolvedValue(fakeSession);
        (loadQuiz as Mock).mockReturnValue(fakeQuiz);
        (getNextQuestion as Mock).mockReturnValue({
          type: "diagnostic",
          data: fakeQuiz.diagnostics[0],
        });

        const result = await submitSession(
          "s1",
          "John",
          "Doe",
          "1 rue test",
          "75000",
          "0123456789",
          "john@mail.com",
          "onsite",
        );

        expect(result).toEqual(fakeSession);
        expect(transporter.sendMail).toHaveBeenCalled();
        expect(fakeSession.isSubmitted).toBe(true);
        expect(fakeSession.save).toHaveBeenCalled();
      });

      test("should return null if session not found", async () => {
        (Session.findById as Mock).mockResolvedValue(null);
        const result = await submitSession(
          "s1",
          "John",
          "Doe",
          "1 rue test",
          "75000",
          "0123456789",
          "john@mail.com",
          "onsite",
        );
        expect(result).toBeNull();
      });
    });
  });
});
