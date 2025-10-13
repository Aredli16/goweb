import express from 'express'
import questions from "./routes/questions";
import cors from "cors"

const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json())

// Routes
app.use('/api/questions', questions)

export default app