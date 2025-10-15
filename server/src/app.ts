import express from "express";
import cors from "cors";
import sessions from "./routes/sessions";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// Routes
app.use("/api/sessions", sessions);

export default app;
