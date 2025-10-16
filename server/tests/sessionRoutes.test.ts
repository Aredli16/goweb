import * as sessionService from "../src/services/sessionService";
import { ISession } from "common";
import request from "supertest";
import app from "../src/app";

describe("sessionRoutes", () => {
  test("POST /api/sessions should create a new session and return the first question", async () => {
    jest.spyOn(sessionService, "createSession").mockResolvedValue({
      session: { id: "1" } as ISession,
      step: {
        type: "question",
        data: { id: 1, question: "Test?", options: [] },
      },
    });

    const res = await request(app).post("/api/sessions");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      sessionId: "1",
      step: {
        type: "question",
        data: { id: 1, question: "Test?", options: [] },
      },
    });
  });

  test("POST /api/sessions/:sessionId/next should add response and return next question", async () => {
    jest
      .spyOn(sessionService, "addResponseAndGetNextQuestion")
      .mockResolvedValue({
        type: "question",
        data: { id: 2, question: "Test?", options: [] },
      });

    const res = await request(app)
      .post("/api/sessions/1/next")
      .send({ questionId: 1, answerId: "a" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      type: "question",
      data: { id: 2, question: "Test?", options: [] },
    });
  });

  test("POST /api/sessions/:sessionId/next should return 400 if params are missing", async () => {
    const res = await request(app).post("/api/sessions/1/next").send({});

    expect(res.status).toBe(400);
  });

  test("POST /api/sessions/:id/previous should return previous question", async () => {
    jest.spyOn(sessionService, "goPrevious").mockResolvedValue({
      type: "question",
      data: { id: 1, question: "Test?", options: [] },
    });
    const res = await request(app).post("/api/sessions/123/previous");

    expect(res.status).toBe(200);
    expect(res.body.type).toBe("question");
  });

  test("POST /api/sessions/:id/submit should submit session", async () => {
    jest.spyOn(sessionService, "submitSession").mockResolvedValue({
      id: "123",
      isSubmitted: true,
    } as ISession);
    const res = await request(app).post("/api/sessions/123/submit").send({
      firstName: "John",
      lastName: "Doe",
      streetAddress: "1 rue test",
      postalCode: "75000",
      phoneNumber: "0123456789",
      email: "john@mail.com",
      paymentMethod: "onsite",
    });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("123");
  });
});
