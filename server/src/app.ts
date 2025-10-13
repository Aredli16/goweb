import express from 'express'
import questions from "./routes/questions";

const app = express()

app.use(express.json())

// Routes
app.use('/api/questions', questions)

export default app