import {Router} from "express";
import {getFirstQuestion, getNextQuestion} from "../services/questionService";

const router = Router()

router.get('/', (req, res) => res.json(getFirstQuestion()))

router.post("/:id/:answerId", (req, res) => {
    const { id, answerId } = req.params

    if (!id || !answerId) {
        return res.status(400).json({ error: "Missing required fields" })
    }

    const nextQuestion = getNextQuestion(Number(id), answerId)

    if (!nextQuestion) {
        return res.status(404).json({ error: "Question not found" })
    }

    res.json(nextQuestion)
})

export default router