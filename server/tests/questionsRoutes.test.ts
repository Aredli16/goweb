import request from "supertest";
import app from "../src/app";

describe("Questions API", () => {
  test("GET /api/questions should return the first question", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("question");
  });

  test("POST /api/questions/1/plumbing should return next question", async () => {
    const res = await request(app).post("/api/questions/1/plumbing");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 2);
  });

  test("POST /api/questions/999/plumbing should return 404", async () => {
    const res = await request(app).post("/api/questions/999/plumbing");
    expect(res.status).toBe(404);
  });
});
